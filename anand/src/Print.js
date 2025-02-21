import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL

function Print() {
    const [patient, setPatient] = useState(null);
    const { id } = useParams();
    const [datetime, setDatetime] = useState(getCurrentDateTime());
    const apperRef = useRef(null);

    function getCurrentDateTime() {
        const now = new Date();
        return `${now.toLocaleDateString()}, ${now.toLocaleTimeString()}`;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setDatetime(getCurrentDateTime());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const fetchPatient = async () => {
            if (!id) {
                console.error("Invalid patient ID:", id);
                alert("Invalid patient ID");
                return;
            }
    
            try {
                const response = await axios.get(`${API_URL}/patients/getprint/${id}`,{withCredentials:true});
                setPatient(response.data);
            } catch (error) {
                console.error("Error fetching data:", error.response ? error.response.data : error.message);
                alert("Failed to fetch patient data");
            }
        };
    
        fetchPatient();
    }, [id]);
    

    if (!patient) {
        return <div>Loading or Patient not found...</div>;
    }

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <div className='tager p-5' ref={apperRef}>
                <div className='print'>
                    <div>
                        <img src="logo-black.png" alt="Hospital Logo" height="300px" width="300px" />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <h2>ANAND HOSPITAL</h2>
                        <p>Attached to Anand Homeopathic Medical College & Research Institute</p>
                        <p>Run by Shri Ram Krishna Seva Mandal</p>
                        <h4>OPP. SARDAR BAUG, ANAND - 388001</h4>
                        <h4>OPD CASE RECORD</h4>
                        <u>Dept of Surgery</u>
                    </div>
                </div>
                <div className='print2'>
                    <div className='pone'>
                        <p><strong>Name:</strong> {patient.name}</p>
                        <p><strong>Age:</strong> {patient.age}, <strong>Sex:</strong> {patient.gender}</p>
                        <p><strong>Address:</strong> {patient.address}</p>
                    </div>
                    <div className='psecond'>
                        <p><strong>Date:</strong> {datetime}</p>
                        <p><strong>OPD No:</strong> {patient._id}</p>
                        <p><strong>Consultant:</strong> ANAND</p>
                    </div>
                </div>
                <hr />
                <hr />
                <u>Chief Complaints:</u>
                <p>{patient.chiefComplaints || "Not Provided"}</p>
                <button onClick={handlePrint} className='print-btn'>Print</button>
            </div>
        </div>
    );
}

export default Print;
