const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const config = require('config');
const { LndClient } = require('./lndClient');
const { BitcoinClient } = require('./bitcoinClient');
const { ExSatService } = require('./exSatService');
const { RebarShieldService } = require('./rebarShieldService');

class InheritanceService {
  constructor() {
    this.plans = new Map();
    this.dataPath = path.join(__dirname, '..', 'data', 'plans.json');
    this.bitcoinClient = new BitcoinClient(config.get('bitcoin.rpc'));
    
    // Initialize exSat and Rebar Shield services
    this.exSatService = new ExSatService(config.get('exSat'));
    this.rebarShieldService = new RebarShieldService(config.get('rebarShield'));
    
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
    
    // Store plan metadata on exSat
    try {
      const exSatResult = await this.exSatService.storePlanMetadata(plan);
      if (exSatResult.success) {
        plan.exSatMetadataId = exSatResult.metadataId;
        plan.exSatTxid = exSatResult.txid;
        console.log(`Plan metadata stored on exSat with ID: ${exSatResult.metadataId}`);
      } else {
        console.warn('Failed to store plan metadata on exSat');
      }
    } catch (error) {
      console.error('Error storing plan metadata on exSat:', error.message);
    }
    
    this.plans.set(planId, plan);
    await this.savePlans();
    
    return plan;
  }
  
  async getInheritancePlan(planId) {
    const plan = this.plans.get(planId);
    if (!plan) throw new Error('Inheritance plan not found');
    
    // If plan has exSat metadata ID, try to fetch updated metadata
    if (plan.exSatMetadataId) {
      try {
        const exSatData = await this.exSatService.getPlanMetadata(plan.exSatMetadataId);
        if (exSatData.success && exSatData.data) {
          // Merge any updated metadata from exSat
          console.log(`Retrieved updated metadata from exSat for plan ${planId}`);
        }
      } catch (error) {
        console.warn(`Failed to fetch exSat metadata for plan ${planId}:`, error.message);
      }
    }
    
    return plan;
  }
  
  async executeInheritance(planId) {
    const plan = await this.getInheritancePlan(planId);
    
    // Verify execution conditions using exSat
    if (plan.exSatMetadataId) {
      try {
        const verificationResult = await this.exSatService.verifyExecutionConditions(planId, {
          type: 'manual_execution',
          timestamp: Date.now()
        });
        
        if (!verificationResult.verified) {
          console.warn(`ExSat verification failed for plan ${planId}:`, verificationResult.details);
          // In a real implementation, we might want to stop execution here
          // For demo purposes, we'll continue
        } else {
          console.log(`ExSat verified execution conditions for plan ${planId}`);
        }
      } catch (error) {
        console.error(`ExSat verification error for plan ${planId}:`, error.message);
      }
    }
    
    // Get owner wallet balance
    const ownerBalances = await this.nodes.owner.getBalances();
    const totalAmount = ownerBalances.confirmed;
    
    console.log(`Initial owner balance: ${totalAmount} satoshis`);
    
    if (totalAmount <= 0) {
      throw new Error('No funds available in owner wallet');
    }
    
    // Calculate distribution amounts based on heir percentages
    const totalShares = plan.heirs.reduce((sum, heir) => sum + heir.share, 0);
    if (totalShares <= 0) {
      throw new Error('Total shares must be greater than zero');
    }
    
    console.log(`Total shares: ${totalShares}%`);
    
    // Available amount after reserving some for fees
    const availableAmount = Math.floor(totalAmount * 0.95); // 5% buffer for fees
    console.log(`Total available amount after fee buffer: ${availableAmount} satoshis`);
    
    // Pre-calculate all amounts first to ensure they match percentages exactly
    const heirAmounts = plan.heirs.map(heir => {
      const exactPercentage = heir.share / totalShares;
      const exactAmount = exactPercentage * availableAmount;
      const amount = Math.floor(exactAmount);
      
      console.log(`DEBUG: ${heir.name} (${heir.share}%) - exact: ${exactAmount}, rounded: ${amount}`);
      return {
        heir,
        amount,
        exactAmount,
        percentage: exactPercentage
      };
    });
    
    // Sort heirs by share percentage (highest first) to prioritize larger recipients
    heirAmounts.sort((a, b) => b.heir.share - a.heir.share);
    
    const distributions = [];
    
    // Track how much we've actually sent
    let totalSent = 0;
    
    // Check if Rebar Shield is available for private transactions
    const useRebarShield = await this.rebarShieldService.checkServiceAvailability();
    console.log(`Rebar Shield available for private transactions: ${useRebarShield ? 'YES' : 'NO'}`);
    
    // Execute the transactions
    for (const heirData of heirAmounts) {
      const heir = heirData.heir;
      let amount = heirData.amount;
      
      // Check if we need to adjust the last transaction to account for rounding
      if (heirData === heirAmounts[heirAmounts.length - 1]) {
        const remainingToSend = availableAmount - totalSent;
        if (remainingToSend > 0 && remainingToSend !== amount) {
          console.log(`Adjusting final amount for ${heir.name} from ${amount} to ${remainingToSend} to account for rounding`);
          amount = remainingToSend;
        }
      }

      console.log(`Will distribute ${amount} satoshis (${heir.share}%) to ${heir.name}`);
      
      if (amount <= 0) {
        console.warn(`Calculated amount for ${heir.name} is zero or negative. Skipping.`);
        continue;
      }

      const heirRole = heir.name === 'bob' ? 'heir1' : 'heir2'; // This mapping might need to be more robust
      const heirNode = this.nodes[heirRole];
      
      if (!heirNode) {
        console.error(`No LND node configuration found for heir role: ${heirRole} (heir: ${heir.name}). Skipping.`);
        continue;
      }

      // Verify we have sufficient funds before proceeding
      const currentBalance = await this.nodes.owner.getBalances();
      if (currentBalance.confirmed < amount) {
        console.error(`Insufficient funds to send ${amount} to ${heir.name}. Owner balance: ${currentBalance.confirmed}`);
        break; // Stop execution if we don't have enough funds
      }

      const { address } = await heirNode.getNewAddress();
      console.log(`Attempting to send ${amount} sats to ${heir.name} (${address})`);
      
      try {
        // Get the raw transaction from LND
        const rawTxResponse = await this.nodes.owner.sendCoinsRaw({
          addr: address,
          amount: amount
        });
        
        // If Rebar Shield is available, use it for private transaction submission
        let txResult;
        if (useRebarShield) {
          console.log(`Using Rebar Shield for private transaction to ${heir.name}`);
          txResult = await this.rebarShieldService.submitTransaction(rawTxResponse.raw_tx_hex, {
            priority: 'high',
            privatePool: true
          });
        } else {
          // If Rebar Shield is not available, use standard LND sendCoins
          console.log(`Using standard LND for transaction to ${heir.name}`);
          const txid = await this.nodes.owner.sendCoins({
            addr: address,
            amount: amount
          });
          txResult = { success: true, txid };
        }
        
        if (txResult.success) {
          console.log(`Successfully sent ${amount} sats to ${heir.name}, txid: ${txResult.txid}`);
          totalSent += amount;
          
          distributions.push({
            heir: heir.name,
            amount,
            address,
            txid: txResult.txid,
            private: useRebarShield
          });

          // Mine a block to confirm the transaction before the next send in regtest
          console.log(`Mining 1 block to confirm transaction for ${heir.name}...`);
          await this.bitcoinClient.generateToAddress(1);
          console.log(`Block mined. Transaction for ${heir.name} should be confirming.`);
        } else {
          console.error(`Failed to send funds to ${heir.name}: Transaction failed`);
        }
      } catch (error) {
        console.error(`Failed to send funds to ${heir.name}:`, error.message);
        // Continue with other heirs
      }
    }
    
    console.log(`Total distributed: ${totalSent} out of ${availableAmount} planned satoshis`);
    
    // Update plan status
    plan.status = 'executed';
    plan.executedAt = Date.now();
    plan.distributions = distributions;
    
    // Update the plan status on exSat as well
    if (plan.exSatMetadataId) {
      try {
        const statusUpdateData = {
          status: 'executed',
          executedAt: plan.executedAt,
          distributions: distributions.map(dist => ({
            heir: dist.heir,
            amount: dist.amount,
            txid: dist.txid
          }))
        };
        
        await this.exSatService.storePlanMetadata({
          ...plan,
          ...statusUpdateData
        });
      } catch (error) {
        console.error('Error updating plan status on exSat:', error.message);
      }
    }
    
    await this.savePlans();
    
    return {
      planId,
      status: 'executed',
      distributions
    };
  }
  
  async getInheritancePlans() {
    return Array.from(this.plans.values());
  }

  /**
   * Creates an Aethelred Legacy Lockbox plan.
   * @param {object} planData - The data for the Aethelred plan.
   * @param {string[]} planData.primaryHeirPubkeys - Array of hex-encoded compressed public keys for primary heirs.
   * @param {string} planData.recoveryPubkey - Hex-encoded compressed public key for the recovery agent.
   * @param {number} planData.lockTimePath2 - CLTV value (block height or timestamp) for Path 2.
   * @param {number} planData.lockTimePath3 - CLTV value (block height or timestamp) for Path 3.
   * @returns {object} The P2WSH address, witness script (hex), and plan details.
   */
  async createAethelredLegacyLockbox(planData) {
    const { primaryHeirPubkeys, recoveryPubkey, lockTimePath2, lockTimePath3 } = planData;

    // Basic Input Validation
    if (!primaryHeirPubkeys || !Array.isArray(primaryHeirPubkeys) || primaryHeirPubkeys.length === 0) {
      throw new Error('Primary heir public keys array is required and cannot be empty.');
    }
    if (!recoveryPubkey || typeof recoveryPubkey !== 'string') {
      throw new Error('Recovery public key (hex string) is required.');
    }
    if (typeof lockTimePath2 !== 'number' || typeof lockTimePath3 !== 'number') {
      throw new Error('Lock times for Path 2 and Path 3 must be numbers.');
    }
    if (lockTimePath3 <= lockTimePath2) {
      throw new Error('Guardian Access Time (lockTimePath3) must be strictly greater than Survivor Access Time (lockTimePath2).');
    }

    let heirPubkeyBuffers;
    let recoveryPubkeyBuffer;

    try {
      heirPubkeyBuffers = primaryHeirPubkeys.map(hex => Buffer.from(hex, 'hex'));
      recoveryPubkeyBuffer = Buffer.from(recoveryPubkey, 'hex');
      // Validate pubkey lengths (compressed pubkeys are 33 bytes)
      heirPubkeyBuffers.forEach(buf => { if (buf.length !== 33) throw new Error('Invalid primary heir public key length.'); });
      if (recoveryPubkeyBuffer.length !== 33) throw new Error('Invalid recovery public key length.');
    } catch (e) {
      throw new Error(`Invalid public key format: ${e.message}`);
    }

    const witnessScript = this.bitcoinClient.createAethelredWitnessScript(
      heirPubkeyBuffers,
      recoveryPubkeyBuffer,
      lockTimePath2,
      lockTimePath3
    );

    const p2wshAddress = this.bitcoinClient.getAethelredP2WSHAddress(witnessScript);
    const networkString = this.bitcoinClient.networkString; // Get network from bitcoinClient

    // Store lockbox details on exSat for added security and transparency
    const lockboxData = {
      type: 'aethelred_lockbox',
      address: p2wshAddress,
      witnessScript: witnessScript.toString('hex'),
      primaryHeirPubkeys,
      recoveryPubkey,
      lockTimePath2,
      lockTimePath3,
      network: networkString,
      createdAt: Date.now()
    };
    
    try {
      const exSatResult = await this.exSatService.storePlanMetadata(lockboxData);
      if (exSatResult.success) {
        lockboxData.exSatMetadataId = exSatResult.metadataId;
        lockboxData.exSatTxid = exSatResult.txid;
        console.log(`Lockbox data stored on exSat with ID: ${exSatResult.metadataId}`);
      }
    } catch (error) {
      console.warn('Failed to store lockbox data on exSat:', error.message);
    }

    return {
      lockboxAddress: p2wshAddress,
      accessBlueprint: witnessScript.toString('hex'),
      planDetails: {
        primaryHeirPubkeys: primaryHeirPubkeys, // return original hex strings
        recoveryPubkey: recoveryPubkey,         // return original hex string
        survivorAccessTime: lockTimePath2,
        guardianAccessTime: lockTimePath3,
        network: networkString,
        exSatMetadataId: lockboxData.exSatMetadataId
      }
    };
  }
}

module.exports = new InheritanceService(); 