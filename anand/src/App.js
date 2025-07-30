import React, { useEffect, useState, useCallback } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import AllPatients from "./AllPatients";
import Print from "./Print";
import Month from "./Month";
import Edit from "./Edit";
import PatientDetail from "./PatientDetail";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import Register from './Register';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./Login";
import axios from 'axios';
import Loader from "./Loader";



const API_URL = process.env.REACT_APP_BACKEND_API_URL;
function App() {
  const navigate = useNavigate();

  // ✅ State for username, modal, loading, and sidebar toggle
  const [name, setName] = useState(localStorage.getItem('username') || null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ Logout function
  const handleLogout = useCallback(async () => {
    try {
      await axios.post(`${API_URL}/user/logout`, {}, { withCredentials: true });

      // ✅ Remove token and username from localStorage
      localStorage.removeItem('username');
      localStorage.removeItem('token');

      // ✅ Instantly update the navbar without refresh
      setName(null);


      // ✅ Redirect to Home page
      toast.success("Logged out successfully!");
      navigate('/');
      setShowLoginModal(true);  // ✅ Open modal again on logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  }, [navigate]);

  // ✅ Check token on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${API_URL}/user/verify`, { withCredentials: true })
        .then(res => {
          if (res.status === 200) {
            setName(localStorage.getItem('username'));
          }
        })
        .catch(() => {
          handleLogout();
        })
        .finally(() => {
              setLoading(false);
        });
    } else {
      setShowLoginModal(true);
      setLoading(false);
    }
  }, [handleLogout]);


  // ✅ Automatically close modal after login
  useEffect(() => {
    if (name) {
      setShowLoginModal(false);  // ✅ Close modal after login instantly
    }
  }, [name]);

  // ✅ Handle Login Success
  const handleLoginSuccess = (username, token) => {
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    setName(username);
    toast.success(`Welcome, ${username}!`);
    navigate('/');
  }

  // ✅ Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }

  // ✅ Show Loading Spinner while checking token
    if (loading) {
    return <Loader />;
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
            <li className="text-white">{name}</li>
            <li className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
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
            <Route path="/view/:id" element={<PatientDetail />} />
            <Route path="/register" element={<Register></Register>}></Route>
          </Routes>
        </main>
      )}

      {/* ✅ Bootstrap Login Modal */}
      <div className={`modal ${showLoginModal ? 'd-block' : 'd-none'}`} tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg rounded-3">
            <div className="modal-header text-white" style={{ background: ' #FF9933' }}>
              <h5 className="modal-title w-100 text-center" >
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
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </div>
  );
}

export default App;
