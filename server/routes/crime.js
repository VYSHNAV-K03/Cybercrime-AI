const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const CrimeReport = require("../models/CrimeReport");
const userModel = require("../models/userModel");
const { request } = require("http");
const { authMiddleware } = require("../middleware/authMiddleware");
const { HfInference } = require("@huggingface/inference");
const Complaint = require("../models/Complaint");

const API_KEY = process.env.VIRUSTOTAL_API_KEY;

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const hf = new HfInference("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");
const HF_API_KEY = "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";

router.post("/classify", async (req, res) => {
  try {
    const { comment } = req.body;
    console.log(comment);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: comment,
        parameters: {
          candidate_labels: [
            "Positive",
            "Negative",
            "Offensive",
            "Sexual",
            "Hate Speech",
            "Insult",
            "Threat",
            "Spam",
            "Neutral",
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const classifications = response.data;

    // Find the label with the highest score
    const topLabel = classifications.labels[0];
    const topScore = classifications.scores[0];

    console.log({ label: topLabel, confidence: topScore });
    res.json({ label: topLabel, confidence: topScore });
  } catch (error) {
    console.log("Error:", error.message);

    res.status(500).json({ error: error.message });
  }
});

router.post(
  "/report",
  authMiddleware,
  upload.single("evidence"),
  async (req, res) => {
    const { crimeType, description, location } = req.body;
    const evidenceFile = req.file ? req.file.path : null;

    const userId = req.user.userId;
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Create the crime report
    const report = new CrimeReport({
      userId: userId,
      crimeType,
      description,
      location,
      evidence: evidenceFile,
    });

    try {
      await report.save();
      return res.status(200).json({ message: "Crime reported successfully." });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error reporting the crime. Try again later." });
    }
  }
);

// Route to fetch the crimes reported by the user
router.get("/reports", authMiddleware, async (req, res) => {
  try {
    const reports = await CrimeReport.find({ userId: req.user.userId });
    res.json(reports);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reports. Try again later." });
  }
});

//   for agent
router.get("/crimes", async (req, res) => {
  try {
    const reports = await CrimeReport.find().populate(
      "userId",
      "username phone"
    );
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch crime reports" });
  }
});

router.post("/save-complaint", async (req, res) => {
  try {
    const { comment, label, description, legal, wiki, complaint } = req.body;

    const newComplaint = new Complaint({
      comment,
      label,
      description,
      legal,
      wiki,
      complaintText: complaint,
    });

    await newComplaint.save();
    res.status(201).json({ message: "Complaint saved successfully!" });
  } catch (error) {
    console.error("Error saving complaint:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/complaints", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    console.error("Error fetching complaints:", error);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// GET total number of comments
router.get("/comments/count", async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    res.json({ total });
  } catch (err) {
    console.error("Error counting comments:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// GET total number of crime reports
router.get("/count", async (req, res) => {
  try {
    const total = await CrimeReport.countDocuments(); // Assuming model is named Crime
    res.json({ total });
  } catch (err) {
    console.error("Error counting crime reports:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/scan-url", async (req, res) => {
  try {
    const { url } = req.body;
    const response = await axios.post(
      "https://www.virustotal.com/api/v3/urls",
      new URLSearchParams({ url }),
      {
        headers: {
          "x-apikey": API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to check URL" });
  }
});

router.post("/scan-file", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));

    // Upload file to VirusTotal
    const uploadResponse = await axios.post(
      "https://www.virustotal.com/api/v3/files",
      formData,
      {
        headers: {
          "x-apikey": API_KEY,
          ...formData.getHeaders(),
        },
      }
    );

    fs.unlinkSync(req.file.path); // Clean up temporary file
    const fileId = uploadResponse.data.data.id;

    // Poll VirusTotal API until the report is ready
    let scanCompleted = false;
    let scanResult = null;
    let attempts = 0;

    while (!scanCompleted && attempts < 10) {
      // Max 10 attempts (~50 sec max)
      await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds
      const analysisResponse = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${fileId}`,
        {
          headers: {
            "x-apikey": API_KEY,
          },
        }
      );

      scanResult = analysisResponse.data;
      const status = scanResult.data.attributes.status;

      if (status === "completed") {
        scanCompleted = true;
      }

      attempts++;
    }

    const reportUrl = `https://www.virustotal.com/gui/file/${fileId}`;
    res.json({ message: "File scanned successfully.", reportUrl });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to scan file" });
  }
});

router.get("/scan-domain/:domain", async (req, res) => {
  try {
    const { domain } = req.params;
    const response = await axios.get(
      `https://www.virustotal.com/api/v3/domains/${domain}`,
      {
        headers: { "x-apikey": API_KEY },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to scan domain" });
  }
});

router.get("/scan-ip/:ip", async (req, res) => {
  try {
    const { ip } = req.params;
    const response = await axios.get(
      `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
      {
        headers: { "x-apikey": API_KEY },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// router.post("/classify", async (req, res) => {
//     try {
//         const { comment } = req.body;
//         console.log("Received Comment:", comment);
//         console.log("Cohere API Key:", process.env.COHERE_API_KEY);

//         const response = await axios.post(
//             "https://api.cohere.ai/classify",
//             {
//                 inputs: [comment],
//                 examples: [
//                     { text: "This product is amazing!", label: "Good" },
//                     { text: "Terrible experience, I hate it!", label: "Bad" },
//                     { text: "Check out this link to earn money!", label: "Spam" },
//                     { text: "Can someone help me with this issue?", label: "Question" },
//                     { text: "I love you so much!", label: "Affection" },
//                     { text: "This content is inappropriate", label: "Inappropriate" },
//                     { text: "You are an idiot!", label: "Offensive" },
//                     { text: "Let's meet for a romantic night", label: "Sexual" }
//                 ],
//             },
//             {
//                 headers: {
//                     "Authorization": `Bearer ${process.env.COHERE_API_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//             }
//         );

//         console.log("Analysis Result:", response.data);

//         const classification = response.data.classifications[0];
//         res.json({
//             comment,
//             category: classification.prediction,
//             confidence: classification.confidence,
//         });
//     } catch (error) {
//         console.log("Error:", error.message);

//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;
