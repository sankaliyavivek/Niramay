const express = require('express');
const router = express.Router();
const Patients = require('../modal/patients'); 

// 🛠️ Fix: Log requests for debugging
router.post('/patient', async (req, res) => {
    try {
        const { department, gender, name, address, age, contact, date } = req.body;

        if (!department || !name || !gender || !age || !address || !contact || !date) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newPatient = new Patients({ department, gender, name, age, address, contact, date });
        await newPatient.save();

        res.status(201).json({ message: "Patient added successfully!", patient: newPatient });
    } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

// Get all patients
router.get('/getall', async (req, res) => {
    try {
        const allPatients = await Patients.find();
        res.json(allPatients);
    } catch (error) {
        console.error("Error fetching patients:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a single patient by ID
router.get('/getprint/:id', async (req, res) => {
    try {
        const patient = await Patients.findById(req.params.id);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update patient
router.put('/update/:id', async (req, res) => {
    try {
        const updatedPatient = await Patients.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPatient) return res.status(404).json({ message: "Patient not found" });

        res.json({ message: "Patient updated successfully!", patient: updatedPatient });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete patient
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedPatient = await Patients.findByIdAndDelete(req.params.id);
        if (!deletedPatient) return res.status(404).json({ message: "Patient not found" });

        res.json({ message: "Patient deleted successfully!" });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


router.get('/view/:eid', async (req, res) => {
    try {
        const patient = await Patients.findById(req.params.eid);
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


module.exports = router;
