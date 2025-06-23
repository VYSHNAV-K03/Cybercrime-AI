import React, { useState } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";

const CommentAnalyseFlask = () => {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState(null);
  const [complaint, setComplaint] = useState(null);

  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [evidence, setEvidence] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setComplaint(null);
    try {
      const res = await axios.post("http://localhost:5000/predict", {
        comment,
      });
      setResult(res.data);
    } catch (err) {
      console.error("Prediction error:", err);
    }
  };

  const handleGenerateComplaint = async () => {
    try {
      const res = await axios.post("http://localhost:5000/generate_complaint", {
        comment,
        label: result.label,
        name,
        email,
        location,
        evidence,
      });
      setComplaint(res.data.complaint);
    } catch (err) {
      console.error("Complaint generation error:", err);
    }
  };

  // Add this inside your component, below handleGenerateComplaint
  const handleSendToBackend = async () => {
    try {
      await axiosInstance.post("/crime/save-complaint", {
        comment,
        label: result.label,
        description: result.description,
        legal: result.legal,
        wiki: result.wiki,
        complaint, // the full generated letter
      });
      alert("✅ Complaint successfully sent to backend!");
    } catch (err) {
      console.error("Send to backend error:", err);
      alert("❌ Failed to send complaint to backend.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow-lg p-4 w-50">
        <h2 className="text-center mb-3 text-primary">Comment Classifier</h2>

        <textarea
          className="form-control mb-3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter a comment..."
          rows="4"
        />

        <button className="btn btn-primary w-100" onClick={handleSubmit}>
          Classify
        </button>

        {result && (
          <>
            <div className="alert alert-info mt-4 fade show">
              <h4 className="mb-2">Classification Result:</h4>
              <p>
                <strong>🛑 Prediction:</strong> {result.label}
              </p>
              <p>
                <strong>Description:</strong> {result.description}
              </p>
              <p>
                <strong>Legal Info:</strong> {result.legal}
              </p>
              <p>
                <strong>Learn more:</strong>{" "}
                <a
                  href={result.wiki}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-primary"
                >
                  {result.wiki}
                </a>
              </p>
            </div>

            <div className="mt-3">
              <h5 className="text-secondary">Generate Complaint Letter</h5>
              <input
                className="form-control mb-2"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setname(e.target.value)}
              />
              <input
                className="form-control mb-2"
                type="email"
                placeholder="Your email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="form-control mb-2"
                placeholder="Your location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <input
                className="form-control mb-2"
                placeholder="Any evidence (link or desc)"
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
              />

              <button
                className="btn btn-warning w-100 mt-2"
                onClick={handleGenerateComplaint}
              >
                Generate Complaint Letter
              </button>
            </div>
          </>
        )}

        {complaint && (
          <div
            className=" alert alert-secondary mt-4"
            style={{ whiteSpace: "pre-wrap", overflow: "auto" }}
          >
            <h5>📄 Generated Complaint:</h5>
            {complaint}
            <button
              className="btn btn-success mt-3 w-100"
              onClick={handleSendToBackend}
            >
              📬 Send Complaint to Cyber Cell Database
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentAnalyseFlask;
