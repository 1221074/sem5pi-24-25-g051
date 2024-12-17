const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    allergies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allergy', required: true }],
    chronicConditions: [String],
    previousSurgeries: [{
        surgery: String,
        date: Date
    }],
    familyHistory: {
        father: String,
        mother: String
    },
    smokingStatus: String,
    currentMedications: [{
        name: String,
        dosage: String,
        frequency: String
    }],
    recentVisits: [{
        date: Date,
        reason: String,
        diagnosis: String,
        doctorsNotes: String
    }],
    labResults: [{
        test: String,
        result: String
    }],
    immunizations: [{
        vaccine: String,
        date: Date
    }],
    planRecommendations: String
}, { timestamps: true }); // Automatically add 'createdAt' and 'updatedAt'

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
