import React, { useEffect, useState } from "react";
import "./HomePage.css";
import { apiUrl } from "../axiosInstance";
import axios from "axios";

const HomePage = () => {
  const [commentCount, setCommentCount] = useState(0);
  const [crimeCount, setCrimeCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [crimeRes, commentRes] = await Promise.all([
          axios.get(apiUrl + "api/crime/count"),
          axios.get(apiUrl + "api/crime/comments/count"),
        ]);
        setCrimeCount(crimeRes.data.total);
        setCommentCount(commentRes.data.total);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="homepage">
      {/* Header Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to CDS</h1>
          <p>
            Real-time cybercrime detection and threat analysis at your
            fingertips.
          </p>
          <a
            href="/dashboard"
            className="cta-button"
            style={{ textDecoration: "none" }}
          >
            Get Started
          </a>
        </div>
        <div className="hero-animation">
          {/* Add a futuristic animation */}
          <img
            src="https://www.netcov.com/wp-content/filemgr/2022/07/shutterstock_1092829541.jpg"
            alt="Futuristic Design"
          />
        </div>
      </header>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat">
          <h2>{crimeCount}</h2>
          <p>Crimes Reported</p>
        </div>
        {/* <div className="stat">
          <h2>104.6 MB</h2>
          <p>Bandwidth Saved</p>
        </div> */}
        <div className="stat">
          <h2> {commentCount}</h2>
          <p>Complaints Recieved</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose CDS?</h2>
        <div className="features">
          <div className="feature-card">
            <h3>AI-Powered Detection</h3>
            <p>Identify and neutralize threats with advanced AI algorithms.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Monitoring</h3>
            <p>Track potential cyber threats as they occur, 24/7.</p>
          </div>
          <div className="feature-card">
            <h3>Comprehensive Reporting</h3>
            <p>
              Generate detailed analytics and insights for improved security.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 CDS. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
