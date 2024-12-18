const express = require('express');
const Allergy = require('../Models/Allergy');

const router = express.Router();

// Create a new allergy
router.post('/allergy', async (req, res) => {
  try {
    const allergy = new Allergy(req.body);
    await allergy.save();
    res.status(201).json(allergy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all allergies
router.get('/allergy', async (req, res) => {
  try {
    const allergies = await Allergy.find();
    res.status(200).json(allergies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single allergy by ID
router.get('/allergy/:id', async (req, res) => {
  try {
    const allergy = await Allergy.findById(req.params.id);
    if (!allergy) {
      return res.status(404).json({ error: 'Allergy not found' });
    }
    res.status(200).json(allergy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single allergy by name 
router.get('/allergy/:name', async (req, res) => {
  try {
    const allergy = await Allergy.find({name: req.params.name});
    if (!allergy) {
      return res.status(404).json({ error: 'Allergy not found' });
    }
    res.status(200).json(allergy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update an allergy
router.put('/allergy/:id', async (req, res) => {
  try {
    const allergy = await Allergy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!allergy) {
      return res.status(404).json({ error: 'Allergy not found' });
    }
    res.status(200).json(allergy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an allergy
router.delete('/allergy/:id', async (req, res) => {
  try {
    const allergy = await Allergy.findByIdAndDelete(req.params.id);
    if (!allergy) {
      return res.status(404).json({ error: 'Allergy not found' });
    }
    res.status(200).json({ message: 'Allergy deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
