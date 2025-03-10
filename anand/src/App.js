import React, { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import AllPatients from "./AllPatients";
import Print from "./Print";
import Month from "./Month";
import Edit from "./Edit";
import PatientDetail from "./PatientDetail";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

import Login from "./Login";
import axios from 'axios';

function App() {
  const navigate = useNavigate();

  // ✅ State for username, modal, loading, and sidebar toggle
  const [name, setName] = useState(localStorage.getItem('username') || null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // ✅ Logout function
    const handleLogout = async () => {
      try {
        await axios.post('http://localhost:9000/user/logout', {}, { withCredentials: true });
  
        // ✅ Remove token and username from localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('token');
  
        // ✅ Instantly update the navbar without refresh
        setName(null);
  
        // ✅ Redirect to Home page
        navigate('/');
        setShowLoginModal(true);  // ✅ Open modal again on logout
      } catch (error) {
        console.error("Logout failed", error);
      }
    }

  // ✅ Check token on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:9000/user/verify', { withCredentials: true })
        .then(res => {
          if (res.status === 200) {
            setName(localStorage.getItem('username'));
            setLoading(false);
          }
        })
        .catch(() => {
          handleLogout();
        });
    } else {
      setShowLoginModal(true);  // ✅ Open modal if no token
      setLoading(false);
    }
  }, [handleLogout]);

  // ✅ Automatically close modal after login
  useEffect(() => {
    if (name) {
      setShowLoginModal(false);  // ✅ Close modal after login instantly
    }
  }, [name]);  // ✅ Whenever "name" changes, modal closes instantly.

  // ✅ Handle Login Success
  const handleLoginSuccess = (username, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    setName(username);
    navigate('/');
  }



  // ✅ Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  // ✅ Show Loading Spinner while checking token
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* ✅ Show Navbar only if user is logged in */}
      {name && (
        <nav className="navbar">
          <div className="navbar-brand nav-brand">Niramy Clinic
            <li className="btn-none" onClick={toggleSidebar}><i className="fa-solid fa-bars-staggered"></i></li>
          </div>
          <ul className={`nav-links ${isSidebarOpen ? 'open' : ''}`}>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all">Patients</Link></li>
            <li><Link to="/month">Monthly</Link></li>
            <li className="text-white">Welcome, {name}</li>
            <li className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              <button className="btn btn-link">Logout</button>
            </li>

          </ul>
        </nav>
      )}

      {/* ✅ Page Content */}
      {name && (
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all" element={<AllPatients />} />
            <Route path="/print/:id" element={<Print />} />
            <Route path="/month" element={<Month />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/view/:eid" element={<PatientDetail />} />
          </Routes>
        </main>
      )}
      {/* ✅ Bootstrap Login Modal */}
      <div className={`modal ${showLoginModal ? 'd-block' : 'd-none'}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg rounded-3">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title w-100 text-center">
                Welcome to <b>Niramay Clinic</b><br />
                <small>Please Login First</small>
              </h5>
            </div>
            <div className="modal-body">
              <Login onLoginSuccess={handleLoginSuccess} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;