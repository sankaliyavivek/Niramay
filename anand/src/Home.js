import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

function Home() {
    const [department, setDepartment] = useState("Homeopathic");
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [age, setAge] = useState("");
    const [contact, setContact] = useState("");
    const [isOldPatient, setIsOldPatient] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [todayDate, setTodayDate] = useState("");

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const date = getTodayDate();
        setTodayDate(date);
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!department || !name || !gender || !age || !address) {
            toast.warn("All fields are required!");
            return;
        }

        const finalDate = isOldPatient ? selectedDate : todayDate;

        if (isOldPatient && !selectedDate) {
             toast.warn("Please select a date for old patient!");
            return;
        }

        const cleanedContact = contact.trim() === "" ? undefined : contact;

        try {
            const response = await axios.post(`${API_URL}/patients/patient`, {
                department,
                name,
                gender,
                age,
                address: address.includes('Dhandhuka') ? address : `${address}, Dhandhuka`,
                contact: cleanedContact,
                date: finalDate, // ISO format
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            console.log("📅 Date sent to backend:", finalDate);
            toast.success(response.data.message);

            // Reset form
            setName('');
            setGender('');
            setAge('');
            setAddress('');
            setContact('');
            setIsOldPatient(false);
            setSelectedDate('');
        } catch (error) {
            console.error("Error adding patient:", error.response?.data || error.message);
           toast.error("Failed to add patient.");
        }
    };

   

    return (
        <div className='patient-container mt-3'>
            <div className='patient-card'>
                <h3 className='form-title'>Patient Registration</h3>

                <form onSubmit={handleAdd}>
                    <div className='form-group'>
                        <label>Department</label>
                        <select value={department} onChange={(e) => setDepartment(e.target.value)} disabled>
                            <option value="Homeopathic">Homeopathic</option>
                        </select>
                    </div>

                    <div className='form-group'>
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Full Name' />
                    </div>

                    <div className='form-group'>
                        <label>Gender</label>
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
                            <option value="" hidden>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>

                    <div className='form-group'>
                        <label>Age</label>
                        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder='Age' />
                    </div>

                    <div className='form-group'>
                        <label>Address</label>
                        <textarea value={address} rows={3} onChange={(e) => setAddress(e.target.value)} placeholder='Address'></textarea>
                    </div>

                    <div className='form-group'>
                        <label>Contact No</label>
                        <input type="number" value={contact} onChange={(e) => setContact(e.target.value)} placeholder='Contact No' />
                    </div>

                    <div className='form-group'>
                        <label>Date</label>
                        {isOldPatient ? (
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        ) : (
                            <input
                                type="text"
                                value={todayDate}
                                readOnly
                            />
                        )}
                    </div>

                    <div className='form-btn'>
                        <button type="submit">
                            {isOldPatient ? "Add Old Patient" : "Add Today's Patient"}
                        </button>
                    </div>

                    <div className='form-btn toggle-btn'>
                        <button
                            type="button"
                            onClick={() => setIsOldPatient(!isOldPatient)}
                        >
                            {isOldPatient ? "Add Today's Patient" : "Add Old Patient"}
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>

    );
}

export default Home;
