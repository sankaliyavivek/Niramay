// const mongooes =require('mongoose');

// const PatientsSchema = mongooes.Schema({
//     department: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     gender: {
//         type: String,
//         enum: ['Male', 'Female', 'Other'], 
//         required: true
//     },

//     address: {
//         type: String,
//         required: true
//     },
//     age: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     contact: {
//         type: String,
//         required: true,
//         unique: true,
//         match: [/^\d{10}$/, 'Invalid contact number'] // Ensures a 10-digit number
//     },
//     date: {
//         type: Date,
//         default: Date.now
//     }
// })

// module.exports = mongooes.model('Patients',PatientsSchema);



const mongoose = require("mongoose");

// Auto-increment helper schema
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});

const Counter = mongoose.model("Counter", counterSchema);

const PatientsSchema = new mongoose.Schema({
    patientId: { type: Number, unique: true },
    department: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], 
        required: true
    },
    address: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 0
    },
    contact: {
        type: String,
        required: true,
        unique: true,
        match: [/^\d{10}$/, 'Invalid contact number'] // Ensures a 10-digit number
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to auto-increment patientId
PatientsSchema.pre("save", async function (next) {
    if (!this.patientId) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: "patientId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.patientId = counter.seq;
        } catch (err) {
            return next(err);
        }
    }
    next();
});

module.exports = mongoose.model("Patients", PatientsSchema);
