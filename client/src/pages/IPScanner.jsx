import React, { useState } from "react";
import { apiUrl } from "../axiosInstance";
import "bootstrap/dist/css/bootstrap.min.css";

const IPScanner = () => {
    const [ip, setIp] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        if (!ip.trim()) {
            setResult({ safe: false, message: "❌ Please enter a valid IP address." });
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch(apiUrl + `api/crime/scan-ip/${ip}`);
            if (!response.ok) throw new Error("Failed to fetch data");

            const data = await response.json();
            const reportUrl = `https://www.virustotal.com/gui/ip-address/${ip}`;

            setResult({
                safe: true,
                message: "✅ IP address scanned successfully.",
                details: reportUrl,
            });
        } catch (error) {
            setResult({ safe: false, message: "❌ Error scanning the IP. Try again later." });
            console.log(error);
        }

        setLoading(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
            <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "600px" }}>
                <h3 className="text-center mb-4">🌐 VirusTotal IP Scanner</h3>

                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter IP address..."
                        value={ip}
                        onChange={(e) => setIp(e.target.value)}
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
                        "Check IP"
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

export default IPScanner;
