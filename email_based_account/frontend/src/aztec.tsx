import { createPXEClient, waitForPXE, Fr, Fq, PXE, AztecAddress } from '@aztec/aztec.js';
import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { TokenContract } from '@aztec/noir-contracts.js/Token';

let pxeInstance: PXE | null = null;

export async function getPXEClient(): Promise<PXE> {
  if (!pxeInstance) {
    pxeInstance = createPXEClient('http://localhost:8080');
    
    try {
      await waitForPXE(pxeInstance);
      console.log('PXE client initialized successfully');
    } catch (error) {
      console.error('Error initializing PXE client:', error);
      throw new Error('Failed to initialize PXE client');
    }
  }
  return pxeInstance;
}

export async function fetchAccount(encryptionKey: string, signingKey: string) {
  try {
    const pxe = await getPXEClient();
    
    // Convert the key strings to Fr and Fq types
    const encryptionPrivateKey = Fr.fromString(encryptionKey);
    const signingPrivateKey = Fq.fromString(signingKey);

    // Create a Schnorr account using both keys and a fixed salt value of 1
    const salt = 0; // This sets the salt to 1
    const account = await getSchnorrAccount(pxe, encryptionPrivateKey, signingPrivateKey, salt);
    const wallet = await account.getWallet();

    // Get the account address
    const address = wallet.getAddress();

    return {
      address: address.toString(),
      wallet: wallet
    };
  } catch (error) {
    console.error('Error fetching account:', error);
    throw new Error('Failed to fetch account');
  }
}

export async function createSchnorrAccount(): Promise<{ 
  address: string;
  encryptionSecretKey: string;
  signingSecretKey: string;
}> {
  try {
    const pxe = await getPXEClient();
    
    // Generate random keys
    const encryptionSecretKey = Fr.random();
    const signingSecretKey = Fq.random();
    
    // Create a new account with salt value of 1
    const salt = 0;
    const account = await getSchnorrAccount(pxe, encryptionSecretKey, signingSecretKey, salt);
    const wallet = await account.getWallet();
    console.log(wallet);

    return { 
      address: wallet.getAddress().toString(),
      encryptionSecretKey: encryptionSecretKey.toString(),
      signingSecretKey: signingSecretKey.toString()
    };
  } catch (error) {
    console.error('Error creating account:', error);
    throw new Error('Failed to create account');
  }
}