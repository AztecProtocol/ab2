'use client';

import { getSchnorrAccount, getSchnorrWallet } from '@aztec/accounts/schnorr';
import {
  AztecAddress,
  Fr,
  GrumpkinScalar,
  createPXEClient,
} from '@aztec/aztec.js';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useLocalStorage } from 'usehooks-ts';

import { errorHandler } from '../utils';

export const useAztecAccount = () => {
  const [account, setAccount] = useLocalStorage<{
    secretKey: string;
    signingPrivateKey: string;
    address: string;
  } | null>('aztec-account', null);

  const { data: wallet, refetch } = useQuery({
    queryKey: ['aztec-wallet'],
    enabled: Boolean(account),
    queryFn: async () => {
      if (account) {
        const PXE_URL = import.meta.env.VITE_PXE_URL;
        const pxe = createPXEClient(PXE_URL);
        return await getSchnorrWallet(
          pxe,
          AztecAddress.fromString(account.address),
          GrumpkinScalar.fromString(account.signingPrivateKey)
        );
      }
    },
  });

  const login = async () => {
    await refetch();
  };

  const createAccount = async () => {
    const id = toast.loading('Creating Account...');
    try {
      const PXE_URL = import.meta.env.VITE_PXE_URL;
      const secretKey = Fr.random();
      secretKey.toString();
      const signingPrivateKey = GrumpkinScalar.random();

      console.log({
        secretKey,
        signingPrivateKey,
      });
      const pxe = createPXEClient(PXE_URL);

      const wallet = await getSchnorrAccount(
        pxe,
        secretKey,
        signingPrivateKey
      ).waitSetup();
      const address = wallet.getAddress();

      setAccount({
        secretKey: secretKey.toString(),
        signingPrivateKey: signingPrivateKey.toString(),
        address: address.toString(),
      });

      toast.success('Account Created Successfully!', { id });
      await refetch();

      return wallet;
    } catch (error) {
      console.log(error);
      toast.error(errorHandler(error), { id });
    }
  };
  return { createAccount, wallet, isLoggedIn: Boolean(wallet), login };
};
