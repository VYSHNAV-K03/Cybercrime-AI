import React, { useState } from "react";
import axiosInstance from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.username.trim()) {
      errors.username = "Username is required.";
    }

    if (!formData.email) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (!formData.phone) {
      errors.phone = "Phone number is required.";
    } else if (!phoneRegex.test(formData.phone)) {
      errors.phone = "Enter a valid 10-digit phone number.";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: "" }); // Clear error on input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setMessage("");
      return;
    }

    try {
      const response = await axiosInstance.post("/register/user", formData);
      setMessage(response.data.message);
      setFormErrors({});
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setMessage("");
      setFormErrors({
        general: err.response?.data?.message || "An error occurred.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center">Register</h2>
          {message && <div className="alert alert-success">{message}</div>}
          {formErrors.general && (
            <div className="alert alert-danger">{formErrors.general}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className={`form-control ${
                  formErrors.username ? "is-invalid" : ""
                }`}
                value={formData.username}
                onChange={handleChange}
              />
              {formErrors.username && (
                <div className="invalid-feedback">{formErrors.username}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className={`form-control ${
                  formErrors.email ? "is-invalid" : ""
                }`}
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <div className="invalid-feedback">{formErrors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className={`form-control ${
                  formErrors.password ? "is-invalid" : ""
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <div className="invalid-feedback">{formErrors.password}</div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                name="phone"
                className={`form-control ${
                  formErrors.phone ? "is-invalid" : ""
                }`}
                value={formData.phone}
                onChange={handleChange}
              />
              {formErrors.phone && (
                <div className="invalid-feedback">{formErrors.phone}</div>
              )}
            </div>

            <button type="submit" className="btn btn-primary w-100 mb-3">
              Register
            </button>
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => navigate("/register-doctor")}
            >
              Register as Agent
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
