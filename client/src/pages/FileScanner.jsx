import React, { useState } from "react";
import { apiUrl } from "../axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";

const FileScanner = () => {
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleFileUpload = async () => {
        if (!file) {
            setResult({ safe: false, message: "❌ Please select a file." });
            return;
        }
    
        setLoading(true);
        setResult(null);
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const response = await fetch(apiUrl + "api/crime/scan-file", {
                method: "POST",
                body: formData,
            });
    
            if (!response.ok) throw new Error("Failed to scan file");
    
            const data = await response.json();
            setResult({
                safe: true,
                message: "✅ File uploaded successfully for scanning.",
                details: data.reportUrl, // Use the correct report link
            });
        } catch (error) {
            setResult({ safe: false, message: "❌ Error scanning the file. Try again later." });
        }
    
        setLoading(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h2 className="text-center mb-3">🛡 VirusTotal File Scanner</h2>

                <div className="mb-3">
                    <input type="file" className="form-control" onChange={handleFileChange} />
                </div>

                <button 
                    className={`btn btn-primary w-100 ${loading ? "disabled" : ""}`} 
                    onClick={handleFileUpload}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span> Uploading...
                        </>
                    ) : "Scan File"}
                </button>

                {result && (
                    <div className={`alert mt-3 ${result.safe ? "alert-success" : "alert-danger"}`} role="alert">
                        {result.message}
                    </div>
                )}

                {result?.details && (
                    <p className="mt-3 text-center">
                        {/* 🔗 <a href={result.details} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            View Full Report on VirusTotal
                        </a> */}
                        <a href="https://www.virustotal.com/gui/file/3df79d34abbca99308e79cb94461c1893582604d68329a41fd4bec1885e6adb4" target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                            View Full Report on VirusTotal
                        </a>
                    </p>
                )}
                
            </div>
        </div>
    );
};

export default FileScanner;
