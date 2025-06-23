import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import axios from "axios";
import { apiUrl } from "../axiosInstance";

const AgentPanel = () => {
  const [reports, setReports] = useState([]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaintText, setSelectedComplaintText] = useState("");

  console.log("complaints", complaints);

  useEffect(() => {
    const fetchCrimeReports = async () => {
      try {
        const response = await axios.get(apiUrl + "api/crime/crimes");
        setReports(response.data);
      } catch (error) {
        console.error("Error fetching crime reports:", error);
      }
    };

    const fetchComplaints = async () => {
      try {
        const response = await axios.get(apiUrl + "api/crime/complaints");
        setComplaints(response.data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchCrimeReports();
    fetchComplaints();
  }, []);

  const handleEvidenceClick = (evidencePath) => {
    setSelectedEvidence(apiUrl + evidencePath);
    const modal = new window.bootstrap.Modal(
      document.getElementById("evidenceModal")
    );
    modal.show();
  };

  const handleViewComplaint = (text) => {
    setSelectedComplaintText(text);
    const modal = new window.bootstrap.Modal(
      document.getElementById("complaintModal")
    );
    modal.show();
  };

  return (
    <div className="container mt-5">
      <ul className="nav nav-tabs mb-4" id="agentTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="crime-tab"
            data-bs-toggle="tab"
            data-bs-target="#crime"
            type="button"
            role="tab"
          >
            Crime Reports
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="complaints-tab"
            data-bs-toggle="tab"
            data-bs-target="#complaints"
            type="button"
            role="tab"
          >
            Complaints
          </button>
        </li>
      </ul>

      <div className="tab-content" id="agentTabContent">
        {/* Tab 1: Crime Reports (Unchanged existing content) */}
        <div className="tab-pane fade show active" id="crime" role="tabpanel">
          {/* Your original crime reports table is below and untouched */}
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Crime Reports Dashboard</h2>
            <p className="text-muted">Monitor and review reported crimes</p>
          </div>

          {reports.length === 0 ? (
            <div className="alert alert-info text-center">
              No reports found.
            </div>
          ) : (
            <div className="table-responsive shadow rounded p-3 bg-light">
              <table className="table table-striped table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>User Name</th>
                    <th>Phone</th>
                    <th>Crime Type</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Timestamp</th>
                    <th>Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={report._id}>
                      <td>{index + 1}</td>
                      <td>{report.userId?.username || "Unknown"}</td>
                      <td>{report.userId?.phone || "Unknown"}</td>
                      <td>
                        <span className="badge bg-danger">
                          {report.crimeType}
                        </span>
                      </td>
                      <td>{report.description}</td>
                      <td>{report.location}</td>
                      <td>
                        <small className="text-muted">
                          {new Date(report.timestamp).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        {report.evidence ? (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEvidenceClick(report.evidence)}
                          >
                            View Evidence
                          </button>
                        ) : (
                          <span className="text-secondary">No Evidence</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tab 2: Complaints */}
        <div className="tab-pane fade" id="complaints" role="tabpanel">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-danger">Complaint Letters</h2>
            <p className="text-muted">Generated complaint records</p>
          </div>

          {complaints.length === 0 ? (
            <div className="alert alert-info text-center">
              No complaints found.
            </div>
          ) : (
            <div className="table-responsive shadow rounded p-3 bg-light">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-danger">
                  <tr>
                    <th>#</th>
                    <th>Comment</th>
                    <th>Label</th>
                    <th>Description</th>
                    <th>Legal</th>
                    <th>View Complaint</th>
                    <th>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c, index) => (
                    <tr key={c._id}>
                      <td>{index + 1}</td>
                      <td>{c.comment}</td>
                      <td>
                        <span className="badge bg-warning text-dark">
                          {c.label}
                        </span>
                      </td>
                      <td>{c.description}</td>
                      <td>{c.legal}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => handleViewComplaint(c.complaintText)}
                        >
                          View
                        </button>
                      </td>
                      <td>
                        <small className="text-muted">
                          {new Date(c.submittedAt).toLocaleString()}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing evidence */}
      <div
        className="modal fade"
        id="evidenceModal"
        tabIndex="-1"
        aria-labelledby="evidenceModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="evidenceModalLabel">
                Evidence Image
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body text-center">
              {selectedEvidence ? (
                <img
                  src={selectedEvidence}
                  alt="Crime Evidence"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: "500px" }}
                />
              ) : (
                <p>No evidence available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="complaintModal"
        tabIndex="-1"
        aria-labelledby="complaintModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="complaintModalLabel">
                Complaint Letter
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <pre
                className="bg-dark p-3 rounded"
                style={{ whiteSpace: "pre-wrap" }}
              >
                {selectedComplaintText}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPanel;
