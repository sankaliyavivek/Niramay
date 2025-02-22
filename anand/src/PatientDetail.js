import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = process.env.REACT_APP_BACKEND_API_URL

function PatientDetail() {
  const { eid } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/patients/view/${eid}`)
      .then(response => {
        console.log("API Response:", response.data);

        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          // Find the patient with the matching ID
          const selectedPatient = response.data.find(p => p._id === eid);
          setPatient(selectedPatient || null);
        } else {
          setPatient(response.data); // If it's an object, set directly
        }
      })
      .catch(error => {
        console.error("Error fetching patient details", error);
      });
  }, [eid]);

  if (!patient) {
    return <p className="text-center mt-4 text-danger">No patient details found.</p>;
  }

  return (
    <div className="container my-4">
      <h3 className="text-center">Patient Details</h3>
      <div className="card p-4">
        <p><strong>Patient ID:</strong> {patient._id}</p>
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Department:</strong> {patient.department}</p>
        <p><strong>Contact:</strong> {patient.contact}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Address:</strong> {patient.address}</p>
        <p><strong>Date:</strong> {patient.date}</p>

        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>Go Back</button>
      </div>
    </div>
  );
}

export default PatientDetail;
