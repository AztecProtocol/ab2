
import { useState } from "react";

export const useAztec = () => {
  const [aliceWallet, setAliceWallet] = useState<any>(null);
  const [bobWallet, setBobWallet] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);  // this is jsut for planB. Alice & Bob's wallets are used currently

  const setupContract = async () => {
    console.log('setupContract start!!!');
    const { ProfileContract } = await import('../contracts/Profile'); // dynamic import
    const wallet = await createWalletWithDeployedTestAccounts();  // using Alice & Bob wallet is simpler than create a new wallet
    // const wallet = await getWallet();
    console.log('got a wallet: ', wallet);

    // Contract deployment
    const contract = await ProfileContract.deploy(wallet, 100, wallet.getAddress(), wallet.getAddress())
    .send()
    .deployed();

    setContract(contract);
    console.log(`Contract deployed at ${contract.address}`);
    console.log(`contract`, contract);
  }

  /**
   * TODO: Just using JSON.stringify doesn't fully store wallet (e.g. missing some wallet's functions). Not sure using local storage is the best way to save wallets. Find another way.
   * @param _wallet 
   * @returns 
   */
  const saveWallet = (_wallet: any) => {
    if (!_wallet) {
      console.log('no wallet info');
      return;
    }

    // LStorage.set('azt-wallet',  JSON.stringify(_wallet));
    console.log('wallet saved on Local Storage');
  }

  const dynamicallyLoadDependencies = async () => {
    const { Fr, GrumpkinScalar, Contract, createPXEClient } = await import('@aztec/aztec.js');
    const { getSchnorrAccount } = await import('@aztec/accounts/schnorr');
    const { getDeployedTestAccountsWallets } = await import('@aztec/accounts/testing');

    return {Fr, GrumpkinScalar, Contract, createPXEClient, getSchnorrAccount, getDeployedTestAccountsWallets}
  }

  /**
   * using 'getDeployedTestAccountsWallets', set Alice & Bob's wallet useful for testing 
   * @returns Alice wallet
   */
  const createWalletWithDeployedTestAccounts = async() => {
    console.log('createWalletWithDeployedTestAccounts run: ');
    const PXE_URL = process.env.PXE_URL || 'http://localhost:8080';

    const {createPXEClient, getDeployedTestAccountsWallets} = await dynamicallyLoadDependencies();

    const pxe = createPXEClient(PXE_URL);
    const { l1ChainId } = await pxe.getNodeInfo();
    console.log(`Connected to chain ${l1ChainId}`);
    console.log('pxe: ', pxe);

    const accounts = await getDeployedTestAccountsWallets(pxe);
    const aliceWallet = accounts[0];
    const bobWallet = accounts[1];
    const alice = aliceWallet.getAddress();
    const bob = bobWallet.getAddress();

    console.log(`Loaded alice's account at ${alice.toShortString()}`);
    console.log(`Loaded bob's account at ${bob.toShortString()}`);

    setAliceWallet(aliceWallet);
    setBobWallet(bobWallet);

    return aliceWallet;
  }

  /**
   * similar to createWalletWithDeployedTestAccounts() but create a new wallet
   * @returns newly created wallet
   */
  const createWallet = async () => {
    const PXE_URL = process.env.PXE_URL || 'http://localhost:8080';
    const {Fr, GrumpkinScalar, getSchnorrAccount, createPXEClient} = await dynamicallyLoadDependencies();
    
    // Create a wallet
    const secretKey = Fr?.random();
    const salt = Fr.ZERO;
    const signingPrivateKey = GrumpkinScalar.random();
    const pxe = createPXEClient(PXE_URL);
    const { l1ChainId } = await pxe.getNodeInfo();

    console.log(`Connected to chain ${l1ChainId}`);

    const newWallet = await getSchnorrAccount(pxe, secretKey, signingPrivateKey, salt).waitSetup();

    console.log(`New account deployed at ${newWallet.getAddress()}`);
    
    setWallet(newWallet);

    return newWallet;
  }

  const mintProfileNFT = async (birthdate: string) => {
    console.log('mintProfileNFT: fn:');
    console.log('birthdate: ', birthdate);
    console.log('contract', contract);
    console.log(aliceWallet);
    
    // const address = wallet.getAddress();
    const address = aliceWallet.getAddress();
    console.log('Alice address: ', address);
    
    const isUserAdult = isAdult(birthdate);
    console.log('is user adult?', isUserAdult);

    const randomeInt = Math.floor(Math.random() * 10000) + 1;
    const res = await contract.methods.mintNFT(address, randomeInt, isUserAdult).send().wait();
    
    console.log('mintProfileNFT res: ', res);

    return res;
  }

  const seeNFTInfo = async () => {
    console.log('Get NFT note: ');

    const address = aliceWallet.getAddress();
    const res = await contract.methods.get_profile_nfts(address, 0).simulate();
    
    console.log('NFT note result: ', res);
    return res;
  }

  const isAdult = (birthdateString: string): boolean => {
    const birthdate = new Date(birthdateString);
    const today = new Date();
    const adultDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    
    return birthdate <= adultDate;
  }

  return { setupContract, createWallet, mintProfileNFT, seeNFTInfo }
}
