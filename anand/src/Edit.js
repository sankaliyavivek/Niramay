import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_API_URL

function Edit() {
  const { id } = useParams(); // Get patient ID from URL
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/patient/getprint/${id}`,{withCredentials:true})
      .then(response => {
        console.log("Fetched Patient:", response.data);
        const patient = response.data;
        setDepartment(patient.department);
        setGender(patient.gender);
        setName(patient.name);
        setAge(patient.age);
        setAddress(patient.address);
        setContact(patient.contact);
        setDate(patient.date);
      })
      .catch(error => {
        console.error("Error fetching patient:", error);
        alert("Error fetching patient! Make sure the backend is running.");
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/patient/update/${id}`, {
        department, gender, name, age, address, contact, date
      },{withCredentials:true});

      alert("Patient updated successfully!");
      navigate("/all"); // Redirect after update
    } catch (error) {
      console.error("Error updating patient:", error);
      alert("Error updating patient!");
    }
  };

  return (
    <div className='Homer'>
      <div className='text-center'><h2>Edit Patient</h2></div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Dept:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className='p-1 my-2' required>
            <option value="" hidden>Select Department</option>
            <option value="Homiopathic">Homiopathic</option>
          </select>
        </div>

        <div>
          <span className='my-3 pe-2'>Full Name:</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder='Full Name' required />
        </div>

        <div>
          <label>Gender:</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="" hidden>Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <div>
          <label>Address:</label>
          <textarea value={address} rows={2} cols={24} placeholder='Address' className='my-2' onChange={(e) => setAddress(e.target.value)} required></textarea>
        </div>

        <div>
          <span className='my-2'>Age:</span>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder='Age' required />
        </div>

        <div>
          <span className='my-2'>Contact No:</span>
          <input type="number" value={contact} onChange={(e) => setContact(e.target.value)} placeholder='Contact No' required />
        </div>

        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-success">
          Update Patient
        </button>
      </form>
    </div>
  );
}

export default Edit;
