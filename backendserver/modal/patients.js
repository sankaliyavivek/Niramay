const mongoose = require("mongoose");
const moment = require("moment");

// Auto-increment counter schema
const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1 }
});
const Counter = mongoose.model("Counter", counterSchema);

const PatientsSchema = new mongoose.Schema({
    patientId: { type: Number, unique: true },
    department: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    address: { type: String, required: true },
    age: { type: Number, required: true, min: 0 },
    contact: { type: String, default: null },
    date: { type: String, required: true } // Stored as DD/MM/YYYY
});

// ✅ Move auto-increment logic to `pre("validate")` 
PatientsSchema.pre("validate", async function (next) {
    if (!this.patientId) {
        try {
            const counter = await Counter.findOne({ _id: "patientId" });
            this.patientId = counter ? counter.seq + 1 : 1;
        } catch (err) {
            return next(err);
        }
    }
    next();
});

PatientsSchema.post("save", async function () {
    await Counter.findByIdAndUpdate(
        { _id: "patientId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
});

// ✅ Format date before saving
PatientsSchema.pre("save", function (next) {
    if (this.date) {
        this.date = moment(this.date, "YYYY-MM-DD").format("DD/MM/YYYY");
    }
    next();
});

module.exports = mongoose.model("Patients", PatientsSchema);
