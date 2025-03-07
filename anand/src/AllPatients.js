import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API_URL = process.env.REACT_APP_BACKEND_API_URL ||"https://niramay-mqzo.onrender.com";
console.log(API_URL);

function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/patients/getall`, { withCredentials: true })
        .then(response => {
            console.log("Patients fetched successfully:", response.data);
            setPatients(response.data);
            setFilteredPatients(response.data);
        })
        .catch(error => {
            console.error("Error fetching patient data:", error);
            if (error.response) {
                console.error("Response Data:", error.response.data);
            } else if (error.request) {
                console.error("No Response received:", error.request);
            } else {
                console.error("Axios Error:", error.message);
            }
        });
}, []);

  
  const handleSearch = () => {
    if (!searchTerm) return;
    const filtered = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.includes(searchTerm)
    );
    setFilteredPatients(filtered);
  };

  const handleClear = () => {
    setSearchTerm('');
    setFilteredPatients(patients);
  };

  const handlePrint = (id) => {
    navigate(`/print/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      await axios.delete(`${API_URL}/patients/delete/${id}`, { withCredentials: true });
      alert("Patient deleted successfully!");
      setPatients(patients.filter(patient => patient.patientId !== id));
      setFilteredPatients(filteredPatients.filter(patient => patient.patientId !== id));
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Error deleting patient!");
    }
  };

  // Function to download data as a PDF
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Patient List", 14, 10);
    const headers = [["Patient ID", "Department", "Name", "Contact"]];
    const data = filteredPatients.map(patient => [
      patient.patientId,
      patient.department,
      patient.name,
      patient.contact
    ]);
    doc.autoTable({ startY: 20, head: headers, body: data });
    doc.save("patients.pdf");
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex">
          <input 
            type="search" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Search by Name or Patient ID" 
            className="form-control w-50"
          />
          <button className="btn btn-primary mx-2" onClick={handleSearch}>Search</button> 
          <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
        </div>
        <button className="btn btn-success" onClick={handleDownloadPDF}>Download PDF</button>
      </div>
      <h4 className="text-center">All Patients</h4>
      <div className="table-responsive-md">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr>
              <th>Patient ID</th>
              <th>Department</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Print</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.patientId}>
                  <td>{patient.patientId}</td>
                  <td>{patient.department}</td>
                  <td>{patient.name}</td>
                  <td>{patient.contact}</td>
                  <td><button className="btn btn-success" onClick={() => handlePrint(patient.patientId)}>Print</button></td>
                  <td>
                    <Link to={`/view/${patient.patientId}`} className='btn btn-primary'>View</Link>
                    <Link to={`/edit/${patient.patientId}`} className="btn btn-info mx-2">Edit</Link>
                    <button className="btn btn-danger" onClick={() => handleDelete(patient.patientId)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-danger">No patient found with ID or Name: {searchTerm}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllPatients;
