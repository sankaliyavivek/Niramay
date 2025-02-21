import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
const API_URL = process.env.REACT_APP_BACKEND_API_URL

function Month() {
  const [monthData, setMonthData] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Fetch hospital data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/patients/getall`);
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

  return (
    <div className='container-fluid my-5 month'>
      <div className='text-center mb-4'>
        <h2>Month Statistics</h2>
      </div>
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
        <div className='col-md-4'>
          <button className='btn btn-primary w-100' onClick={handleMonth}>Search</button>
        </div>
      </div>
      <div>
        <table className='table table-striped table-bordered text-center' style={{ width: '100%' }}>
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
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.department}</td>
                  <td>{item.name}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No data available for the selected month</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Month;
