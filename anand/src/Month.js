import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = process.env.REACT_APP_BACKEND_API_URL || "https://niramay-mqzo.onrender.com";

function Month() {
  const [monthData, setMonthData] = useState([]);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Fetch hospital data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/patients/getall`, { withCredentials: true });
        setMonthData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter function
  const handleMonth = useCallback(() => {
    if (!year || !month) {
      alert("Please enter both year and month!");
      return;
    }

    const filtered = monthData.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear().toString() === year &&
        (itemDate.getMonth() + 1).toString() === month
      );
    });

    setFilteredData(filtered);
  }, [year, month, monthData]);

  // Clear Filter
  const handleClear = () => {
    setYear('');
    setMonth('');
    setFilteredData([]);
  };

  // Download PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Monthly Patient Statistics (${month}/${year})`, 14, 10);

    const headers = [["Patient ID", "Department", "Name", "Date"]];
    const data = filteredData.map((item) => [
      item.patientId,
      item.department,
      item.name,
      new Date(item.date).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 20,
      head: headers,
      body: data
    });

    doc.save(`Monthly-Patients-${month}-${year}.pdf`);
  };

  return (
    <div className='container my-5 border'>
      <div className='text-center mb-4'>
        <h2>Monthly Statistics</h2>
      </div>

      {/* Input Fields */}
      <div className='row mb-4'>
        <div className='col-md-4'>
          <input
            type="number"
            className="form-control"
            placeholder="Year (YYYY)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="1900"
            max="2100"
            required
          />
        </div>
        <div className='col-md-4'>
          <input
            type="number"
            className="form-control"
            placeholder="Month (1-12)"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
            required
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

      {/* Data Table */}
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
                  <td>{new Date(item.date).toLocaleDateString()}</td>
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

      {/* Download PDF Button */}
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
