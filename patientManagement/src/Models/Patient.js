const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, required: true },
    status: { type: String, enum: ['Scheduled', 'Completed', 'Cancelled'], required: true },
});

const patientSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    fullName: { type: String, get: function() { return `${this.firstName} ${this.lastName}`; } },
    dateOfBirth: Date,
    gender: String,
    medicalRecordNumber: { type: String, unique: true },
    contactInfo: {
        email: String,
        phone: String,
    },
    allergies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allergy', required: true }],
    medicalConditions: [String],
    emergencyContact: {
        name: String,
        phone: String,
    },
    appointmentHistory: [appointmentSchema],
});

module.exports = mongoose.model('Patient', patientSchema);
