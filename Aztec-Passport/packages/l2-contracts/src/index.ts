const PXE_URL = 'http://localhost:8080';

// Aztec Imports
import { createPXEClient, waitForPXE } from '@aztec/aztec.js';
import { getDeployedTestAccountsWallets } from '@aztec/accounts/testing';
import { deployAllModules } from './deploy';

import { config, parse, populate } from 'dotenv';
import { writeFileSync } from 'node:fs';

const appEnvPath = '../../apps/www/.env';
const l1ContractsEnvPath = '../l1-contracts/.env';

const appEnv = config({ path: appEnvPath });
const l1ContractsEnv = config({ path: l1ContractsEnvPath });

const pxe = createPXEClient(PXE_URL);
await waitForPXE(pxe);
const [owner] = await getDeployedTestAccountsWallets(pxe);
const ownerAddress = owner.getCompleteAddress();

const {
  passport,
  xModule,
  githubModule,
  googleModule,
  linkedinModule,
  verifiableCredentialModule,
  ensModule,
  balanceModule,
  biometricModule,
} = await deployAllModules(owner, ownerAddress);

const data = {
  VITE_PASSPORT_ADDRESS: passport.address.toString(),
  VITE_X_MODULE_ADDRESS: xModule.address.toString(),
  VITE_GITHUB_MODULE_ADDRESS: githubModule.address.toString(),
  VITE_GOOGLE_MODULE_ADDRESS: googleModule.address.toString(),
  VITE_LINKEDIN_MODULE_ADDRESS: linkedinModule.address.toString(),
  VITE_VERIFIABLE_CREDENTIAL_MODULE_ADDRESS:
    verifiableCredentialModule.address.toString(),
  VITE_ENS_MODULE_ADDRESS: ensModule.address.toString(),
  VITE_BALANCE_MODULE_ADDRESS: balanceModule.address.toString(),
  VITE_BIOMETRIC_MODULE_ADDRESS: biometricModule.address.toString(),
};

const newEnv = {
  ...appEnv.parsed,
  ...data,
};
let toWrite = '';
Object.entries(newEnv).forEach(([k, v]) => {
  toWrite += `${k}="${v}" \n`;
});

console.log(toWrite);

writeFileSync(appEnvPath, toWrite);
