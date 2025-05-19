const bitcoin = require('bitcoinjs-lib');
const ecc = require('@bitcoinerlab/secp256k1');
const { ECPairFactory } = require('ecpair');
const { BitcoinClient } = require('../services/bitcoinClient'); // Adjust path as needed
const config = require('config');

bitcoin.initEccLib(ecc);
const ECPair = ECPairFactory(ecc);

// Helper to generate a random key pair and public key buffer
const generateRandomPubkey = () => ECPair.makeRandom({ network: bitcoin.networks.regtest }).publicKey;

describe('BitcoinClient - Aethelred Protocol', () => {
  let bitcoinClient;
  let regtestNetwork;

  beforeAll(() => {
    // Use a minimal config for testing, focusing on network selection
    // The RPC parts are not directly tested here, but network is needed for bitcoinjs-lib
    const testConfig = {
      network: 'regtest',
      // Mock RPC details if constructor strictly requires them, though not used for these tests
      host: '127.0.0.1', 
      port: 18443,
      user: 'testuser',
      pass: 'testpass'
    };
    bitcoinClient = new BitcoinClient(testConfig);
    regtestNetwork = bitcoin.networks.regtest;
  });

  describe('createAethelredWitnessScript', () => {
    let primaryHeirPubkeys;
    let recoveryPubkey;
    let lockTimePath2;
    let lockTimePath3;

    beforeEach(() => {
      primaryHeirPubkeys = [generateRandomPubkey(), generateRandomPubkey()];
      recoveryPubkey = generateRandomPubkey();
      lockTimePath2 = 100; // Example block height
      lockTimePath3 = 200; // Example block height
    });

    test('should create a valid witness script for 2 primary heirs and 1 recovery', () => {
      const witnessScript = bitcoinClient.createAethelredWitnessScript(
        primaryHeirPubkeys,
        recoveryPubkey,
        lockTimePath2,
        lockTimePath3
      );
      expect(witnessScript).toBeInstanceOf(Buffer);
      
      // Basic script structure verification (more detailed checks can be added)
      const decompiled = bitcoin.script.decompile(witnessScript);
      expect(decompiled[0]).toBe(bitcoin.opcodes.OP_IF); // Path 1 OP_IF
      // ... further assertions on decompiled script structure
      // For example, check presence of pubkeys and OP_CHECKMULTISIG, CLTV values, etc.
      // This part can be quite detailed. Let's start with a few key checks.
      expect(decompiled).toContainEqual(primaryHeirPubkeys[0]);
      expect(decompiled).toContainEqual(primaryHeirPubkeys[1]);
      expect(decompiled).toContainEqual(recoveryPubkey);
      expect(decompiled).toContain(bitcoin.opcodes.OP_CHECKMULTISIG);
      expect(decompiled).toContain(bitcoin.opcodes.OP_CHECKLOCKTIMEVERIFY);
      expect(decompiled).toContain(bitcoin.opcodes.OP_CHECKSIG);
      expect(decompiled).toContainEqual(bitcoin.script.number.encode(lockTimePath2));
      expect(decompiled).toContainEqual(bitcoin.script.number.encode(lockTimePath3));
    });

    test('should throw error if no primary heir pubkeys are provided', () => {
      expect(() => {
        bitcoinClient.createAethelredWitnessScript([], recoveryPubkey, lockTimePath2, lockTimePath3);
      }).toThrow('At least one primary heir public key is required.');
    });

    test('should throw error if recovery pubkey is not provided', () => {
      expect(() => {
        bitcoinClient.createAethelredWitnessScript(primaryHeirPubkeys, null, lockTimePath2, lockTimePath3);
      }).toThrow('Recovery public key is required.');
    });

    test('should throw error if lockTimePath3 is not greater than lockTimePath2', () => {
      expect(() => {
        bitcoinClient.createAethelredWitnessScript(primaryHeirPubkeys, recoveryPubkey, lockTimePath2, lockTimePath2); // lockTimePath3 === lockTimePath2
      }).toThrow('LockTime_Path3 must be strictly greater than LockTime_Path2.');
      expect(() => {
        bitcoinClient.createAethelredWitnessScript(primaryHeirPubkeys, recoveryPubkey, lockTimePath2, lockTimePath2 -1); // lockTimePath3 < lockTimePath2
      }).toThrow('LockTime_Path3 must be strictly greater than LockTime_Path2.');
    });
  });

  describe('getAethelredP2WSHAddress', () => {
    test('should generate a valid P2WSH address for regtest', () => {
      const heirPubkeys = [generateRandomPubkey()];
      const recovery = generateRandomPubkey();
      const witnessScript = bitcoinClient.createAethelredWitnessScript(heirPubkeys, recovery, 10, 20);
      const address = bitcoinClient.getAethelredP2WSHAddress(witnessScript);
      expect(typeof address).toBe('string');
      expect(address.startsWith('bcrt1q')).toBe(true);
    });

    test('should generate a valid P2WSH address for testnet', () => {
      const testnetConfig = { network: 'testnet', host: '127.0.0.1', port: 18332, user: 'testuser', pass: 'testpass' };
      const testnetClient = new BitcoinClient(testnetConfig);
      const heirPubkeys = [generateRandomPubkey()];
      const recovery = generateRandomPubkey();
      // Generate pubkeys using testnet network for consistency if ECPairFactory default matters here, though pubkey format is universal
      const testnetHeirPubkey = ECPair.makeRandom({ network: bitcoin.networks.testnet }).publicKey;
      const testnetRecoveryPubkey = ECPair.makeRandom({ network: bitcoin.networks.testnet }).publicKey;

      const witnessScript = testnetClient.createAethelredWitnessScript([testnetHeirPubkey], testnetRecoveryPubkey, 10, 20);
      const address = testnetClient.getAethelredP2WSHAddress(witnessScript);
      expect(typeof address).toBe('string');
      expect(address.startsWith('tb1q')).toBe(true);
    });

    test('should throw error for invalid witness script (e.g. empty buffer)', () => {
        const emptyScript = Buffer.from([]);
        // This relies on bitcoinjs-lib's internal validation within payments.p2wsh
        // It might throw a more specific error from bitcoinjs-lib, or our custom one if that doesn't catch it first.
        expect(() => {
            bitcoinClient.getAethelredP2WSHAddress(emptyScript);
        }).toThrow(); // General throw check, can be more specific if needed
    });
  });
}); 