# BitGuardian Polar

BitGuardian is a Bitcoin inheritance platform that enables users to create secure inheritance plans on Bitcoin's network. This version is integrated with Polar for local testing and development.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [Polar](https://lightningpolar.com/) for Bitcoin/Lightning network simulation

## Setup Polar Network

1. Open Polar and create a new network with:
   - 3 LND nodes (alice, bob, carol)
   - 1 Bitcoin Core node

2. Start the network and fund alice with at least 1,000,000 sats using the deposit button

## Project Structure

- `backend/` - Express.js API server
- `frontend/` - React-based UI
- `config/` - Application configuration

## Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Backend

```bash
cd backend
npm start
```

The server will start on port 3000.

### Frontend

```bash
cd frontend
npm start
```

The React dev server will start on port 3001 (or another available port).

## Usage

1. Open your browser and navigate to http://localhost:3001
2. Create a new inheritance plan (default: alice distributes to bob and carol)
3. Execute the plan to distribute funds
4. Check your Polar network to see the transactions

## Features

- Create inheritance plans with multiple heirs and customizable shares
- Execute plans with automatic Bitcoin transactions
- Monitor plan status and execution
- Direct integration with Polar for testing

## Notes

- This is a simplified version for testing with Polar
- The LND and Bitcoin clients are partially simulated for easier testing 