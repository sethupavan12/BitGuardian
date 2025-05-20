#!/bin/bash

# BitGuardian Startup Script with Sponsor Integration Support
# This script starts the BitGuardian backend and frontend with exSat and Rebar Shield integrations

# Function to check if a port is in use
check_port() {
  lsof -ti:$1 >/dev/null 2>&1
  return $?
}

# Function to kill process using a port
kill_port_process() {
  local PORT=$1
  if check_port $PORT; then
    echo "Port $PORT is in use. Killing process..."
    lsof -ti:$PORT | xargs kill -9 2>/dev/null
    sleep 1
    if check_port $PORT; then
      echo "⚠️ WARNING: Failed to free port $PORT! Please manually stop the process using this port."
      return 1
    else
      echo "✅ Port $PORT is now available."
      return 0
    fi
  else
    echo "✅ Port $PORT is available."
    return 0
  fi
}

# Print colorful banner
echo -e "\033[1;36m"
echo "  ____  _ _    ____                     _ _             "
echo " | __ )(_) |_ / ___|_   _  __ _ _ __ __| (_) __ _ _ __  "
echo " |  _ \| | __| |  _| | | |/ _\` | '__/ _\` | |/ _\` | '_ \ "
echo " | |_) | | |_| |_| | |_| | (_| | | | (_| | | (_| | | | |"
echo " |____/|_|\__|\____|\__,_|\__,_|_|  \__,_|_|\__,_|_| |_|"
echo ""
echo -e "\033[1;32mBitcoin Inheritance Platform with exSat and Rebar Shield Integration\033[0m"
echo ""

# Set paths
BACKEND_DIR="$PWD/backend"
FRONTEND_DIR="$PWD/bitguardian-next-chakra"

# Warning about Polar requirement (without checking)
echo -e "\033[1;33mNOTE: BitGuardian requires Polar for Bitcoin/Lightning network simulation.\033[0m"
echo -e "Please ensure Polar is running with a properly configured network before interacting with Bitcoin features."
echo ""

# Kill processes using required ports
echo "Checking for required ports..."
kill_port_process 3000 || exit 1
kill_port_process 3001 || exit 1

# Install dependencies if needed
echo "Checking backend dependencies..."
cd "$BACKEND_DIR" || { echo "Backend directory not found"; exit 1; }
if [ ! -d "node_modules" ]; then
  echo "Installing backend dependencies..."
  npm install
else
  # Check for specific required dependencies
  echo "Verifying required packages..."
  if ! npm list axios >/dev/null 2>&1; then
    echo "Installing axios..."
    npm install axios
  fi
  if ! npm list bitcoinjs-lib >/dev/null 2>&1; then
    echo "Installing bitcoinjs-lib..."
    npm install bitcoinjs-lib
  fi
fi

# Start using simple server first if available
if [ -f "simple-server.js" ]; then
  echo "Starting simple backend server first..."
  node simple-server.js &
  SIMPLE_SERVER_PID=$!
  echo "Waiting for simple server to start..."
  sleep 2
fi

# Start the main backend server
echo "Starting main backend server..."
npm start &
BACKEND_PID=$!

# Wait for the backend to be ready
echo "Waiting for backend to initialize..."
sleep 3

# Kill simple server if it was started
if [ ! -z "$SIMPLE_SERVER_PID" ]; then
  echo "Stopping simple server..."
  kill $SIMPLE_SERVER_PID 2>/dev/null
fi

# Start the frontend
echo -e "\033[1;33mStarting BitGuardian frontend...\033[0m"
cd "$FRONTEND_DIR" || { echo "Frontend directory not found"; exit 1; }

# Check frontend dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing frontend dependencies..."
  npm install
fi

# Start frontend
echo "Starting frontend development server..."
npm run dev &
FRONTEND_PID=$!

# Trap Ctrl+C and other termination signals
trap 'echo "Shutting down..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit' INT TERM

# Information about sponsor integrations
echo -e "\033[1;32m"
echo "✅ BitGuardian is now running with the following sponsor integrations:"
echo "   - exSat Data Consensus Extension Protocol"
echo "   - Rebar Shield Private Transaction Service"
echo ""
echo "👨‍💻 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001/api"
echo "🩺 Health check: http://localhost:3001/api/health"
echo -e "\033[0m"

# Wait for both processes
wait
