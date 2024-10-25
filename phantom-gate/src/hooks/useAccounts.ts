import { getSchnorrAccount } from '@aztec/accounts/schnorr'
import {
  AccountManager,
  AccountWalletWithSecretKey,
  Contract,
  createPXEClient,
  Fr,
  GrumpkinScalar, waitForPXE
} from '@aztec/aztec.js'

import { TokenContract, TokenContractArtifact, } from '@aztec/noir-contracts.js'
import { RPC_URL } from '../constants.js'
import { getPXEClient } from '../helpers/setup.js'
import { SchnorrAccountContract } from '../helpers/AccountContract.js'
import {NFTContract,NFTContractArtifact} from "@aztec/noir-contracts.js"
// import NFtcontract

export const useAccount = () => {// const pxe = useAtomValue(pxeAtom)
  const createAccount = async () => {
    try {
      const pxeClient = createPXEClient(RPC_URL)
      await waitForPXE(pxeClient)
      const secretKey = Fr.random()
      const signingPrivateKey = GrumpkinScalar.random()
      const wallet = await getSchnorrAccount(pxeClient!, secretKey, signingPrivateKey).waitSetup()
      // const deployedContract = await wallet.deploy()
      console.log('Account created', wallet.getAddress().toShortString())
      return wallet
    } catch (e) {
      console.error('Account error', e)
      return null
    }
  }

  const deployToken = async (owner: AccountWalletWithSecretKey) => {
    const ownerAddress = owner.getAddress()
    const deployedContract = await TokenContract.deploy(owner, ownerAddress, 'TokenName', 'TKN', 18)
      .send()
      .deployed()

    const token = await Contract.at(deployedContract.address, TokenContractArtifact, owner)
    return token
  }

  const createCustomAccount = async () => {
    try {
      const secretKey = Fr.random();
      // const signingPrivateKey = Buffer.from('private key','hex');
      const pxe = await getPXEClient();

      const account = new AccountManager(pxe, secretKey, new SchnorrAccountContract(GrumpkinScalar.random()));
      const wallet = await account.waitSetup();
      const address = wallet.getCompleteAddress().address;

      console.log(`Account created at ${address}`);
      return wallet
    }
    catch (e) {
      console.error('Counter error', e)
    }
    return 
  }
  const deployNFtToken = async (owner: AccountWalletWithSecretKey) => {
    const ownerAddress = owner.getAddress()
    const deployedContract = await NFTContract.deploy(owner, ownerAddress, 'Phantom', 'PHG')
      .send()
      .deployed()
  
    const nftToken = await Contract.at(deployedContract.address, NFTContractArtifact, owner)
    return nftToken
  }

  return { createAccount, deployToken, createCustomAccount, deployNFtToken }
}

