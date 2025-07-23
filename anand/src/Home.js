import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    // ✅ Today date state
    const [todayDate, setTodayDate] = useState("");
    const [formattedToday, setFormattedToday] = useState("");

    const formatToIndianDate = (date) => {
        if (!date) return "";
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // ✅ Set today's date on component mount
    useEffect(() => {
        const date = getTodayDate();
        setTodayDate(date);
        setFormattedToday(formatToIndianDate(date));
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!department || !name || !gender || !age || !address) {
            alert("All fields are required!");
            return;
        }

        let finalDate = formattedToday;

        if (isOldPatient) {
            if (!selectedDate) {
                alert("Please select a date for old patient!");
                return;
            }
            finalDate = formatToIndianDate(selectedDate);
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
                date: finalDate,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            console.log("Date being sent:", finalDate);
            alert(response.data.message);

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
            alert("Failed to add patient.");
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
                                value={formattedToday}
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
        </div>
    );
}

export default Home;
