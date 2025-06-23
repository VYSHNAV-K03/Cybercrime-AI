import React, { useState, useEffect } from "react";
import { apiUrl } from "../axiosInstance"; // Adjust API URL if needed
import "bootstrap/dist/css/bootstrap.min.css";

const CrimeReporting = () => {
  const [crimeType, setCrimeType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [evidence, setEvidence] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportedCrimes, setReportedCrimes] = useState([]);

  console.log(reportedCrimes);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReportedCrimes = async () => {
      try {
        const response = await fetch(apiUrl + "api/crime/reports", {
          headers: {
            "x-auth-token": token,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch reported crimes.");

        const data = await response.json();
        setReportedCrimes(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReportedCrimes();
  }, [token]);

  const handleFileChange = (e) => setEvidence(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!crimeType || !description || !location) {
      setMessage("❌ Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("crimeType", crimeType);
    formData.append("description", description);
    formData.append("location", location);
    if (evidence) formData.append("evidence", evidence);

    try {
      const response = await fetch(apiUrl + "api/crime/report", {
        method: "POST",
        body: formData,
        headers: {
          "x-auth-token": token,
        },
      });

      if (!response.ok) throw new Error("Failed to report the crime.");

      const data = await response.json();
      setMessage(data.message || "✅ Crime reported successfully.");

      // Re-fetch the crimes after a successful report
      const newResponse = await fetch(apiUrl + "api/crime/reports", {
        headers: {
          "x-auth-token": token,
        },
      });
      const newData = await newResponse.json();
      setReportedCrimes(newData);
    } catch (error) {
      setMessage("❌ Error reporting the crime. Try again later.");
    }

    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">🛑 Report a Crime</h3>
      <div className="row">
        {/* Left section - Report crime form */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="card p-4 shadow-lg">
            <div className="mb-3">
              <label htmlFor="crimeType" className="form-label">
                Crime Type
              </label>
              <input
                type="text"
                id="crimeType"
                className="form-control"
                value={crimeType}
                onChange={(e) => setCrimeType(e.target.value)}
                placeholder="Enter the type of crime"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                className="form-control"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide a detailed description of the crime"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter the location of the crime"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="evidence" className="form-label">
                Upload Evidence (Optional)
              </label>
              <input
                type="file"
                id="evidence"
                accept=".jpg, .jpeg, .png"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            <button
              type="submit"
              className="btn btn-danger w-100"
              disabled={loading}
            >
              {loading ? "Reporting..." : "Report Crime"}
            </button>

            {message && (
              <div
                className={`alert mt-3 ${
                  message.startsWith("❌") ? "alert-danger" : "alert-success"
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Right section - Display reported crimes */}
        <div className="col-md-6">
          <h4>🔍 Your Reported Crimes</h4>
          {reportedCrimes.length === 0 ? (
            <p>No crimes reported yet.</p>
          ) : (
            <ul className="list-group">
              {reportedCrimes.map((crime) => (
                <li key={crime._id} className="list-group-item mb-3">
                  <h5>{crime.crimeType}</h5>
                  <p>{crime.description}</p>
                  <p>
                    <strong>Location:</strong> {crime.location}
                  </p>
                  {crime.evidence && (
                    // <a href={`${apiUrl}${crime.evidence}`} className="btn btn-danger"  target="_blank" >
                    //   View Evidence
                    // </a>
                    <img
                      className="img-fluid w-50 h-50"
                      src={`${apiUrl}${crime.evidence}`}
                      alt=""
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrimeReporting;
