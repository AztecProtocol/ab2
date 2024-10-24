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

// const pxe = createPXEClient(PXE_URL);
// await waitForPXE(pxe);
// const [owner] = await getDeployedTestAccountsWallets(pxe);
// const ownerAddress = owner.getCompleteAddress();

// const {
//   passport,
//   xModule,
//   githubModule,
//   googleModule,
//   linkedinModule,
//   verifiableCredentialModule,
//   ensModule,
//   balanceModule,
//   biometricModule,
// } = await deployAllModules(owner, ownerAddress);

// const data = {
//   PASSPORT_ADDRESS: passport.address.toString(),
//   X_MODULE_ADDRESS: xModule.address.toString(),
//   GITHUB_MODULE_ADDRESS: githubModule.address.toString(),
//   GOOGLE_MODULE_ADDRESS: googleModule.address.toString(),
//   LINKEDIN_MODULE_ADDRESS: linkedinModule.address.toString(),
//   VERIFIABLE_CREDENTIAL_MODULE_ADDRESS:
//     verifiableCredentialModule.address.toString(),
//   ENS_MODULE_ADDRESS: ensModule.address.toString(),
//   BALANCE_MODULE_ADDRESS: balanceModule.address.toString(),
//   BIOMETRIC_MODULE_ADDRESS: biometricModule.address.toString(),
// };

const newEnv = {
  ...appEnv.parsed,
  TEST: '123',
};
let toWrite = '';
Object.entries(newEnv).forEach(([k, v]) => {
  toWrite += `${k}="${v}" \n`;
});

console.log(toWrite);
