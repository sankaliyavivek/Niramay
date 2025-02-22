// const express = require('express');
// const router = express.Router();
// const Patients = require('../modal/patients');

// router.post('/patient', async (req, res) => {
//     try {
//         const { department, gender, name, address, age, contact, date } = req.body;

//         if (!department || !name || !gender || !age || !address || !contact || !date) {
//             return res.status(400).json({ message: "All fields are required!" });
//         }

//         const newPatient = new Patients({
//             department,
//             gender,
//             name,
//             age,
//             address,
//             contact,
//             date
//         });

//         await newPatient.save();
//         res.json({ message: "Patient added successfully!" });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error adding patient" });
//     }
// });

// router.get('/getall', async (req, res) => {
//     try {
//         const allPatients = await Patients.find();
//         res.json(allPatients);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching patients" });
//     }
// });


// router.get('/getprint/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const patient = await Patients.findById(id);

//         if (!patient) {
//             console.log("Patient not found");
//             return res.status(404).json({ message: "Patient not found" });
//         }

//         res.json(patient);
//     } catch (error) {
//         console.error("Error fetching patient:", error);
//         res.status(500).json({ message: "Error fetching patient", error: error.message });
//     }
// });


// router.put('/update/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { department, gender, name, age, address, contact, date } = req.body;

//         const updatedPatient = await Patients.findByIdAndUpdate(
//             id,
//             { department, gender, name, age, address, contact, date },
//             { new: true } // Return updated document
//         );

//         if (!updatedPatient) {
//             return res.status(404).json({ message: "Patient not found" });
//         }

//         res.json({ message: "Patient updated successfully!", patient: updatedPatient });

//     } catch (error) {
//         console.error("Error updating patient:", error);
//         res.status(500).json({ message: "Error updating patient" });
//     }
// });


// router.get('/getprint/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const patient = await Patients.findById(id);
        
//         if (!patient) {
//             return res.status(404).json({ message: "Patient not found" });
//         }
        
//         res.json(patient); // Send patient data to frontend

//     } catch (error) {
//         console.error("Error fetching patient:", error);
//         res.status(500).json({ message: "Error fetching patient", error: error.message });
//     }
// });


// router.delete('/delete/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deletedPatient = await Patients.findByIdAndDelete(id);

//         if (!deletedPatient) {
//             return res.status(404).json({ message: "Patient not found" });
//         }

//         res.json({ message: "Patient deleted successfully!" });

//     } catch (error) {
//         console.error("Error deleting patient:", error);
//         res.status(500).json({ message: "Error deleting patient" });
//     }
// });

// router.get('/view/:eid', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const allPatients = await Patients.find(id);
//         res.json(allPatients);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching patients" });
//     }
// });


// module.exports = router;



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
        const { id } = req.params;
        const allPatients = await Patients.find(id);
        res.json(allPatients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients" });
    }
});

module.exports = router;
