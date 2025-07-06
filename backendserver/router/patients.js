const express = require('express');
const router = express.Router();
const Patients = require('../modal/patients');
const { Authorization } = require('../middleware/authuser');

// Add a new patient
router.post('/patient', Authorization, async (req, res) => {
    try {
        let { department, gender, name, address, age, contact, date } = req.body;

        if (!department || !name || !gender || !age || !address || !date) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const patientData = {
            department,
            gender,
            name,
            age,
            address,
            date,
        };

        if (contact && contact.trim() !== "") {
            patientData.contact = contact.trim();
        }

        const newPatient = new Patients(patientData);
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

// Get a single patient by patientId
router.get('/getprint/:id', async (req, res) => {
    try {
        const patient = await Patients.findOne({ patientId: req.params.id });
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update patient by patientId
router.put('/update/:id', async (req, res) => {
    try {
        const updatedPatient = await Patients.findOneAndUpdate(
            { patientId: req.params.id },
            req.body,
            { new: true }
        );
        if (!updatedPatient) return res.status(404).json({ message: "Patient not found" });

        res.json({ message: "Patient updated successfully!", patient: updatedPatient });
    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete patient by patientId
router.delete('/delete/:id', async (req, res) => {
    try {
        const deletedPatient = await Patients.findOneAndDelete({ patientId: req.params.id });
        if (!deletedPatient) return res.status(404).json({ message: "Patient not found" });

        res.json({ message: "Patient deleted successfully!" });
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get a patient by ID (view route)
router.get('/view/:eid', async (req, res) => {
    try {
        const patient = await Patients.findOne({ patientId: req.params.eid });
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

router.get('/drop-contact-index', async (req, res) => {
    try {
        await Patients.collection.dropIndex("contact_1");
        res.send("✅ Dropped 'contact' unique index successfully");
    } catch (err) {
        res.status(500).send("❌ Error dropping index: " + err.message);
    }
});


module.exports = router;
