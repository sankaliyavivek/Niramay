import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PatientDetail = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const response = await fetch(`http://localhost:9000/patients/view/${id}`);
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
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h2>Patient Details</h2>
            <div className="patient-info">
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Department:</strong> {patient.department}</p>
                <p><strong>Address:</strong> {patient.address}</p>
                <p><strong>Contact:</strong> {patient.contact}</p>
                <p><strong>Date:</strong> {new Date(patient.date).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default PatientDetail;
