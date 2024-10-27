import { AztecPassportContract } from '../generated/AztecPassport';

// Social Modules
import { XModuleContract } from '../generated/XModule';
import { GitHubModuleContract } from '../generated/GitHubModule';
import { LinkedinModuleContract } from '../generated/LinkedinModule';
import { GoogleModuleContract } from '../generated/GoogleModule';

// Ethereum Modules
import { ENSModuleContract } from '../generated/ENSModule';
import { BalanceModuleContract } from '../generated/BalanceModule';

// JWT Modules
import { VerifiableCredentialModuleContract } from '../generated/VerifiableCredentialModule';

// Identity Modules
import { BiometricModuleContract } from '../generated/BiometricModule';
import {
  AccountWalletWithSecretKey,
  CompleteAddress,
  EthAddress,
} from '@aztec/aztec.js';
import PASSPORT_CONFIG from '../config.json';

const PASSPORT_L1_ADDRESS = PASSPORT_CONFIG.PORTAL_L1_ADDRESS;

const DECIMALS = 10 ** 6;

const args = {
  x_module: {
    weight: 0.1 * DECIMALS,
    base_score: 2 * DECIMALS,
    max_score: 4 * DECIMALS,
  },
  github_module: {
    weight: 0.15 * DECIMALS,
    base_score: 3 * DECIMALS,
    max_score: 4 * DECIMALS,
  },
  linkedin_module: {
    weight: 0.2 * DECIMALS,
    base_score: 3 * DECIMALS,
    max_score: 5 * DECIMALS,
  },
  google_module: {
    weight: 0.1 * DECIMALS,
    base_score: 2.5 * DECIMALS,
    max_score: 4 * DECIMALS,
  },
  ens_module: {
    weight: 0.15 * DECIMALS,
    base_score: 2 * DECIMALS,
    max_score: 3 * DECIMALS,
  },
  balance_module: {
    weight: 0.05 * DECIMALS,
    base_score: 1 * DECIMALS,
    max_score: 1.5 * DECIMALS,
  },
  verifiable_credential_module: {
    weight: 0.35 * DECIMALS,
    base_score: 5 * DECIMALS,
    max_score: 12 * DECIMALS,
  },
  biometric_module: {
    weight: 0.45 * DECIMALS,
    base_score: 10 * DECIMALS,
    max_score: 20 * DECIMALS,
  },
};

const deploySocialModules = async (
  owner: AccountWalletWithSecretKey,
  passport: AztecPassportContract
) => {
  const xModule = await XModuleContract.deploy(owner, passport.address)
    .send()
    .deployed();

  await xModule
    .withWallet(owner)
    .methods.set_passport_address(passport.address)
    .send()
    .wait();

  await passport
    .withWallet(owner)
    .methods.add_service(
      xModule.address,
      args.x_module.weight,
      args.x_module.base_score,
      args.x_module.max_score
    )
    .send()
    .wait();

  const githubModule = await GitHubModuleContract.deploy(
    owner,
    passport.address
  )
    .send()
    .deployed();

  await githubModule
    .withWallet(owner)
    .methods.set_passport_address(passport.address)
    .send()
    .wait();

  await passport
    .withWallet(owner)
    .methods.add_service(
      githubModule.address,
      args.github_module.weight,
      args.github_module.base_score,
      args.github_module.max_score
    )
    .send()
    .wait();

  const linkedinModule = await LinkedinModuleContract.deploy(
    owner,
    passport.address
  )
    .send()
    .deployed();

  await linkedinModule
    .withWallet(owner)
    .methods.set_passport_address(passport.address)
    .send()
    .wait();

  await passport
    .withWallet(owner)
    .methods.add_service(
      linkedinModule.address,
      args.linkedin_module.weight,
      args.linkedin_module.base_score,
      args.linkedin_module.max_score
    )
    .send()
    .wait();

  const googleModule = await GoogleModuleContract.deploy(
    owner,
    passport.address
  )
    .send()
    .deployed();

  await googleModule
    .withWallet(owner)
    .methods.set_passport_address(passport.address)
    .send()
    .wait();

  await passport
    .withWallet(owner)
    .methods.add_service(
      googleModule.address,
      args.google_module.weight,
      args.google_module.base_score,
      args.google_module.max_score
    )
    .send()
    .wait();

  return { xModule, githubModule, linkedinModule, googleModule };
};

const deployEthModules = async (
  owner: AccountWalletWithSecretKey,
  passport: AztecPassportContract
) => {
  const ensModule = await ENSModuleContract.deploy(owner, passport.address)
    .send()
    .deployed();

  await ensModule
    .withWallet(owner)
    .methods.set_passport_address(passport.address)
    .send()
    .wait();

  await ensModule
    .withWallet(owner)
    .methods.set_ens_registry(EthAddress.fromString(PASSPORT_L1_ADDRESS))
    .send()
    .wait();

  await passport
    .withWallet(owner)
    .methods.add_service(
      ensModule.address,
      args.ens_module.weight,
      args.ens_module.base_score,
      args.ens_module.max_score
    )
    .send()
    .wait();

  const balanceModule = await BalanceModuleContract.deploy(
    owner,
    passport.address
  )
    .send()
    .deployed();

  await balanceModule
    .withWallet(owner)
    .methods.set_passport_address(passport.address)
    .send()
    .wait();

  await balanceModule
    .withWallet(owner)
    .methods.set_balance_registry(EthAddress.fromString(PASSPORT_L1_ADDRESS))
    .send()
    .wait();

  await passport
    .withWallet(owner)
    .methods.add_service(
      balanceModule.address,
      args.balance_module.weight,
      args.balance_module.base_score,
      args.balance_module.max_score
    )
    .send()
    .wait();

  return { ensModule, balanceModule };
};

const deployVerifiableCredentialModules = async (
  owner: AccountWalletWithSecretKey,
  passport: AztecPassportContract
) => {
  const verifiableCredentialModule =
    await VerifiableCredentialModuleContract.deploy(owner, passport.address)
      .send()
      .deployed();

  await verifiableCredentialModule
    .withWallet(owner)
    .methods.set_passport_address(passport.address)
    .send()
    .wait();

  await verifiableCredentialModule
    .withWallet(owner)
    .methods.set_jwt_registry(EthAddress.fromString(PASSPORT_L1_ADDRESS))
    .send()
    .wait();

  await passport
    .withWallet(owner)
    .methods.add_service(
      verifiableCredentialModule.address,
      args.verifiable_credential_module.weight,
      args.verifiable_credential_module.base_score,
      args.verifiable_credential_module.max_score
    )
    .send()
    .wait();

  return { verifiableCredentialModule };
};

const deployBiometricModule = async (
  owner: AccountWalletWithSecretKey,
  passport: AztecPassportContract
) => {
  const biometricModule = await BiometricModuleContract.deploy(
    owner,
    passport.address
  )
    .send()
    .deployed();

  await biometricModule
    .withWallet(owner)
    .methods.set_passport_address(passport.address)
    .send()
    .wait();

  await passport
    .withWallet(owner)
    .methods.add_service(
      biometricModule.address,
      args.biometric_module.weight,
      args.biometric_module.base_score,
      args.biometric_module.max_score
    )
    .send()
    .wait();

  return { biometricModule };
};

export const deployAllModules = async (
  owner: AccountWalletWithSecretKey,
  ownerAddress: CompleteAddress
) => {
  const passport = await AztecPassportContract.deploy(owner, ownerAddress)
    .send()
    .deployed();

  const socialModules = await deploySocialModules(owner, passport);
  const ethModules = await deployEthModules(owner, passport);
  const verifiableCredentialModules = await deployVerifiableCredentialModules(
    owner,
    passport
  );
  const biometricModule = await deployBiometricModule(owner, passport);

  return {
    ...socialModules,
    ...ethModules,
    ...verifiableCredentialModules,
    ...biometricModule,
    passport,
  };
};
