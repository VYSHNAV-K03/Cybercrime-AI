import React, { useState } from "react";
import { apiUrl } from "../axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";

const URLChecker = () => {
    const [url, setUrl] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        if (!url.trim()) {
            setResult({ safe: false, message: "❌ Please enter a valid URL." });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(apiUrl + "api/crime/scan-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            const analysisId = data.data?.id;
            const cleanId = analysisId.replace(/^u-/, "").replace(/-\d+$/, ""); 

            const reportUrl = `https://www.virustotal.com/gui/url/${cleanId}`;

            setResult({
                safe: true,
                message: "✅ URL submitted successfully for scanning.",
                details: reportUrl,
            });
        } catch (error) {
            setResult({ safe: false, message: "❌ Error checking the URL. Try again later." });
        }

        setLoading(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg p-4" style={{ maxWidth: "500px", width: "100%" }}>
                <h3 className="text-center mb-3">🔍 VirusTotal URL Safety Checker</h3>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                <button
                    className="btn btn-primary w-100"
                    onClick={handleCheck}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Checking...
                        </>
                    ) : (
                        "Check URL"
                    )}
                </button>

                {result && (
                    <div className={`alert mt-3 ${result.safe ? "alert-success" : "alert-danger"}`}>
                        {result.message}
                    </div>
                )}

                {result?.details && (
                    <div className="mt-2 text-center">
                        <a
                            href={result.details}
                            className="btn btn-outline-success btn-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            🔗 View Full Report on VirusTotal
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default URLChecker;
