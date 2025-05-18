const Client = require('bitcoin-core');

class BitcoinClient {
  constructor(config) {
    // Log the received config to debug its actual runtime values
    console.log('BitcoinClient constructor received config:', JSON.stringify(config, null, 2));

    const hostOnly = (config.host || '127.0.0.1').replace(/\/$/, '');
    const port = config.port || 18443;
    const user = config.user || 'polaruser';
    const pass = config.pass || 'polarpass';
    const network = config.network || 'regtest'; // network is not directly used by bitcoin-core 2.x constructor but good to have

    // For bitcoin-core 2.x.x, the 'host' parameter is the full base URL.
    const rpcFullUrl = `http://${user}:${pass}@${hostOnly}:${port}`;

    this.client = new Client({
      host: rpcFullUrl, // This is the full base URL for RPC calls
      timeout: config.timeout || 30000, // Optional: set a timeout
      // username, password, port are now part of the rpcFullUrl for bitcoin-core 2.x
      // Other options like 'wallet' or specific 'headers' could be added if needed.
    });
    
    console.log(`Initialized Bitcoin client (network: ${network}) using RPC URL: ${rpcFullUrl}`);
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

module.exports = { BitcoinClient }; 