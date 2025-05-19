const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BitGuardian test server is running!' });
});

// Start server
const port = 3001;
app.listen(port, () => {
  console.log(`BitGuardian test server running on port ${port}`);
}); 