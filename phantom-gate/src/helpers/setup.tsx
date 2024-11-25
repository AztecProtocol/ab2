import {
  Fr, waitForPXE, createPXEClient, GrumpkinScalar,
  Contract,
  computeSecretHash
} from '@aztec/aztec.js'
import { getDeployedTestAccountsWallets } from '@aztec/accounts/testing'
import { getSchnorrAccount } from '@aztec/accounts/schnorr'

import { CounterContract } from '../artifacts/Counter.js'
import { TokenContract, TokenContractArtifact } from '@aztec/noir-contracts.js'

const PXE_URL = 'http://localhost:8080'

export const getPXEClient = async () => {
  const pxe = createPXEClient(PXE_URL)
  await waitForPXE(pxe)
  return pxe
}

try {
  console.log(process.env)
  let pxe = await getPXEClient()
  let accounts = await pxe.getRegisteredAccounts()
  console.log(accounts)
  //let number = await pxe.getBlockNumber()
  console.log(await pxe.getBlockNumber())
} catch (e) {
  console.log(e)
}

export async function interactWithCounter() {
  try {
    const pxe = await getPXEClient()
    await waitForPXE(pxe)
    const nodeInfo = await pxe.getNodeInfo()
    console.log('Aztec sandbox info 43', nodeInfo)
    const accounts = await getDeployedTestAccountsWallets(pxe)
    console.log('Accounts', accounts)
    const aliceWallet = accounts[0]
    const bobWallet = accounts[1]
    const alice = aliceWallet.getAddress()
    const bob = bobWallet.getAddress()
    console.log(`Loaded alice's account at ${alice.toShortString()}`)
    console.log(`Loaded bob's account at ${bob.toShortString()}`)
    const contract = await CounterContract.deploy(bobWallet).send().deployed()
    console.log(`Contract successfully deployed at address ${contract.address.toShortString()}`)
    const counterContractbob = await CounterContract.at(contract.address, bobWallet)
    await counterContractbob.methods.increment(bob, bob).send().wait()
    await counterContractbob.methods.increment(bob, bob).send().wait()
    await counterContractbob.methods.increment(bob, bob).send().wait()
    await counterContractbob.methods.increment(bob, bob).send().wait()
    await counterContractbob.methods.increment(bob, bob).send().wait()
    await counterContractbob.methods.increment(bob, bob).send().wait()
    const bobValue = await counterContractbob.methods.get_counter(bob).simulate()
    console.log(`Bob's new counter ${bobValue}`)
  } catch (e) {
    console.error('Counter error', e)
  }
}

// async function deployContract() {}

export async function createAccount() {
  try{
    const secretKey = Fr.random();
    const signingPrivateKey = GrumpkinScalar.random();
    const pxe = createPXEClient(PXE_URL);
    const wallet = await getSchnorrAccount(pxe, secretKey, signingPrivateKey).waitSetup();
    console.log('Account created', wallet.getAddress().toShortString());
    const deployedContract = await TokenContract.deploy(
      wallet, // wallet instance
      wallet.getAddress(), // account
      'TokenName', // constructor arg1
      'TokenSymbol', // constructor arg2
      18,
    )
      .send()
      .deployed();
    
    const contract = await Contract.at(deployedContract.address, TokenContractArtifact, wallet);
    console.log('Contract deployed', contract.address.toShortString(), contract.address.toString());

    const previouseMint = await contract.methods.balance_of_public('0x06769c994821ec652de929077fcdb0acf41a748d276ad1bfc97fa86e0837fa17').simulate();
      const previousMint2 = await contract.methods.balance_of_private('0x06769c994821ec652de929077fcdb0acf41a748d276ad1bfc97fa86e0837fa17').simulate();
    console.log(`Balance of ${wallet.getAddress()}: ${previouseMint}`, previousMint2);

    const balance = await contract.methods.balance_of_public(wallet.getAddress()).simulate();
    const balance1 = await contract.methods.balance_of_private(wallet.getAddress()).simulate();
    console.log(`Balance of ${wallet.getAddress()}: ${balance}`, balance1);
    
    const secretHash = computeSecretHash(secretKey);
      const receipt = await contract.methods.mint_private(BigInt(100), secretHash).send().wait();
      const receiptPublic = await contract.methods.mint_public(wallet.getAddress(),BigInt(100)).send().wait();
      console.log(`Successfully minted ${100} tokens. Transaction hash: ${receipt.txHash}, receiptPublic: ${receiptPublic.txHash}`);
      const balanceMint = await contract.methods.balance_of_public(wallet.getAddress()).simulate();
      const balanceMint1 = await contract.methods.balance_of_private(wallet.getAddress()).simulate();
      console.log(`Balance of ${wallet.getAddress()}: ${balanceMint}`, balanceMint1);

  }
 catch(e){
    console.error('Account error', e)
 }
}

export async function mintToken() {
  try{
    console.log('minting token');
    const pxe = await getPXEClient()
    await waitForPXE(pxe)


    const account = await createAccount();
  console.log('New account created:', account);
    const accounts = await getDeployedTestAccountsWallets(pxe)
    console.log('Accounts', accounts)
    const aliceWallet = accounts[0]
    const bobWallet = accounts[1]
    const alice = aliceWallet.getAddress()
    const bob = bobWallet.getAddress()
    console.log(`Loaded alice's account at ${alice.toShortString()}`)
    console.log(`Loaded bob's account at ${bob.toShortString()}`)
    const contract = await CounterContract.deploy(bobWallet).send().deployed()
    console.log(`Contract successfully deployed at address ${contract.address.toShortString()}`)

    const tx =await contract.methods.claim_public(alice, 100,0,1).send().wait();
      // await tx.wait();
    console.log('Token minted', tx.getTxHash());
  }
  catch(e){
    console.error('Mint error', e)
  }
}