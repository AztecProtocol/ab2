import { getSchnorrAccount } from '@aztec/accounts/schnorr';
import {
  AztecAddress,
  CheatCodes,
  Fr,
  GrumpkinScalar,
  computeSecretHash,
  createPXEClient,
  waitForPXE,
} from '@aztec/aztec.js';
import { type CompiledCircuit } from '@noir-lang/backend_barretenberg';
import { useQuery } from '@tanstack/react-query';
import { waitForTransactionReceipt } from '@wagmi/core';
import { useGoogleAuth } from '@zk-email/zk-email-sdk';
import { useLocalStorage } from 'usehooks-ts';
import { toHex } from 'viem';
import { useWriteContract } from 'wagmi';
import { Service } from '~/types';

import KYCAgeCircuit from '../../../assets/public/kyc_age_verify.json';
import {
  type WithBodyParams,
  type WithToParams,
  extractXUsername,
  generateInputs,
  getBalanceModule,
  getBiometricModule,
  getENSModule,
  getEmail,
  getGitHubModule,
  getGoogleModule,
  getLinkedinModule,
  getPassport,
  getVerifiableCredentialModule,
  getXModule,
} from '../helpers';
import { Prover, generateJWTInputs } from '../jwt';
import { mockEnsConfig, passportConfig, wagmiConfig } from '../viem';
import { useAztecAccount } from './use-aztec-account';

export const usePassport = () => {
  const { wallet, getWallet } = useAztecAccount();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- safe
  const { googleAuthToken, loggedInGmail } = useGoogleAuth();
  const { writeContractAsync } = useWriteContract();

  const [credential, setCredential] = useLocalStorage<{
    jwt: string;
    secret_key: string;
  } | null>('kyc-credential', null);

  const { data: passportScore, refetch: refetchPassportScore } = useQuery({
    queryKey: ['passport-score', wallet?.getAddress().toString()],
    queryFn: async () => {
      const score = await getPassportScore();
      return score;
    },
    enabled: Boolean(wallet),
    initialData: 0,
  });

  const { data: verifiedServices, refetch: refetchVerifiedServices } = useQuery(
    {
      queryKey: ['verified-services', wallet?.getAddress().toString()],
      queryFn: async () => {
        const services = await getVerifiedServices();
        return services;
      },
      enabled: Boolean(wallet),
      initialData: [],
    }
  );

  const getPassportScore = async () => {
    const w = await getWallet();
    const passport = await getPassport(w);
    const score = (await passport.methods
      .get_total_score(w.getCompleteAddress())
      .simulate()) as bigint;

    const formatted = Number(score) / 10 ** 6;
    return formatted;
  };

  const getService = (address: string) => {
    if (address === import.meta.env.VITE_X_MODULE_ADDRESS) {
      return 'x';
    } else if (address === import.meta.env.VITE_GITHUB_MODULE_ADDRESS) {
      return 'github';
    } else if (address === import.meta.env.VITE_GOOGLE_MODULE_ADDRESS) {
      return 'google';
    } else if (address === import.meta.env.VITE_LINKEDIN_MODULE_ADDRESS) {
      return 'linkedin';
    } else if (address === import.meta.env.VITE_BIOMETRIC_MODULE_ADDRESS) {
      return 'biometric';
    } else if (address === import.meta.env.VITE_BALANCE_MODULE_ADDRESS) {
      return 'balance';
    } else if (address === import.meta.env.VITE_ENS_MODULE_ADDRESS) {
      return 'ens';
    }
    return 'vc';
  };

  const refetchAll = async () => {
    await refetchPassportScore();
    await refetchVerifiedServices();
  };

  const getVerifiedServices = async () => {
    const w = await getWallet();
    const passport = await getPassport(w);
    const services = (await passport.methods
      .get_all_verified(w.getCompleteAddress())
      .simulate()) as {
      address: AztecAddress;
      base_score: bigint;
      max_score: bigint;
      weight: bigint;
    }[];

    const verifiedServices: Service[] = services
      .filter((s) => s.address.toString() !== AztecAddress.ZERO.toString())
      .map((s) => ({
        service: getService(s.address.toString()),
        address: s.address.toString(),
        weight: Number(s.weight) / 10 ** 6,
        maxScore: Number(s.max_score) / 10 ** 6,
        baseScore: Number(s.base_score) / 10 ** 6,
      }));

    return verifiedServices;
  };

  const verifyGithub = async () => {
    if (!googleAuthToken) {
      throw new Error('Log in with Google to access Emails.');
    }
    const w = await getWallet();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
    const accessToken = googleAuthToken?.access_token as string;
    const emailContent = await getEmail(accessToken, 'github');
    const i = (await generateInputs(
      w.getAddress().toString(),
      emailContent,
      'github',
      loggedInGmail ?? ''
    )) as WithToParams;

    const githubModule = await getGitHubModule(w);
    const tx = await githubModule
      .withWallet(w)
      .methods.verify(
        i.address,
        i.header_array,
        i.header_length,
        i.pubkey_modulus,
        i.pubkey_redc,
        i.signature,
        i.from_header_sequence_index,
        i.from_header_sequence_length,
        i.from_address_sequence_index,
        i.from_address_sequence_length,
        i.to_header_sequence_index,
        i.to_header_sequence_length,
        i.to_address_sequence_index,
        i.to_address_sequence_length,
        i.email_array
      )
      .send()
      .wait();

    await refetchAll();

    return tx;
  };

  const verifyGoogle = async () => {
    if (!googleAuthToken) {
      throw new Error('Log in with Google to access Emails.');
    }
    const w = await getWallet();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
    const accessToken = googleAuthToken?.access_token as string;
    const emailContent = await getEmail(accessToken, 'google');
    const i = (await generateInputs(
      w.getAddress().toString(),
      emailContent,
      'google',
      loggedInGmail ?? ''
    )) as WithToParams;

    const module = await getGoogleModule(w);
    const tx = await module
      .withWallet(w)
      .methods.verify(
        i.address,
        i.header_array,
        i.header_length,
        i.pubkey_modulus,
        i.pubkey_redc,
        i.signature,
        i.from_header_sequence_index,
        i.from_header_sequence_length,
        i.from_address_sequence_index,
        i.from_address_sequence_length,
        i.to_header_sequence_index,
        i.to_header_sequence_length,
        i.to_address_sequence_index,
        i.to_address_sequence_length,
        i.email_array
      )
      .send()
      .wait();

    await refetchAll();

    return tx;
  };

  const verifyLinkedin = async () => {
    if (!googleAuthToken) {
      throw new Error('Log in with Google to access Emails.');
    }
    const w = await getWallet();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
    const accessToken = googleAuthToken?.access_token as string;
    const emailContent = await getEmail(accessToken, 'linkedin');
    const i = (await generateInputs(
      w.getAddress().toString(),
      emailContent,
      'linkedin',
      loggedInGmail ?? ''
    )) as WithToParams;

    const module = await getLinkedinModule(w);
    const tx = await module
      .withWallet(w)
      .methods.verify(
        i.address,
        i.header_array,
        i.header_length,
        i.pubkey_modulus,
        i.pubkey_redc,
        i.signature,
        i.from_header_sequence_index,
        i.from_header_sequence_length,
        i.from_address_sequence_index,
        i.from_address_sequence_length,
        i.to_header_sequence_index,
        i.to_header_sequence_length,
        i.to_address_sequence_index,
        i.to_address_sequence_length,
        i.email_array
      )
      .send()
      .wait();

    await refetchAll();

    return tx;
  };

  const verifyTwitter = async () => {
    if (!googleAuthToken) {
      throw new Error('Log in with Google to access Emails.');
    }
    const w = await getWallet();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- safe
    const accessToken = googleAuthToken?.access_token as string;
    const emailContent = await getEmail(accessToken, 'x');
    const username = extractXUsername(emailContent);

    const i = (await generateInputs(
      w.getAddress().toString(),
      emailContent,
      'x',
      username
    )) as WithBodyParams;

    const module = await getXModule(w);
    const tx = await module
      .withWallet(w)
      .methods.verify(
        i.address,
        i.header_array,
        i.header_length,
        i.body_array,
        i.body_length,
        i.pubkey_modulus,
        i.pubkey_redc,
        i.signature,
        i.body_hash_index,
        i.dkim_header_sequence_index,
        i.dkim_header_sequence_length,
        i.from_header_sequence_index,
        i.from_header_sequence_length,
        i.from_address_sequence_index,
        i.from_address_sequence_length,
        i.username,
        BigInt(username.length)
      )
      .send()
      .wait();

    await refetchAll();

    return tx;
  };

  const verifyBiometric = async (actual: number[], expected: number[]) => {
    const w = await getWallet();

    const module = await getBiometricModule(w);
    const tx = await module
      .withWallet(w)
      .methods.verify(w.getAddress(), actual, expected)
      .send()
      .wait();

    await refetchAll();

    return tx;
  };

  const mineBlock = async () => {
    const PXE_URL = import.meta.env.VITE_PXE_URL;
    const pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe);

    const cheats = await CheatCodes.create('http://localhost:8545', pxe);
    const currentBlock = await cheats.aztec.blockNumber();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-constant-condition -- safe
    while (true) {
      const secretKey = Fr.random();
      const signingPrivateKey = GrumpkinScalar.random();
      await getSchnorrAccount(pxe, secretKey, signingPrivateKey).waitSetup();
      const newBlock = await cheats.aztec.blockNumber();
      console.log({
        prev: currentBlock,
        new: newBlock,
      });
      if (newBlock > currentBlock + 3) {
        break;
      }
    }
  };

  const verifyBalance = async () => {
    const w = await getWallet();
    const secret = Fr.fromString('0x123456');
    const secretHash = computeSecretHash(secret).toString();

    const l1TxHash = await writeContractAsync({
      ...passportConfig,
      functionName: 'verifyBalance',
      args: [
        secretHash,
        import.meta.env.VITE_BALANCE_MODULE_ADDRESS as `0x${string}`,
      ],
    });

    await waitForTransactionReceipt(wagmiConfig, { hash: l1TxHash });

    await mineBlock();

    const module = await getBalanceModule(w);

    const tx = await module
      .withWallet(w)
      .methods.verify(w.getAddress(), 1, secret)
      .send()
      .wait();

    await refetchAll();

    return tx;
  };

  const verifyENS = async (name: string) => {
    const w = await getWallet();
    const secret = Fr.fromString('0x123456');
    const secretHash = computeSecretHash(secret).toString();

    // MINT ENS
    const ensMintHash = await writeContractAsync({
      ...mockEnsConfig,
      functionName: 'register',
      args: [toHex(name)],
    });
    await waitForTransactionReceipt(wagmiConfig, { hash: ensMintHash });

    const l1TxHash = await writeContractAsync({
      ...passportConfig,
      functionName: 'verifyENS',
      args: [
        secretHash,
        import.meta.env.VITE_ENS_MODULE_ADDRESS as `0x${string}`,
      ],
    });

    await waitForTransactionReceipt(wagmiConfig, { hash: l1TxHash });

    await mineBlock();

    const module = await getENSModule(w);

    const tx = await module
      .withWallet(w)
      .methods.verify(w.getAddress(), 1, secret)
      .send()
      .wait();

    await refetchAll();

    return tx;
  };

  const verifyJWT = async () => {
    if (!credential) {
      throw new Error('Unable to find Age Credential.');
    }

    const prover = new Prover(KYCAgeCircuit as CompiledCircuit, 'plonk');
    const inputs = generateJWTInputs(credential.jwt, credential.secret_key);

    const res = await prover.fullProve(inputs, 'plonk');
    const proof = toHex(res.proof);

    const w = await getWallet();
    const secret = Fr.fromString('0x123456');
    const secretHash = computeSecretHash(secret).toString();

    // MINT ENS
    const hash = await writeContractAsync({
      ...passportConfig,
      functionName: 'verifyAge',
      args: [
        proof,
        secretHash,
        import.meta.env
          .VITE_VERIFIABLE_CREDENTIAL_MODULE_ADDRESS as `0x${string}`,
      ],
    });
    await waitForTransactionReceipt(wagmiConfig, { hash });

    await mineBlock();

    const module = await getVerifiableCredentialModule(w);

    const tx = await module
      .withWallet(w)
      .methods.verify(w.getAddress(), 1, secret)
      .send()
      .wait();

    await refetchAll();

    return tx;
  };

  return {
    passportScore,
    verifiedServices,
    refetchAll,
    getPassportScore,
    verifyGithub,
    verifyGoogle,
    verifyLinkedin,
    verifyTwitter,
    verifyBiometric,
    getVerifiedServices,
    verifyBalance,
    verifyENS,
    credential,
    setCredential,
    verifyJWT,
  };
};
