import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;
const PatientDetail = () => {
    const { eid } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetch(`${API_URL}/patients/view/${eid}`);
                if (!response.ok) {
                    throw new Error("Patient not found");
                }
                const data = await response.json();
                setPatient(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [eid]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h2>Patient Details</h2>
            <div className="patient-info">
                <p><strong>Patient ID:</strong> {patient.patientId}</p>
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Department:</strong> {patient.department}</p>
                <p><strong>Address:</strong> {patient.address}</p>
                <p><strong>Contact:</strong> {patient.contact}</p>
                <p><strong>Date:</strong> {patient.date ? new Date(patient.date).toLocaleDateString("en-IN") : "N/A"}</p>

            </div>
        </div>
    );
};

export default PatientDetail;
