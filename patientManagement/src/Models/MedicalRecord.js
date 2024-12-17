const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
    patientId: {type: String},
    allergies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Allergy', required: true }],
    medicalConditions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MedicalCondition', required: true }],
    freeText: { type: String },
}, { timestamps: true }); // Automatically add 'createdAt' and 'updatedAt'

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
