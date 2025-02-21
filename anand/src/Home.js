import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_API_URL
console.log(API_URL)
function Home() {
    const todayDate = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format
    const [date, setDate] = useState(todayDate);
    const [department, setDepartment] = useState("");
    const [gender, setGender] = useState("");
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [age, setAge] = useState("");
    const [contact, setContact] = useState("");
    const [isOldPatient, setIsOldPatient] = useState(false);

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!department || !name || !gender || !age || !address || !contact || !date) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/patients/patient`, {
                department,
                name,
                gender,
                age,
                address,
                contact,
                date
            });

            alert(response.data.message);
        } catch (error) {
            console.error("Error adding patient:", error);
            alert("Failed to add patient.");
        }
    };

    return (
        <div>
            <div className='Homer'>
            <h2>New Patient</h2>

                <form>
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
                        <select value={gender} onChange={(e) => setGender(e.target.value)}>
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
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={todayDate}
                        />
                    </div>

                    <section className='btn'>
                        <button type="button" onClick={() => {
                            setDate(todayDate);
                            setIsOldPatient(false);
                            handleAdd(new Event('submit')); // Trigger form submission
                        }}>
                            Add Today's Patient
                        </button>


                        <button type="button" onClick={() => setIsOldPatient(true)}>
                            Add Old Patient
                        </button>

                        {isOldPatient && (
                            <button onClick={handleAdd}>Submit Old Patient</button>
                        )}
                    </section>
                </form>
            </div>
        </div>
    );
}

export default Home;
