import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorRegisterPage from "./pages/DoctorRegisterPage";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/Admin";
import Homepage from "./pages/Homepage";
import ProfilePage from "./pages/Profile";
import AgentPanel from "./pages/DoctorPanel";
import UserPage from "./pages/Userpage";
import URLChecker from "./pages/URLChecker";
import FileScanner from "./pages/FileScanner";
import DomainScanner from "./pages/DomainScanner";
import IPScanner from "./pages/IPScanner";
import CrimeReporting from "./pages/CrimeReporting";
import ProtectedRoute from "./components/ProtectedRoute";
import CommentClassifier from "./pages/CommentAnalyze";
import CommentAnalyseFlask from "./pages/CommentAnalyseFlask";

const App = () => {
  return (
    <Router>
      <div className="bg-custom vh-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-doctor" element={<DoctorRegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/doctor" element={<AgentPanel />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/userpage" element={<UserPage />} />
          <Route path="/urlcheck" element={<URLChecker />} />
          <Route path="/filecheck" element={<FileScanner />} />
          <Route path="/domaincheck" element={<DomainScanner />} />
          <Route path="/ipcheck" element={<IPScanner />} />
          {/* <Route path="/comment" element={<CommentClassifier />} /> */}
          <Route path="/comment" element={<CommentAnalyseFlask />} />
          <Route
            path="/crimereporting"
            element={
              <ProtectedRoute>
                <CrimeReporting />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
