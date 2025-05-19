const http = require('http');

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    status: 'ok', 
    message: 'BitGuardian simple server is running!',
    port: 3001
  }));
});

// Listen on port 3001
server.listen(3001, () => {
  console.log('Simple server running on port 3001');
}); 