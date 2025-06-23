const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Ensure the correct model is used
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

// JWT Secret
const SECRET_KEY = process.env.SECRET_KEY || "your_jwt_secret";

// User Registration (Normal User)
router.post("/register/user", async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role: "user", // Default role as 'user'
      isVerified: true, // Automatically verified
    });

    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Doctor Registration
router.post("/register/doctor", async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check if the doctor already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new doctor
    const newDoctor = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      role: "doctor", // Role as 'doctor'
      isVerified: false, // Not verified by default
    });

    await newDoctor.save();

    res
      .status(201)
      .json({ message: "Agent registered successfully", user: newDoctor });
  } catch (error) {
    console.error("Error during agent registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/report", upload.single("evidence"), async (req, res) => {
//     const { crimeType, description, location } = req.body;
//     const evidenceFile = req.file ? req.file.path : null;

//     const userId = req.user.userId;
//     // Check if the user exists
//     const user = await userModel.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Create the crime report
//     const report = new CrimeReport({
//       userId: userId,
//       crimeType,
//       description,
//       location,
//       evidence: evidenceFile,
//     });

//     try {
//       await report.save();
//       return res.status(200).json({ message: "Crime reported successfully." });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ message: "Error reporting the crime. Try again later." });
//     }
//   });

module.exports = router;
