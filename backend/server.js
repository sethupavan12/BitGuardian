const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('config');
const { ExSatService } = require('./services/exSatService');
const { RebarShieldService } = require('./services/rebarShieldService');
const inheritanceRoutes = require('./routes/inheritance');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize services for status check
const exSatService = new ExSatService(config.get('exSat'));
const rebarShieldService = new RebarShieldService(config.get('rebarShield'));

// Routes
app.use('/api/inheritance', inheritanceRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  // For demo purposes, always report services as available
  const rebarStatus = true;
  
  res.status(200).json({ 
    status: 'ok',
    integrations: {
      exSat: {
        enabled: true, // Demo mode - always report as enabled
        endpoint: config.get('exSat.endpoint'),
        demo_mode: true
      },
      rebarShield: {
        enabled: true, // Demo mode - always report as enabled
        available: true,
        endpoint: config.get('rebarShield.endpoint'),
        demo_mode: true
      }
    }
  });
});

// Start server
const port = config.get('server.port'); // Use the port from config
app.listen(port, () => {
  console.log(`BitGuardian server running on port ${port}`);
  console.log(`exSat integration: ENABLED (Demo Mode)`);
  console.log(`Rebar Shield integration: ENABLED (Demo Mode)`);
  console.log('API Health check available at http://localhost:' + port + '/api/health');
}); 