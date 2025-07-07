import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

function Home() {
    // Function to convert date to Indian Date Format
    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;  // Convert to DD/MM/YYYY
    };

    // Function to get today's date in Indian Date Format
    const getIndianDateFormat = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const todayDate = getIndianDateFormat();

    const [department, setDepartment] = useState("Homeopathic");
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [age, setAge] = useState("");
    const [contact, setContact] = useState("");
    const [isOldPatient, setIsOldPatient] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    const handleAdd = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        if (!department || !name || !gender || !age || !address ) {
            alert("All fields are required!");
            return;
        }

        // Final date based on patient type
        const finalDate = isOldPatient ? formatDate(selectedDate) : todayDate;

        if (isOldPatient && !selectedDate) {
            alert("Please select a date for old patient!");
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
                contact : cleanedContact,
                date: finalDate,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            alert(response.data.message);

            // Reset form
            setDepartment('');
            setName('');
            setGender('');
            setAge('');
            setAddress('');
            setContact('');
            setIsOldPatient(false);
            setSelectedDate('');
        } catch (error) {
            console.error("Error adding patient:", error.response?.data || error.message);
            alert("Failed to add patient.");
        }

        window.location.reload();
    };

    return (
        <div className='patient-container mt-3'>
            <div className='patient-card'>
                <h3 className='form-title'>Patient Registration</h3>

                <form onSubmit={handleAdd}>
                    <div className='form-group'>
                        <label>Department</label>
                        <select value={department} onChange={(e) => setDepartment(e.target.value)} disabled>
                            <option value="" hidden>Select Department</option>
                            <option value="Homiopathic">Homeopathic</option>
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

                    {/* Date Input Section */}
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

                    {/* Submit Button */}
                    <div className='form-btn'>
                        <button type="submit">
                            {isOldPatient ? "Add Old Patient" : "Add Today's Patient"}
                        </button>
                    </div>

                    {/* Toggle Buttons */}
                    <div className='form-btn toggle-btn'>
                        {!isOldPatient ? (
                            <button 
                                type="button" 
                                onClick={() => setIsOldPatient(true)}
                            >
                                Add Old Patient
                            </button>
                        ) : (
                            <button 
                                type="button" 
                                onClick={() => setIsOldPatient(false)}
                            >
                                Add Today's Patient
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Home;
