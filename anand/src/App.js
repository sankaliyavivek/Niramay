import React from "react";
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
  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand text-white">Hospital System</div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/all">Patients</Link></li>
          <li><Link to="/month">Monthly</Link></li>
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
