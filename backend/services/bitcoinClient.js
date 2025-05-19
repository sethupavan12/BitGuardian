const Client = require('bitcoin-core');
const bitcoin = require('bitcoinjs-lib');
const ecc = require('@bitcoinerlab/secp256k1');
const { ECPairFactory } = require('ecpair');

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

// Helper function to compile script elements into a Buffer
function compileScript(scriptElements) {
  return bitcoin.script.compile(scriptElements);
}

class BitcoinClient {
  constructor(config) {
    // Log the received config to debug its actual runtime values
    console.log('BitcoinClient constructor received config:', JSON.stringify(config, null, 2));

    const hostOnly = (config.host || '127.0.0.1').replace(/\/$/, '');
    const port = config.port || 18443;
    const user = config.user || 'polaruser';
    const pass = config.pass || 'polarpass';
    this.networkString = config.network || 'regtest'; // 'regtest', 'testnet', 'bitcoin'
    this.bitcoinJsNetwork = bitcoin.networks[this.networkString] || bitcoin.networks.regtest;

    // For bitcoin-core 2.x.x, the 'host' parameter is the full base URL.
    const rpcFullUrl = `http://${user}:${pass}@${hostOnly}:${port}`;

    this.client = new Client({
      host: rpcFullUrl, // This is the full base URL for RPC calls
      timeout: config.timeout || 30000, // Optional: set a timeout
    });
    
    console.log(`Initialized Bitcoin client (network: ${this.networkString}) using RPC URL: ${rpcFullUrl}`);
  }

  getNetwork() {
    return this.bitcoinJsNetwork;
  }

  // Aethelred Protocol Functions
  /**
   * Creates the Aethelred witness script.
   * @param {Buffer[]} primaryHeirPubkeys Array of public key buffers for primary heirs.
   * @param {Buffer} recoveryPubkey Public key buffer for the ultimate recovery agent.
   * @param {number} lockTimePath2 CLTV value (block height or timestamp) for Path 2 (survivor).
   * @param {number} lockTimePath3 CLTV value (block height or timestamp) for Path 3 (recovery), must be > lockTimePath2.
   * @returns {Buffer} The compiled P2WSH witness script.
   */
  createAethelredWitnessScript(primaryHeirPubkeys, recoveryPubkey, lockTimePath2, lockTimePath3) {
    if (!primaryHeirPubkeys || primaryHeirPubkeys.length === 0) {
      throw new Error('At least one primary heir public key is required.');
    }
    if (!recoveryPubkey) {
      throw new Error('Recovery public key is required.');
    }
    if (lockTimePath3 <= lockTimePath2) {
      throw new Error('LockTime_Path3 must be strictly greater than LockTime_Path2.');
    }

    const primaryM = primaryHeirPubkeys.length; // M-of-N, where N is also primaryHeirPubkeys.length for "all must sign"
    const survivorM = 1; // For survivor path, typically 1-of-N

    const scriptElements = [
      // Path 1: Primary Heirs (M-of-N, e.g., 2-of-2)
      bitcoin.opcodes.OP_IF,
      bitcoin.script.number.encode(primaryM),
      ...primaryHeirPubkeys,
      bitcoin.script.number.encode(primaryHeirPubkeys.length),
      bitcoin.opcodes.OP_CHECKMULTISIG,
      // Path 1 failed or not attempted; try Path 2
      bitcoin.opcodes.OP_ELSE,
      bitcoin.script.number.encode(lockTimePath2),
      bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
      bitcoin.opcodes.OP_DROP,
      // Attempt Path 2 Execution
      bitcoin.opcodes.OP_IF,
      // Path 2: Survivor Heir(s) (K-of-N, e.g., 1-of-N from Primary Heirs)
      bitcoin.script.number.encode(survivorM),
      ...primaryHeirPubkeys,
      bitcoin.script.number.encode(primaryHeirPubkeys.length),
      bitcoin.opcodes.OP_CHECKMULTISIG,
      // Path 2 failed or not attempted; try Path 3
      bitcoin.opcodes.OP_ELSE,
      bitcoin.script.number.encode(lockTimePath3),
      bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY,
      bitcoin.opcodes.OP_DROP,
      // Path 3: Ultimate Recovery (1-of-1 Signature: RecoveryAgent)
      recoveryPubkey,
      bitcoin.opcodes.OP_CHECKSIG,
      bitcoin.opcodes.OP_ENDIF,
      bitcoin.opcodes.OP_ENDIF,
    ];
    return compileScript(scriptElements);
  }

  /**
   * Derives the P2WSH address for an Aethelred witness script.
   * @param {Buffer} witnessScript The compiled Aethelred witness script.
   * @returns {string} The P2WSH address.
   */
  getAethelredP2WSHAddress(witnessScript) {
    const p2wsh = bitcoin.payments.p2wsh({
      redeem: { output: witnessScript, network: this.bitcoinJsNetwork },
      network: this.bitcoinJsNetwork,
    });
    if (!p2wsh.address) {
        throw new Error('Failed to generate P2WSH address. Ensure witness script and network are valid.');
    }
    return p2wsh.address;
  }
  
  async getBlockCount() {
    try {
      return await this.client.getBlockCount(); // Uses the command method internally
    } catch (error) {
      console.error('Error in getBlockCount (name):', error.name);
      console.error('Error in getBlockCount (message):', error.message);
      console.error('Error in getBlockCount (code):', error.code);
      console.error('Error in getBlockCount (stack):\n', error.stack);
      throw error;
    }
  }
  
  async getNewAddress() {
    try {
      const result = await this.client.getNewAddress('mining', 'legacy'); // Uses command
      console.log('Generated new address for mining:', result);
      return result;
    } catch (error) {
      console.error('Error in getNewAddress (name):', error.name);
      console.error('Error in getNewAddress (message):', error.message);
      console.error('Error in getNewAddress (code):', error.code);
      console.error('Error in getNewAddress (stack):\n', error.stack);
      throw error;
    }
  }
  
  async generateToAddress(blocks, address) {
    try {
      if (!address) {
        console.log('No address provided, generating new mining address...');
        address = await this.getNewAddress();
      }
      
      console.log(`Mining ${blocks} blocks to address ${address}`);
      const blockHashes = await this.client.generateToAddress(blocks, address); // Uses command
      console.log(`Successfully mined ${blockHashes.length} blocks`);
      return blockHashes;
    } catch (error) {
      console.error('Error in generateToAddress (name):', error.name);
      console.error('Error in generateToAddress (message):', error.message);
      console.error('Error in generateToAddress (code):', error.code);
      console.error('Error in generateToAddress (stack):\n', error.stack);
      throw error;
    }
  }
}

module.exports = { BitcoinClient, compileScript }; 