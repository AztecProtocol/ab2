/* eslint-disable @typescript-eslint/no-extra-non-null-assertion -- safe */

/* eslint-disable @typescript-eslint/no-non-null-assertion -- safe */
import { AztecAddress, type Wallet } from '@aztec/aztec.js';
import { fetchEmailList, fetchEmailsRaw } from '@zk-email/zk-email-sdk';
import {
  AztecPassportContract,
  BalanceModuleContract,
  ENSModuleContract,
  GitHubModuleContract,
  GoogleModuleContract,
  LinkedinModuleContract,
  VerifiableCredentialModuleContract,
  XModuleContract,
} from '~/generated';

import { generateEmailVerifierInputs } from './zkemail';
import { getXUsername, padEmail } from './zkemail/utils';

export const getTransforms = (isLeftSide: boolean, index: number) => {
  if (isLeftSide) {
    if (index % 2 === 1) {
      return {
        translateZ: `${String(5 * index)}px`,
        rotateY: '-180deg',
        scaleX: 1,
        translateX: '0%',
      };
    }
    return {
      translateZ: `${String(5 * index)}px`,
      rotateY: '180deg',
      scaleX: -1,
      translateX: '-100%',
    };
  }

  if (index % 2 === 1) {
    return {
      translateZ: `${String(-5 * index)}px`,
      rotateY: '0deg',
      scaleX: 1,
      translateX: '0%',
    };
  }
  return {
    translateZ: `${String(-5 * index)}px`,
    rotateY: '0deg',
    scaleX: -1,
    translateX: '-100%',
  };
};

export const getPassport = async (wallet: Wallet) => {
  const passport = await AztecPassportContract.at(
    AztecAddress.fromString(import.meta.env.VITE_PASSPORT_ADDRESS),
    wallet
  );

  return passport;
};

export const getXModule = async (wallet: Wallet) => {
  const xModule = await XModuleContract.at(
    AztecAddress.fromString(import.meta.env.VITE_X_MODULE_ADDRESS),
    wallet
  );

  return xModule;
};

export const getGitHubModule = async (wallet: Wallet) => {
  const githubModule = await GitHubModuleContract.at(
    AztecAddress.fromString(import.meta.env.VITE_GITHUB_MODULE_ADDRESS),
    wallet
  );

  return githubModule;
};

export const getGoogleModule = async (wallet: Wallet) => {
  const googleModule = await GoogleModuleContract.at(
    AztecAddress.fromString(import.meta.env.VITE_GOOGLE_MODULE_ADDRESS),
    wallet
  );

  return googleModule;
};

export const getLinkedinModule = async (wallet: Wallet) => {
  const linkedinModule = await LinkedinModuleContract.at(
    AztecAddress.fromString(import.meta.env.VITE_LINKEDIN_MODULE_ADDRESS),
    wallet
  );

  return linkedinModule;
};

export const getVerifiableCredentialModule = async (wallet: Wallet) => {
  const verifiableCredentialModule =
    await VerifiableCredentialModuleContract.at(
      AztecAddress.fromString(
        import.meta.env.VITE_VERIFIABLE_CREDENTIAL_MODULE_ADDRESS
      ),
      wallet
    );

  return verifiableCredentialModule;
};

export const getENsModule = async (wallet: Wallet) => {
  const ensModule = await ENSModuleContract.at(
    AztecAddress.fromString(import.meta.env.VITE_ENS_MODULE_ADDRESS),
    wallet
  );

  return ensModule;
};

export const getBalanceModule = async (wallet: Wallet) => {
  const balanceModule = await BalanceModuleContract.at(
    AztecAddress.fromString(import.meta.env.VITE_BALANCE_MODULE_ADDRESS),
    wallet
  );

  return balanceModule;
};

const QUERY = {
  github: `from:noreply@github.com [GitHub] Please reset your password`,
  x: 'from:info@x.com Reset your password?',
  linkedin:
    'from:security-noreply@linkedin.com Enter this code to complete the reset.',
  google:
    'from:no-reply@accounts.google.com Aztec Passport was granted access to your Google Account',
};
type Service = 'github' | 'x' | 'linkedin' | 'google';
export const getEmail = async (accessToken: string, service: Service) => {
  const query = QUERY[service];
  const emailList = await fetchEmailList(accessToken, {
    maxResults: 1,
    q: query,
  });

  if (!emailList.messages[0]) {
    throw new Error(`No ${service} email found`);
  }

  const email = await fetchEmailsRaw(accessToken, [emailList.messages[0].id]);

  if (!email[0]) {
    throw new Error('Unable to fetch Email');
  }

  return email[0].decodedContents;
};

export const extractXUsername = (email: string): string => {
  // email contains the follwing
  // If you requested a password reset for @dummy_testing_, use the confirmation code below to complete the process. If you didn't make this request, ignore this email.
  // extract username which is after If you requested a password reset for and till ,

  const usernameRegex = /(?<=If you requested a password reset for )\w+(?=,)/i;
  const match = usernameRegex.exec(email);
  if (!match?.at(0)) {
    throw new Error('Username not found');
  }

  return match.at(0) ?? '';
};

const inputParams = {
  x: { maxHeadersLength: 576, maxBodyLength: 16384, extractFrom: true },
  google: {
    maxHeadersLength: 576,
    maxBodyLength: 16384,
    extractFrom: true,
    extractTo: true,
  },
  linkedin: {
    maxHeadersLength: 768,
    maxBodyLength: 49152,
    extractFrom: true,
    extractTo: true,
  },
  github: {
    maxHeadersLength: 576,
    maxBodyLength: 49152,
    extractFrom: true,
    extractTo: true,
  },
};

interface CommonInputs {
  address: AztecAddress;
  header_array: bigint[];
  header_length: bigint;
  pubkey_modulus: bigint[];
  pubkey_redc: bigint[];
  signature: bigint[];
  from_header_sequence_index: bigint;
  from_header_sequence_length: bigint;
  from_address_sequence_index: bigint;
  from_address_sequence_length: bigint;
}

export interface WithBodyParams extends CommonInputs {
  body_array: bigint[];
  body_length: bigint;
  body_hash_index: bigint;
  dkim_header_sequence_index: bigint;
  dkim_header_sequence_length: bigint;
  username: bigint[];
}

export interface WithToParams extends CommonInputs {
  to_header_sequence_index: bigint;
  to_header_sequence_length: bigint;
  to_address_sequence_index: bigint;
  to_address_sequence_length: bigint;
  email_array: bigint[];
}

export const generateInputs = async (
  address: string,
  emailContent: string,
  type: Service,
  expected: string
) => {
  const options = inputParams[type];
  const i = await generateEmailVerifierInputs(emailContent, options);

  console.log(i);

  const commonInputs = {
    address: AztecAddress.fromString(address),
    header_array: i.header.storage.map((e) => BigInt(e)),
    header_length: BigInt(i.header.len),
    pubkey_modulus: i.pubkey.modulus.map((e) => BigInt(e)),
    pubkey_redc: i.pubkey.redc.map((e) => BigInt(e)),
    signature: i.signature.map((e) => BigInt(e)),
    from_header_sequence_index: BigInt(i.from_header_sequence!.index),
    from_header_sequence_length: BigInt(i.from_header_sequence!.length),
    from_address_sequence_index: BigInt(i.from_address_sequence!.index),
    from_address_sequence_length: BigInt(i.from_address_sequence!.length),
  };

  let otherInputs;

  if (type === 'x') {
    otherInputs = {
      body_array: i.body!.storage.map((e) => BigInt(e)),
      body_length: BigInt(i.body!.len),
      body_hash_index: BigInt(i.body_hash_index!),
      dkim_header_sequence_index: BigInt(i.dkim_header_sequence.index),
      dkim_header_sequence_length: BigInt(i.dkim_header_sequence.length),
      username: getXUsername(expected).storage.map((e) => BigInt(e)),
    };
  } else {
    otherInputs = {
      to_header_sequence_index: BigInt(i.to_header_sequence!.index),
      to_header_sequence_length: BigInt(i.to_header_sequence!.length),
      to_address_sequence_index: BigInt(i.to_address_sequence!.index),
      to_address_sequence_length: BigInt(i.to_address_sequence!.length),
      email_array: padEmail(expected),
    };
  }

  if (type === 'github') {
    return { ...commonInputs, ...otherInputs } as WithToParams;
  } else if (type === 'linkedin') {
    return { ...commonInputs, ...otherInputs } as WithToParams;
  } else if (type === 'google') {
    return { ...commonInputs, ...otherInputs } as WithToParams;
  }
  return { ...commonInputs, ...otherInputs } as WithBodyParams;
};
