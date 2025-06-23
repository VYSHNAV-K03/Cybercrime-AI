import React, { useState } from "react";
import { FaTachometerAlt, FaFileAlt, FaBell, FaUsers, FaCog } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "reports", label: "Report Crime", icon: <FaFileAlt /> },
    { id: "ip", label: "Check Ip", icon: <FaBell /> },
    { id: "url", label: "Check Url", icon: <FaUsers /> },
    { id: "domain", label: "Check Domain", icon: <FaCog /> },
    { id: "file", label: "Check File", icon: <FaFileAlt /> },
    { id: "comment", label: "Comment Analyze", icon: <FaFileAlt /> },
    // { id: "incident", label: "Incident", icon: <FaCog /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Cybercrime Detection System</h1>
      </header>

      {/* Tabs Navigation */}
      <nav className="tabs-navigation">
        <ul>
          {tabs.map((tab) => (
            <li
              key={tab.id}
              className={activeTab === tab.id ? "tab active" : "tab"}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="tab-content">
        {activeTab === "dashboard" && (
          <section className="tab-panel dashboard-tab">
            <h2>Dashboard</h2>
            <div className="card-container">
              <div className="card">
                <h3>Total Cases</h3>
                <p>1,234</p>
              </div>
              <div className="card">
                <h3>Active Alerts</h3>
                <p>56</p>
              </div>
              <div className="card">
                <h3>Resolved Cases</h3>
                <p>987</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "reports" && (
          <section className="tab-panel reports-tab">
            <h2>Report Crime</h2>
            <a className="btn btn-primary" href="/crimereporting">Click</a>
          </section>
        )}
        
        {activeTab === "ip" && (
          <section className="tab-panel settings-tab">
            <h2>Scan File</h2>
            <p>Scan or check the file here.</p>
            <a className="btn btn-primary" href="/ipcheck">Click</a>
          </section>
        )}
        
        {activeTab === "url" && (
          <section className="tab-panel settings-tab">
            <h2>Settings</h2>
            <p>Scan or check the file here.</p>
            <a className="btn btn-primary" href="/urlcheck">Click</a>
          </section>
        )}
        
        {activeTab === "domain" && (
          <section className="tab-panel settings-tab">
            <h2>Settings</h2>
            <p>Scan or check the file here.</p>
            <a className="btn btn-primary" href="/domaincheck">Click</a>
          </section>
        )}

      

        {activeTab === "file" && (
          <section className="tab-panel settings-tab">
            <h2>Settings</h2>
            <p>Scan or check the file here.</p>
            <a className="btn btn-primary" href="/filecheck">Click</a>
          </section>
        )}
        {activeTab === "comment" && (
          <section className="tab-panel settings-tab">
            <h2>Settings</h2>
            <p>Scan or check the comment here.</p>
            <a className="btn btn-primary" href="/comment">Click</a>
          </section>
        )}
       

{activeTab === "incident" && (
  <section className="tab-panel incidents-tab">
    {/* Incident Management Header */}
    <header className="incident-header">
      <h2>Incident Management</h2>
      <p>Manage and track all reported incidents effectively.</p>
    </header>

    {/* Incident Summary Cards */}
    <div className="incident-stats">
      <div className="card">
        <h3>Total Incidents</h3>
        <p>1,245</p>
      </div>
      <div className="card">
        <h3>Open Incidents</h3>
        <p>320</p>
      </div>
      <div className="card">
        <h3>Resolved Incidents</h3>
        <p>865</p>
      </div>
      <div className="card">
        <h3>Critical Alerts</h3>
        <p>15</p>
      </div>
    </div>

    {/* Incident List */}
    <div className="incident-list-container">
      <h3>Active Incidents</h3>
      <div className="incident-list">
        <div className="incident-card">
          <div className="incident-details">
            <h4>Phishing Attempt Detected</h4>
            <p><strong>Status:</strong> Open</p>
            <p><strong>Date:</strong> 2025-01-15</p>
          </div>
        </div>

        <div className="incident-card">
          <div className="incident-details">
            <h4>Unauthorized Access Detected</h4>
            <p><strong>Status:</strong> In Progress</p>
            <p><strong>Date:</strong> 2025-01-14</p>
          </div>
        </div>

        <div className="incident-card">
          <div className="incident-details">
            <h4>Malware Attack Resolved</h4>
            <p><strong>Status:</strong> Resolved</p>
            <p><strong>Date:</strong> 2025-01-12</p>
          </div>
        </div>
      </div>
    </div>
  </section>
)}

      </main>
    </div>
  );
};

export default Dashboard;
