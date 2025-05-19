#!/bin/bash

# Function to check if a port is in use
check_port() {
  lsof -i:$1 >/dev/null 2>&1
  return $?
}

# Kill any processes using port 3000 or 3001
echo "Stopping any existing server processes..."
for PORT in 3000 3001; do
  if check_port $PORT; then
    echo "Port $PORT is in use. Killing processes..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
    sleep 1
  else
    echo "Port $PORT is available."
  fi
done

# Check again to be sure
for PORT in 3000 3001; do
  if check_port $PORT; then
    echo "WARNING: Port $PORT is still in use after kill attempt!"
    echo "Please manually kill the process using: lsof -ti:$PORT | xargs kill -9"
    exit 1
  fi
done

# Start the backend server with the simple server first
echo "Starting BitGuardian backend server on port 3001..."
cd backend
node simple-server.js &
BACKEND_PID=$!

# Wait for the backend to start up
echo "Waiting for backend to start..."
sleep 2

# Test if the backend is running
if curl -s http://localhost:3001 > /dev/null; then
  echo "✅ Backend successfully started on port 3001"
else
  echo "❌ Backend failed to start on port 3001"
  kill $BACKEND_PID 2>/dev/null || true
  exit 1
fi

# Start the frontend server
echo "Starting BitGuardian frontend on port 3000..."
cd ../bitguardian-next-chakra
npm run dev

# If frontend is stopped, also kill the backend
kill $BACKEND_PID 2>/dev/null || true
