/**
 * Test script to verify Bitcoin transaction functionality
 * Run with: node test-bitcoin-tx.js
 */

const { BitcoinClient } = require('./services/bitcoinClient');
const config = require('config');

async function testBitcoinFunctionality() {
  try {
    console.log('Initializing Bitcoin client...');
    const btcClient = new BitcoinClient(config.get('bitcoin.rpc'));
    
    // 1. Get current block count
    const blockCount = await btcClient.getBlockCount();
    console.log(`Current block count: ${blockCount}`);
    
    // 2. Generate a new address to receive funds
    const testAddress = await btcClient.getNewAddress();
    console.log(`Generated test address: ${testAddress}`);
    
    // 3. Send 1 BTC to the test address
    console.log(`Sending 1 BTC to test address...`);
    const txid = await btcClient.sendToAddress(testAddress, 1.0);
    console.log(`Transaction sent with ID: ${txid}`);
    
    // 4. Generate a block to confirm the transaction
    console.log(`Generating a block to confirm the transaction...`);
    const blockHashes = await btcClient.generateToAddress(1);
    console.log(`Block generated: ${blockHashes[0]}`);
    
    // 5. Get the raw transaction to verify it exists
    console.log(`Getting raw transaction details...`);
    const rawTx = await btcClient.getRawTransaction(txid);
    console.log(`Transaction hex: ${rawTx.substring(0, 50)}...`);
    
    console.log('\nAll Bitcoin functionality tests passed successfully!');
    console.log('Your Polar Bitcoin node is correctly configured and accessible.');
    
    return {
      success: true,
      blockCount,
      testAddress,
      txid,
      blockHash: blockHashes[0]
    };
  } catch (error) {
    console.error('Error testing Bitcoin functionality:');
    console.error(error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
testBitcoinFunctionality()
  .then(result => {
    if (result.success) {
      console.log('\nSUCCESS: Bitcoin functionality is working correctly');
    } else {
      console.error('\nFAILED: Bitcoin functionality test failed');
    }
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  }); 