import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;
console.log(API_URL);

function Home() {
    const formatDate = (date) => {
        const [year, month, day] = date.split('-');
        return `${day}-${month}-${year}`;
    };

    const todayDate = formatDate(new Date().toISOString().split('T')[0]); // DD-MM-YYYY

    const [department, setDepartment] = useState("");
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [age, setAge] = useState("");
    const [contact, setContact] = useState("");

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!department || !name || !gender || !age || !address || !contact) {
            alert("All fields are required!");
            return;
        }

        console.log("Sending data:", { department, name, gender, age, address, contact, todayDate });

        try {
            const response = await axios.post(`${API_URL}/patients/patient`, {
                department,
                name,
                gender,
                age,
                address,
                contact,
                date: todayDate, // Send formatted date
            });

            console.log("Server Response:", response.data);
            alert(response.data.message);
        } catch (error) {
            console.error("Error adding patient:", error.response?.data || error.message);
            alert("Failed to add patient.");
        }
    };

    return (
        <div className='home-main'>
            <div className='Homer'>
                <div>
                    <h3 className='text-center w-100'>New Patient</h3>
                </div>
                <div>
                    <form onSubmit={handleAdd}>
                        <div>
                            <label>Dept:</label>
                            <select value={department} onChange={(e) => setDepartment(e.target.value)} className='p-1 my-2'>
                                <option value="" hidden>Select Department</option>
                                <option value="Homiopathic">Homiopathic</option>
                            </select>
                        </div>

                        <div>
                            <span className='my-3 pe-2'>Full Name:</span>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Full Name' />
                        </div>

                        <div>
                            <label>Gender:</label>
                            <select value={gender} className='p-1' onChange={(e) => setGender(e.target.value)}>
                                <option value="" hidden>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        <div>
                            <label>Address:</label>
                            <textarea value={address} rows={2} cols={24} placeholder='Address' className='my-2' onChange={(e) => setAddress(e.target.value)}></textarea>
                        </div>

                        <div>
                            <span className='my-2'>Age:</span>
                            <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder='Age' />
                        </div>

                        <div>
                            <span className='my-2'>Contact No:</span>
                            <input type="number" value={contact} onChange={(e) => setContact(e.target.value)} placeholder='Contact No' />
                        </div>

                        <div>
                            <label>Date:</label>
                            <input type="text" value={todayDate} readOnly />
                        </div>

                        <section className='btn'>
                            <button type="submit btn">
                                Add Today's Patient
                            </button>
                        </section>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Home;
