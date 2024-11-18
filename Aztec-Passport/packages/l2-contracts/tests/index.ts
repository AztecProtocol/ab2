const PXE_URL = 'http://localhost:8080';

import {
  CheatCodes,
  createPXEClient,
  FieldsOf,
  TxReceipt,
  waitForPXE,
} from '@aztec/aztec.js';
import {
  AztecPassportContract,
  AztecPassportContractArtifact,
} from '../generated/AztecPassport';
import { XModuleContract, XModuleContractArtifact } from '../generated/XModule';

import { getDeployedTestAccountsWallets } from '@aztec/accounts/testing';

const pxe = createPXEClient(PXE_URL);
await waitForPXE(pxe);

const [ownerWallet, user1Wallet, user2Wallet] =
  await getDeployedTestAccountsWallets(pxe);

const ownerAddress = ownerWallet.getCompleteAddress();
const user1Address = user1Wallet.getCompleteAddress();
const user2Address = user2Wallet.getCompleteAddress();

const passport = await AztecPassportContract.deploy(ownerWallet, ownerAddress)
  .send()
  .deployed();

const xModule = await XModuleContract.deploy(ownerWallet, ownerAddress)
  .send()
  .deployed();

const xModule2 = await XModuleContract.deploy(ownerWallet, ownerAddress)
  .send()
  .deployed();

const passportAddress = passport.address;
const xModuleAddress = xModule.address;
const xModule2Address = xModule2.address;

console.log('Passport address:', passportAddress);
console.log('XModule address:', xModuleAddress);
console.log('XModule2 address:', xModule2Address);

let tx: FieldsOf<TxReceipt>;
let res;

// Set Passport for XModule
tx = await xModule
  .withWallet(ownerWallet)
  .methods.set_passport_address(passportAddress)
  .send()
  .wait();
tx = await xModule2
  .withWallet(ownerWallet)
  .methods.set_passport_address(passportAddress)
  .send()
  .wait();

console.log('Set Passport for XModule:', tx.txHash.to0xString());

// Add xModule to Whitelist
tx = await passport
  .withWallet(ownerWallet)
  .methods.add_service(xModuleAddress, 100000, 2000000, 10000000)
  .send()
  .wait();
tx = await passport
  .withWallet(ownerWallet)
  .methods.add_service(xModule2Address, 200000, 4000000, 10000000)
  .send()
  .wait();

console.log('Add xModule to Whitelist:', tx.txHash.to0xString());

// Get Current Length of Modules
res = await passport
  .withWallet(ownerWallet)
  .methods.get_total_services()
  .simulate();

console.log('Current Length of Services:', res);

res = await passport
  .withWallet(ownerWallet)
  .methods.get_service_index(xModuleAddress)
  .simulate();

console.log('X Module Index: ', res);
// res = await passport
//   .withWallet(ownerWallet)
//   .methods.get_service_index(xModule2Address)
//   .simulate();

// console.log('X Module 2 Index: ', res);

tx = await xModule
  .withWallet(user1Wallet)
  .methods.verify(user1Address)
  .send()
  .wait();

console.log('Verify Service for User 1:', tx.txHash.to0xString());

res = await passport
  .withWallet(user1Wallet)
  .methods.is_verified(user1Address, 0)
  .simulate();

console.log('Is User 1 Verified:', res);

res = await passport
  .withWallet(user1Wallet)
  .methods.get_total_score(user1Address)
  .simulate();

console.log('Score Viewed from User 1: ', res);

res = await passport
  .withWallet(user2Wallet)
  .methods.get_total_score(user1Address)
  .simulate();

console.log('Score Viewed from User 2: ', res);
