const express = require('express');
const MedicalCondition = require('../Models/MedicalCondition');

const router = express.Router();

// Create a new medical condition
router.post('/medicalcondition', async (req, res) => {
  try {
    const condition = new MedicalCondition(req.body);
    await condition.save();
    res.status(201).json(condition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all medical conditions
router.get('/medicalcondition', async (req, res) => {
  try {
    const conditions = await MedicalCondition.find();
    res.status(200).json(conditions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a medical condition by id
router.get('/medicalcondition/:id', async (req, res) => {
  try {
    const condition = await MedicalCondition.findById(req.params.id);
    if (!condition) {
      return res.status(404).json({ error: 'Medical Condition not found' });
    }
    res.status(200).json(condition);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a medical condition
router.put('/medicalcondition/:id', async (req, res) => {
  try {
    const condition = await MedicalCondition.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!condition) {
      return res.status(404).json({ error: 'Medical Condition not found' });
    }
    res.status(200).json(condition);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a medical condition
router.delete('/medicalcondition/:id', async (req, res) => {
  try {
    const condition = await MedicalCondition.findByIdAndDelete(req.params.id);
    if (!condition) {
      return res.status(404).json({ error: 'Medical Condition not found' });
    }
    res.status(200).json({ message: 'Medical Condition deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
