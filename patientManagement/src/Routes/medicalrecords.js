const express = require('express');
const MedicalRecord = require('../Models/MedicalRecord');

const router = express.Router();


// Get a specific medical record by Patient ID
router.get('/records/:patientId', async (req, res) => {
    try {
        const record = await MedicalRecord.findOne({ patientId: req.params.patientId })
            .populate('allergies'); // Populating allergies reference
        if (!record) return res.status(404).json({ error: 'Record not found' });
        res.json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all medical records (Optional)
router.get('/records', async (req, res) => {
    try {
        const records = await MedicalRecord.find();
        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Update a medical record
router.put('/records/:patientId', async (req, res) => {
    try {
        const record = await MedicalRecord.findOneAndUpdate(
            { patientId: req.params.patientId },
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!record) return res.status(404).json({ error: 'Record not found' });
        res.json({ message: 'Medical record updated', data: record });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


module.exports = router;