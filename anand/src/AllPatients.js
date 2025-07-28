import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_BACKEND_API_URL || "https://niramay-mqzo.onrender.com";

function AllPatients() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/patients/getall`, { withCredentials: true })
      .then(response => {
        console.log("All patients:", response.data);
        const missing = response.data.filter(p => !p.patientId);
        if (missing.length > 0) {
          console.warn("⚠️ Patients with missing patientId:", missing);
        }
        setPatients(response.data);
        setFilteredPatients(response.data);
      })
      .catch(error => console.error("Error fetching patient data:", error));
  }, []);


  const handleSearch = (value) => {
    if (!value) {
      setFilteredPatients(patients);
      return;
    }

    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(value.toLowerCase()) ||
      patient.patientId.toString().includes(value)
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
      toast.success("Patient deleted successfully!");
      setPatients(patients.filter(patient => patient.patientId !== id));
      setFilteredPatients(filteredPatients.filter(patient => patient.patientId !== id));
    } catch (error) {
      toast.error("Error deleting patient!");
    }
  };

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
      <div className="header-section text-center mb-4">
        <h3 style={{ color: '#FF9933' }}>All Patients List</h3>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <div className="d-flex">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="Search by Name or Patient ID"
            className="form-control"
          />

          <button className="btn btn-primary mx-2" onClick={handleSearch}>Search</button>
          <button className="btn btn-secondary" onClick={handleClear}>Clear</button>
        </div>
        <button className="btn btn-success" onClick={handleDownloadPDF}>Download PDF</button>
      </div>

      <div className="table-responsive-md">
        <table className="table table-bordered text-center">
          <thead style={{ backgroundColor: '#FF9933', color: 'white' }}>
            <tr>
              <th>{searchTerm ? "patient ID" : "#"}</th>
              {/* <th>Patient ID</th> */}
              <th>Department</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Print</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <tr key={patient.patientId}>
                  <td>{searchTerm ? patient.patientId : index + 1}</td>
                  {/* <td>{patient.patientId}</td> */}
                  <td>{patient.department}</td>
                  <td>{patient.name}</td>
                  <td>{patient.contact}</td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handlePrint(patient.patientId)}
                    >Print</button>
                  </td>
                  <td>
                    <Link to={`/view/${patient.patientId}`} className='btn btn-primary'>View</Link>
                    <Link to={`/edit/${patient.patientId}`} className="btn btn-info mx-2">Edit</Link>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(patient.patientId)}
                    >Delete</button>
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
        <ToastContainer position="top-right" autoClose={2000} />
      </div>

      <style jsx>{`
        .btn-primary {
          background-color: #FF9933;
          border: none;
        }
        .btn-primary:hover {
          background-color: #cc7a29;
        }
        .btn-success {
          background-color: #28a745;
        }
        .table thead {
          background-color: #FF9933;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default AllPatients;
