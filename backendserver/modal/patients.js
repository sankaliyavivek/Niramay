const mongooes =require('mongoose');

const PatientsSchema = mongooes.Schema({
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
})

module.exports = mongooes.model('Patients',PatientsSchema);