import { AztecAddress, type Wallet } from '@aztec/aztec.js';
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
