import { atom } from 'jotai';
import { PXE, AccountWalletWithSecretKey } from '@aztec/aztec.js';
import { type TokenContract, PayTransactionFull } from './types.js'





// Existing PXE atom
export const pxeAtom = atom<PXE | null>(null);
export const walletsAtom = atom<AccountWalletWithSecretKey[]>([]);

// Current wallet atom
export const currentWalletAtom = atom<AccountWalletWithSecretKey | null>(null);
export const currentTokenContractAtom = atom<TokenContract | null>(null);
export const tokenContractsAtom = atom<TokenContract[]>([]);
export const publicBalanceAtom = atom<BigInt>(0n);
export const privateBalanceAtom = atom<BigInt>(0n);

export const payTransactionsAtom = atom<PayTransactionFull[]>([]);

export const isPrivateAtom = atom<boolean>(false);
export const rpcUrlAtom = atom<string>('');
export const remountKeyAtom = atom<number>(0);
