import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [department, setDepartment] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/patients/getprint/${id}`, { withCredentials: true })
      .then(response => {
        const patient = response.data;
        setDepartment(patient.department);
        setGender(patient.gender);
        setName(patient.name);
        setAge(patient.age);
        setAddress(patient.address);
        setContact(patient.contact || '');
        setDate(patient.date); // already a plain string
      })
      .catch(() => toast.error("Error fetching patient data"));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/patients/update/${id}`, {
        department,
        gender,
        name,
        age,
        address,
        contact,
        date, // already in correct string format
      }, { withCredentials: true });

     toast.success("Patient updated successfully!");
      navigate("/all");
    } catch (error) {
      toast.error("Error updating patient");
    }
  };

  return (
    <div className='Homer'>
      <div className='text-center'><h2>Edit Patient</h2></div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Dept:</label>
          <select value={department} onChange={(e) => setDepartment(e.target.value)} required>
            <option value="" hidden>Select Department</option>
            <option value="Homeopathic">Homeopathic</option>
          </select>
        </div>
        <div>
          <span>Full Name:</span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
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
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} required />
        </div>
        <div>
          <span>Age:</span>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div>
          <span>Contact No:</span>
          <input type="number" value={contact} onChange={(e) => setContact(e.target.value)} />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-success">Update Patient</button>
      </form>

       <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Edit;
