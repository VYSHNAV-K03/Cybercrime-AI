import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ProfilePage = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  if (!user) {
    return (
      <div className="container mt-5 text-center">
        <h4 className="text-danger">User not logged in.</h4>
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg rounded d-flex flex-row p-4"
        style={{ maxWidth: "800px" }}
      >
        {/* Left - Profile Image */}
        <div className="d-flex flex-column align-items-center justify-content-center pe-4 border-end">
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff&size=128`}
            alt="Profile"
            className="rounded-circle shadow"
            width="120"
            height="120"
          />
          <h4 className="mt-3 mb-1">{user.username}</h4>
          <span className="badge bg-primary text-uppercase">
            {user.role === "admin"
              ? "Admin"
              : user.role === "doctor"
              ? "Agent"
              : "User"}
          </span>
        </div>

        {/* Right - User Info */}
        <div className="ps-4 d-flex flex-column justify-content-center w-100">
          <div className="mb-3">
            <strong>Email:</strong>
            <div className="text-muted ">
              <span className="badge bg-primary text-uppercase">
                {user.email}
              </span>
            </div>
          </div>
          <div className="mb-3">
            <strong>Phone:</strong>
            <div className="text-muted">
              <span className="badge bg-primary text-uppercase">
                {user.phone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
