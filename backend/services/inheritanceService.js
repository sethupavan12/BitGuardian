const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const config = require('config');
const { LndClient } = require('./lndClient');
const { BitcoinClient } = require('./bitcoinClient');

class InheritanceService {
  constructor() {
    this.plans = new Map();
    this.dataPath = path.join(__dirname, '..', 'data', 'plans.json');
    this.bitcoinClient = new BitcoinClient(config.get('bitcoin.rpc'));
    
    // Connect to all LND nodes (owner and heirs)
    this.nodes = {};
    const nodeConfigs = config.get('lnd.nodes');
    
    for (const [role, nodeConfig] of Object.entries(nodeConfigs)) {
      this.nodes[role] = new LndClient(nodeConfig);
    }
    
    // Initialize plans from storage
    this._initialize();
  }
  
  async _initialize() {
    try {
      await this._ensureDataDirectory();
      await this.loadPlans();
      console.log('Inheritance service initialized');
    } catch (err) {
      console.error('Failed to initialize inheritance service:', err);
    }
  }
  
  async _ensureDataDirectory() {
    const dir = path.dirname(this.dataPath);
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }
  
  async loadPlans() {
    try {
      const data = await fs.readFile(this.dataPath, 'utf8').catch(err => {
        if (err.code === 'ENOENT') return '[]';
        throw err;
      });
      
      const plansArray = JSON.parse(data);
      this.plans = new Map(plansArray);
      console.log(`Loaded ${this.plans.size} inheritance plans`);
    } catch (err) {
      console.error('Error loading plans:', err);
      this.plans = new Map();
    }
  }
  
  async savePlans() {
    try {
      const plansArray = Array.from(this.plans.entries());
      await fs.writeFile(this.dataPath, JSON.stringify(plansArray, null, 2));
      console.log(`Saved ${this.plans.size} plans to storage`);
    } catch (err) {
      console.error('Error saving plans:', err);
    }
  }
  
  async createInheritancePlan(planData) {
    const planId = crypto.randomUUID();
    
    // Get owner node info
    const ownerInfo = await this.nodes.owner.getInfo();
    
    const plan = {
      id: planId,
      ownerId: ownerInfo.identityPubkey,
      ownerName: planData.ownerName || 'alice',
      heirs: planData.heirs || [],
      verificationSettings: planData.verificationSettings || {
        inactivityPeriod: 30 * 24 * 60 * 60, // 30 days in seconds
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'active'
    };
    
    this.plans.set(planId, plan);
    await this.savePlans();
    
    return plan;
  }
  
  async getInheritancePlan(planId) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error('Inheritance plan not found');
    return plan;
  }
  
  async executeInheritance(planId) {
    const plan = await this.getInheritancePlan(planId);
    
    // Get owner wallet balance
    const ownerBalances = await this.nodes.owner.getBalances();
    const totalAmount = ownerBalances.confirmed;
    
    if (totalAmount <= 0) {
      throw new Error('No funds available in owner wallet');
    }
    
    // Calculate distribution amounts
    const totalShares = plan.heirs.reduce((sum, heir) => sum + heir.share, 0);
    const distributions = [];
    
    // Execute the transactions
    for (const heir of plan.heirs) {
      // Calculate heir's share
      // Re-fetch balance before each transaction for more accuracy, especially if fees are significant
      const currentOwnerBalances = await this.nodes.owner.getBalances();
      const currentAvailableAmount = currentOwnerBalances.confirmed;

      if (currentAvailableAmount <= 0) {
        console.warn(`Owner has no funds remaining before sending to ${heir.name}. Skipping.`);
        continue; // Skip this heir if no funds left
      }

      const amount = Math.floor((heir.share / totalShares) * currentAvailableAmount * 0.95); // 5% buffer for fees
      
      if (amount <= 0) {
        console.warn(`Calculated amount for ${heir.name} is zero or negative. Skipping.`);
        continue; // Skip if calculated amount is too low
      }

      const heirRole = heir.name === 'bob' ? 'heir1' : 'heir2'; // This mapping might need to be more robust
      const heirNode = this.nodes[heirRole];
      
      if (!heirNode) {
        console.error(`No LND node configuration found for heir role: ${heirRole} (heir: ${heir.name}). Skipping.`);
        continue;
      }

      const { address } = await heirNode.getNewAddress();
      console.log(`Attempting to send ${amount} sats to ${heir.name} (${address})`);
      
      try {
        const txid = await this.nodes.owner.sendCoins({
          addr: address,
          amount: amount
        });
        
        console.log(`Successfully sent ${amount} sats to ${heir.name}, txid: ${txid}`);
        distributions.push({
          heir: heir.name,
          amount,
          address,
          txid
        });

        // Mine a block to confirm the transaction before the next send in regtest
        console.log(`Mining 1 block to confirm transaction for ${heir.name}...`);
        await this.bitcoinClient.generateToAddress(1);
        console.log(`Block mined. Transaction for ${heir.name} should be confirming.`);

        // Optional: Add a small delay to allow LND to sync, though usually not needed in regtest with immediate mining
        // await new Promise(resolve => setTimeout(resolve, 1000)); 

      } catch (error) {
        console.error(`Failed to send funds to ${heir.name}:`, error.message);
        // Decide if you want to stop all execution or continue with other heirs
        // For now, we log the error and continue
      }
    }
    
    // Update plan status
    plan.status = 'executed';
    plan.executedAt = Date.now();
    plan.distributions = distributions;
    
    await this.savePlans();
    
    // Mine some blocks to confirm transactions in Polar (this might be redundant now or can be reduced)
    // try {
    //   console.log('Mining blocks to confirm transactions...');
    //   await this.bitcoinClient.generateToAddress(6);
    //   console.log('Transactions confirmed');
    // } catch (error) {
    //   console.warn('Warning: Could not mine blocks to confirm transactions:', error.message);
    //   console.warn('Transactions may remain unconfirmed');
    // }
    
    return {
      planId,
      status: 'executed',
      distributions
    };
  }
  
  async getInheritancePlans() {
    return Array.from(this.plans.values());
  }
}

module.exports = new InheritanceService(); 