import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';
import Loader from './Loader';

const API_URL = process.env.REACT_APP_BACKEND_API_URL || "https://niramay-mqzo.onrender.com";

function Month() {
  const [monthData, setMonthData] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch hospital data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // ⏳ Start loader
      try {
        const response = await axios.get(`${API_URL}/patients/getall`, { withCredentials: true });
        setMonthData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // ✅ Stop loader
      }
    };
    fetchData();
  }, []);

  // ✅ Format date for display
  const formatIndianDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return 'Invalid';
    const day = String(date.getDate()).padStart(2, '0');
    const mon = String(date.getMonth() + 1).padStart(2, '0');
    const yr = date.getFullYear();
    return `${day}/${mon}/${yr}`;
  };

  // ✅ Filter logic
  const handleMonth = useCallback(() => {
    if (!year || !month) {
      alert("Please enter both year and month!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const filtered = monthData.filter((item) => {
        if (!item.date) return false;

        const dateObj = new Date(item.date);
        if (isNaN(dateObj)) return false;

        const itemYear = dateObj.getFullYear();
        const itemMonth = dateObj.getMonth() + 1;

        return (
          itemYear === parseInt(year) &&
          itemMonth === parseInt(month)
        );
      });

      setFilteredData(filtered);
      setLoading(false);
      if (filtered.length === 0) {
        alert("No data found for this month.");
      }
    }, 500); // Optional delay for UX
  }, [year, month, monthData]);

  // ✅ Clear Filter
  const handleClear = () => {
    setYear('');
    setMonth('');
    setFilteredData([]);
  };

  // ✅ Download PDF
  const handleDownloadPDF = () => {
    if (filteredData.length === 0) {
      alert("No data available to download.");
      return;
    }

    const doc = new jsPDF();
    doc.text(`Monthly Patient Statistics (${month}/${year})`, 14, 10);

    const headers = [["Patient ID", "Department", "Name", "Date"]];
    const data = filteredData.map((item) => [
      item.patientId,
      item.department,
      item.name,
      formatIndianDate(item.date),
    ]);

    doc.autoTable({
      startY: 20,
      head: headers,
      body: data
    });

    doc.save(`Monthly-Patients-${month}-${year}.pdf`);
  };

  // ✅ Show loader if data is being fetched
  if (loading) return <Loader />;

  return (
    <div className='container my-5 border'>
      <div className='text-center mb-4'>
        <h2>Monthly Statistics</h2>
      </div>

      <div className='row mb-4'>
        <div className='col-md-4'>
          <input
            type="number"
            className="form-control"
            placeholder="Year (YYYY)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className='col-md-4'>
          <input
            type="number"
            className="form-control"
            placeholder="Month (1-12)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <div className='col-md-4 d-flex gap-2'>
          <button className='btn' style={{ backgroundColor: '#FF9933', color: '#fff' }} onClick={handleMonth}>
            Search
          </button>
          <button className='btn btn-secondary' onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      <div className='table-responsive'>
        <table className='table table-striped table-bordered text-center'>
          <thead className='table-dark'>
            <tr>
              <th>Patient ID</th>
              <th>Department</th>
              <th>Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.patientId}>
                  <td>{item.patientId}</td>
                  <td>{item.department}</td>
                  <td>{item.name}</td>
                  <td>{formatIndianDate(item.date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No data available for the selected month
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {filteredData.length > 0 && (
        <div className='text-end mt-3'>
          <button
            className='btn'
            style={{ backgroundColor: '#FF9933', color: '#fff' }}
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default Month;
