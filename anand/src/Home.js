import React, { useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import AllPatients from "./AllPatients";
import Print from "./Print";
import Month from "./Month";
import Edit from "./Edit";
import PatientDetail from "./PatientDetail";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">Hospital System</div>

        {/* Menu Toggle Button */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "❌" : "☰"}
        </button>

        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link to="/all" onClick={() => setMenuOpen(false)}>Patients</Link></li>
          <li><Link to="/month" onClick={() => setMenuOpen(false)}>Monthly</Link></li>
        </ul>
      </nav>

      {/* Page Content */}
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
    </div>
  );
}

export default App;
