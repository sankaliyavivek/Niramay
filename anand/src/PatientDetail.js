import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "./App.css";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import Home from "./Home";
import AllPatients from "./AllPatients";
import Print from "./Print";
import Month from "./Month";
import "bootstrap/dist/css/bootstrap.css";
import Edit from "./Edit";
import PatientDetail from "./PatientDetail";

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth >= 500);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarExpanded(window.innerWidth >= 500);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="app-container">
      {/* Sidebar Toggle Button */}
      <button onClick={toggleSidebar} className="sidebar-toggle">
        {isSidebarExpanded ? <span>X</span> : <MenuRoundedIcon />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarExpanded ? "expanded" : "collapsed"}`}>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/all">Patients</Link></li>
            <li><Link to="/month">Monthly</Link></li>
          </ul>
        </nav>
      </aside>

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
