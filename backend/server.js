const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('config');
const inheritanceRoutes = require('./routes/inheritance');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/inheritance', inheritanceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
const port = 3001; // Hardcoded to always use port 3001
app.listen(port, () => {
  console.log(`BitGuardian server running on port ${port}`);
}); 