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
const Patients = require('../modal/patients'); // Ensure this matches your schema file

// 🛠️ Fix: Log requests for debugging
router.post('/patient', async (req, res) => {
    try {
        console.log("Received request:", req.body); // Debugging log

        const { department, gender, name, address, age, contact, date } = req.body;
        if (!department || !name || !gender || !age || !address || !contact || !date) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const newPatient = new Patients({
            department,
            gender,
            name,
            age,
            address,
            contact,
            date
        });

        await newPatient.save();
        res.json({ message: "Patient added successfully!" });

    } catch (error) {
        console.error("Error adding patient:", error);
        res.status(500).json({ message: "Error adding patient", error: error.message });
    }
});
router.get('/getall', async (req, res) => {
    try {
        const allPatients = await Patients.find();
        res.json(allPatients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching patients" });
    }
});


// 🛠️ Fix: Use `.findById(id)` instead of `.find(id)`
router.get('/getprint/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patients.findById(id);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Error fetching patient", error: error.message });
    }
});

// 🛠️ Fix: Ensure all fields are included in `findByIdAndUpdate`
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { department, gender, name, age, address, contact, date } = req.body;

        const updatedPatient = await Patients.findByIdAndUpdate(
            id,
            { department, gender, name, age, address, contact, date },
            { new: true }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json({ message: "Patient updated successfully!", patient: updatedPatient });

    } catch (error) {
        console.error("Error updating patient:", error);
        res.status(500).json({ message: "Error updating patient" });
    }
});

// 🛠️ Fix: Use `.findById(id)` instead of `.find(id)`
router.get('/view/:eid', async (req, res) => {
    try {
        const { eid } = req.params;
        const patient = await Patients.findById(eid);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json(patient);
    } catch (error) {
        console.error("Error fetching patient:", error);
        res.status(500).json({ message: "Error fetching patient", error: error.message });
    }
});

// 🛠️ Fix: `findByIdAndDelete(id)` instead of `find(id)`
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPatient = await Patients.findByIdAndDelete(id);

        if (!deletedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json({ message: "Patient deleted successfully!" });

    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).json({ message: "Error deleting patient" });
    }
});

module.exports = router;
