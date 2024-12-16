const express = require('express');
const Allergy = require('../Models/Allergy');

const router = express.Router();

// Create a new allergy
router.post('/', async (req, res) => {
  try {
    const allergy = new Allergy(req.body);
    await allergy.save();
    res.status(201).json(allergy);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all allergies
router.get('/', async (req, res) => {
  try {
    const allergies = await Allergy.find();
    res.status(200).json(allergies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single allergy by ID
router.get('/:id', async (req, res) => {
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

// Update an allergy
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
