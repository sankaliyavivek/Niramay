import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// ✅ 1. Add this function at the top
const formatIndianDate = (dateString) => {
    if (!dateString) return 'N/A';

    const isoDate = dateString.includes('/')
        ? dateString.split('/').reverse().join('-') // "23/07/2025" -> "2025-07-23"
        : dateString;

    const date = new Date(isoDate);
    if (isNaN(date)) return 'Invalid Date';

    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const PatientDetail = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState({});

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BACKEND_API_URL}/get/${id}`)
            .then((res) => setPatient(res.data))
            .catch((err) => console.error(err));
    }, [id]);

    return (
        <div>
            <h2>Patient Details</h2>
            <p><strong>Patient ID:</strong> {patient._id}</p>
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Age:</strong> {patient.age}</p>
            <p><strong>Gender:</strong> {patient.gender}</p>
            <p><strong>Department:</strong> {patient.department}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Contact:</strong> {patient.contact}</p>
            <p><strong>Date:</strong> {formatIndianDate(patient.date)}</p>
        </div>
    );
};

export default PatientDetail;
