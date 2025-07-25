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
     contact: {
    type: String
  },
 // ✅ allow null & duplicates if missing
    date: { type: Date, required: true }
});


// Auto-increment patientId
PatientsSchema.pre("validate", async function (next) {
    if (!this.patientId) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: "patientId" },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this.patientId = counter.seq;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        next();
    }

});




module.exports = mongoose.model("Patients", PatientsSchema);
