const express = require('express');
const router = express.Router();
const inheritanceService = require('../services/inheritanceService');
const { ExSatService } = require('../services/exSatService');
const { RebarShieldService } = require('../services/rebarShieldService');
const config = require('config');

// Initialize service instances for the routes
const exSatService = new ExSatService(config.get('exSat'));
const rebarShieldService = new RebarShieldService(config.get('rebarShield'));

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

// Create an Aethelred Legacy Lockbox plan
router.post('/aethelred/create-plan', async (req, res) => {
  try {
    const planDetails = await inheritanceService.createAethelredLegacyLockbox(req.body);
    res.status(201).json({ 
      success: true, 
      message: 'Legacy Lockbox plan configured successfully.',
      ...planDetails 
    });
  } catch (error) {
    // Log the error for server-side debugging
    console.error('Error creating Aethelred plan:', error.message);
    // Send a user-friendly error message
    res.status(400).json({ success: false, error: error.message }); // 400 for client errors, 500 for server issues
  }
});

// Get information about sponsor integrations
router.get('/sponsor-integrations', async (req, res) => {
  try {
    // Generate example metadata for demo purposes
    const exSatExample = {
      metadataId: `exsat-meta-demo-${Math.random().toString(36).substring(2, 10)}`,
      txid: Array(64).fill(0).map(() => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join('')
    };
    
    res.json({
      success: true,
      integrations: {
        exSat: {
          name: 'exSat Data Consensus Extension Protocol',
          description: 'exSat extends Bitcoin\'s metadata consensus with a Hybrid Mechanism (PoW + PoS), providing secure and decentralized metadata storage for inheritance plans.',
          enabled: true,
          endpoint: config.get('exSat.endpoint'),
          example: exSatExample,
          demo_mode: true
        },
        rebarShield: {
          name: 'Rebar Shield Private Transaction Service',
          description: 'Rebar Shield allows Bitcoin transactions to be submitted directly to mining pools, bypassing the public mempool for faster and more private settlement.',
          enabled: true,
          available: true,
          endpoint: config.get('rebarShield.endpoint'),
          demo_mode: true
        }
      }
    });
  } catch (error) {
    console.error('Error generating sponsor integrations data:', error.message);
    // For demo, still return success with simulated data
    res.json({
      success: true,
      integrations: {
        exSat: {
          name: 'exSat Data Consensus Extension Protocol',
          description: 'exSat extends Bitcoin\'s metadata consensus with a Hybrid Mechanism (PoW + PoS), providing secure and decentralized metadata storage for inheritance plans.',
          enabled: true,
          endpoint: 'https://api.exsat.network/testnet',
          example: {
            metadataId: 'exsat-meta-demo-fallback',
            txid: '28a34567cc90123456789abcdef012345678901234567890abcdef0123456789'
          },
          demo_mode: true
        },
        rebarShield: {
          name: 'Rebar Shield Private Transaction Service',
          description: 'Rebar Shield allows Bitcoin transactions to be submitted directly to mining pools, bypassing the public mempool for faster and more private settlement.',
          enabled: true,
          available: true,
          endpoint: 'https://shield.rebarlabs.io/v1',
          demo_mode: true
        }
      }
    });
  }
});

module.exports = router; 