const mongoose = require("mongoose");
const moment = require("moment");

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
        type: String,   // <-- Change this to String to store DD/MM/YYYY
        required: true,
    }
});

// ✅ Auto-increment patientId middleware
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
