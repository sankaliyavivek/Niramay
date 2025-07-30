import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from './Loader';


function PatientDetails() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_BACKEND_API_URL;

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await axios.get(`${API_URL}/patients/view/${id}`);
        setPatient(res.data);
      } catch (err) {
        console.error('Error fetching patient:', err);
        setError('Unable to fetch patient details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id, API_URL]);

  // if (loading) return <p>Loading patient details...</p>;
    if (loading) return <Loader />; 
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="container">
      <h2>Patient Details</h2>
      {patient ? (
        <div className="patient-info">
          <p><strong>Patient ID:</strong> {patient.patientId}</p>
          <p><strong>Name:</strong> {patient.name}</p>
          <p><strong>Age:</strong> {patient.age}</p>
          <p><strong>Gender:</strong> {patient.gender}</p>
          <p><strong>Department:</strong> {patient.department}</p>
          <p><strong>Address:</strong> {patient.address}</p>
          <p><strong>Contact:</strong> {patient.contact}</p>
          <p><strong>Date:</strong> {patient.date}</p> {/* ✅ Direct display */}
        </div>
      ) : (
        <p>No patient data found.</p>
      )}
    </div>
  );
}

export default PatientDetails;
