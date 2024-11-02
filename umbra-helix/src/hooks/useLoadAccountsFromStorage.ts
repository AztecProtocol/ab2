import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import { AccountWalletWithSecretKey, PXE } from '@aztec/aztec.js';
import { AztecAddress, deriveSigningKey, Fr } from '@aztec/circuits.js';
import { walletsAtom, currentWalletAtom, pxeAtom, nftContractAtom } from '../atoms.js';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';
import { ACCOUNTS_STORAGE_KEY, NFT_CONTRACT_KEY } from '../constants.js';
import { NFTContract } from '@aztec/noir-contracts.js';

export const useLoadAccountFromStorage = (pxeClient: PXE) => {
  const [accountInStorage] = useLocalStorage(ACCOUNTS_STORAGE_KEY, "")
  const [nftContractAddress] = useLocalStorage(NFT_CONTRACT_KEY,"")
  const setWallets = useSetAtom(walletsAtom);
  const setCurrentWallet = useSetAtom(currentWalletAtom);
  const setNFTContract = useSetAtom(nftContractAtom)
  console.log("Accounts in storage", accountInStorage)

  let localAccounts:any[] = []
  try {
    localAccounts = !!accountInStorage ? JSON.parse(accountInStorage) : [];
  } catch(err) {
    localAccounts = []
  }

  const load = async () => {
    if (!pxeClient) return;
    try {
      const registeredAccounts = await pxeClient.getRegisteredAccounts();
      const registeredAddresses = registeredAccounts.map(({ address }) => address.toString());
      console.log('Registered addresses', registeredAddresses);

      const walletsPromises = localAccounts.map(async ({ secretKey, salt, address }) => {
        const account = getSchnorrAccount(
          pxeClient,
          Fr.fromString(secretKey),
          deriveSigningKey(Fr.fromString(secretKey)),
          Fr.fromString(salt),
        );
        console.log('Storage account address', account.getAddress().toString(), address);

        const accountAddress = account.getAddress().toString();
        let wallet: AccountWalletWithSecretKey | null = null;
        if (registeredAddresses.includes(accountAddress)) {
          wallet = await account.getWallet();
        } else {
          try {
            wallet = await account.waitSetup();
          } catch (error) {
            console.error(error);
          }
        }
        if (wallet) return wallet;
        return null;
      });
      let wallets = (await Promise.all(walletsPromises)).filter(wallet => wallet !== null);
      setWallets(wallets);
      if (wallets.length > 0) {
        setCurrentWallet(wallets[0]);
        if(nftContractAddress) {
          try {
            const nft = await NFTContract.at(AztecAddress.fromString(nftContractAddress), wallets[0])
            setNFTContract(nft)
          } catch(error) {
          }
        }
      }

    } catch (err) {
      console.log('Failed to load aaccounts from storage', err);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return { loadAccounts: load };
};
