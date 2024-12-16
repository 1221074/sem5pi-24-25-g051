const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: String,
    medicalRecordNumber: { type: String, unique: true },
    contactInfo: {
        email: String,
        phone: String,
    },
    allergies: [String],
    medicalConditions: [String],
    emergencyContact: {
        name: String,
        phone: String,
    },
    appointmentHistory: [
        {
            date: Date,
            type: String,
            status: String,
        },
    ],
});

module.exports = mongoose.model('Patient', patientSchema);
