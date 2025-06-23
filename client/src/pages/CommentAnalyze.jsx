import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../axiosInstance";

const CommentClassifier = () => {
  const [comment, setComment] = useState("");
  const [result, setResult] = useState(null);

  const classifyComment = async () => {
    try {
      const response = await axios.post(apiUrl + "api/crime/classify", {
        comment,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error classifying comment:", error);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100 ">
      <div className="card shadow-lg p-4 w-50">
        <h2 className="text-center mb-3 text-primary">Comment Classifier</h2>

        <textarea
          className="form-control mb-3"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter a comment..."
          rows="4"
        />

        <button className="btn btn-primary w-100" onClick={classifyComment}>
          Classify
        </button>

        {result && (
          <div className="alert alert-info mt-4 fade show">
            <h4 className="mb-2">Classification Result:</h4>
            <p>
              <strong>Label:</strong> {result.label}
            </p>
            <p>
              <strong>Confidence:</strong> {result.confidence.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentClassifier;
