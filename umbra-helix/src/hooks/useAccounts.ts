import { getSchnorrAccount } from '@aztec/accounts/schnorr'
import {
  AccountWalletWithSecretKey,
  Fr,
  PXE,
} from '@aztec/aztec.js'
import { useAtom} from 'jotai'
import { walletsAtom, currentWalletAtom } from '../atoms.js'
import { ACCOUNTS_STORAGE_KEY} from '../constants.js'
import { NFTContract } from '../artifacts/NFT.js'
import { deriveSigningKey } from '@aztec/circuits.js'
import {toast} from 'react-hot-toast'
import {useLocalStorage} from 'react-use'
import { useState } from 'react'

export const useAccount = (pxeClient:PXE) => {
  const [accountInStorage, setAccountsInStorage ] = useLocalStorage(ACCOUNTS_STORAGE_KEY, "")
  const [isCreating, setIsCreating] = useState(false)
  const [wallets, setWallets] = useAtom(walletsAtom)
  const [currentWallet, setCurrentWallet] = useAtom(currentWalletAtom)

  let localAccounts:any[] = []
  try {
    localAccounts = !!accountInStorage ? JSON.parse(accountInStorage) :[];
  } catch(err) {
    localAccounts = []
  }
  const createAccount = async () => {
    const type = 'schnorr';
    try {
      setIsCreating(true)
      const secretKey = Fr.random();
      const signingPrivateKey = deriveSigningKey(secretKey);
      const account = getSchnorrAccount(pxeClient!, secretKey, signingPrivateKey);
      const wallet = await account.waitSetup();
      const salt = account.getInstance().salt;
      const { address } = account.getCompleteAddress();
      try {
        const accountData = {
          address,
          secretKey,
          salt,
          type,
        };
        console.log(accountData);

        const formattedData = {
          address: address.toString(),
          secretKey: secretKey.toString(),
          salt: salt.toString(),
          type,
        };

        console.log(formattedData);
        console.log("Local accounts", localAccounts)
        localAccounts = [formattedData, ...localAccounts]
        setAccountsInStorage(JSON.stringify(localAccounts))

      } catch (e) {
        console.error(e);
        toast.error(`Error saving account data ${e}`);
      }

      //TODO: Similarly fetch init hash and deployer
      // const deployedContract = await wallet.deploy()
      // console.log('Account created', wallet.getAddress().toShortString());
      setWallets([wallet,...wallets])
      if(!currentWallet) {
        setCurrentWallet(wallet)
      }
      return wallet;
    } catch (e) {
      console.error('Account error', e);
      toast.error(`Error creating account ${e}`);
      return null;
    } finally {
      setIsCreating(false)
    }
  };


  const deployNFTContract = async (
    admin: AccountWalletWithSecretKey,
    name: string,
    symbol: string
  ) => {
    const adminAddress = admin.getAddress()

    const deployedContract = await NFTContract.deploy(admin, adminAddress, name, symbol)
      .send()
      .deployed()

    const nft = await NFTContract.at(deployedContract.address, admin)
    return nft
  }

  return { createAccount,  deployNFTContract, isCreating}
}
