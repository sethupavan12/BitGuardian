const express = require('express');
const router = express.Router();
const inheritanceService = require('../services/inheritanceService');

// Get all inheritance plans
router.get('/plans', async (req, res) => {
  try {
    const plans = await inheritanceService.getInheritancePlans();
    res.json({ success: true, data: plans });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new inheritance plan
router.post('/plans', async (req, res) => {
  try {
    const plan = await inheritanceService.createInheritancePlan(req.body);
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a specific inheritance plan
router.get('/plans/:id', async (req, res) => {
  try {
    const plan = await inheritanceService.getInheritancePlan(req.params.id);
    res.json({ success: true, data: plan });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
});

// Execute inheritance plan
router.post('/plans/:id/execute', async (req, res) => {
  try {
    const result = await inheritanceService.executeInheritance(req.params.id);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router; 