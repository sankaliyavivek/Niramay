import React, { useEffect, useState } from 'react';
import { Menu, MenuItem, Sidebar, SubMenu } from 'react-pro-sidebar';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import ReceiptRoundedIcon from "@mui/icons-material/ReceiptRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import Home from './Home';
import AllPatients from './AllPatients';
import Print from './Print';
import Month from './Month';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import Edit from './Edit';
import PatientDetail from './PatientDetail';

function App() {
  // Manage sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(window.innerWidth < 700);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 700);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar Toggle Button */}
      <button onClick={toggleSidebar} className="sidebar-toggle">
        <MenuRoundedIcon />
      </button>

      {/* Sidebar */}
      <Sidebar collapsed={isSidebarCollapsed} className="app" id='apper'>
        <Menu>
          <MenuItem className="menu1" icon={<MenuRoundedIcon />}>
            <h2> QUICKPAY</h2>
          </MenuItem>
          <MenuItem icon={<GridViewRoundedIcon />} >  <Link to="/">Home</Link></MenuItem>
          <MenuItem icon={<ReceiptRoundedIcon />} >  <Link to="/all">AllPatients</Link></MenuItem>
          <MenuItem icon={<BarChartRoundedIcon />} >  <Link to="/month">Month</Link></MenuItem>
        </Menu>
      </Sidebar>

      {/* Page Content */}
      <section>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/all" element={<AllPatients />} />
          <Route path="/print/:id" element={<Print />} />
          <Route path="/month" element={<Month />} />
          <Route path='/edit/:id' element={<Edit></Edit>}></Route>
          <Route path='/view/:eid' element={<PatientDetail></PatientDetail>}></Route>
        </Routes>
      </section>
    </div>
  );
}

export default App;
