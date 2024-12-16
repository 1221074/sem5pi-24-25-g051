const express = require('express');
const Patient = require('../Models/Patient');

const router = express.Router();

// Create a patient
router.post('/patients', async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();
        res.status(201).send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all patients
router.get('/patients', async (req, res) => {
    try {
        const patients = await Patient.find();
        res.send(patients);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a patient
router.put('/patients/:id', async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(patient);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a patient
router.delete('/patients/:id', async (req, res) => {
    try {
        await Patient.findByIdAndDelete(req.params.id);
        res.send({ message: 'Patient deleted' });
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
