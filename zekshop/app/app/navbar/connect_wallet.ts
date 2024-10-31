// import { Fr, createPXEClient, deriveMasterIncomingViewingSecretKey } from '@aztec/aztec.js';
// import { AccountManager } from '@aztec/aztec.js';
// import { SchnorrAccountContract } from './SchnorrAccountContract';

// const SECRET_KEY = Fr.random();

// export class PrivateEnv {
//     pxe;
//     accountContract;
//     account: AccountManager;

//     constructor(
//         private secretKey: Fr,
//         private pxeURL: string,
//     ) {
//         this.pxe = createPXEClient(this.pxeURL);
//         const encryptionPrivateKey = deriveMasterIncomingViewingSecretKey(secretKey);
//         this.accountContract = new SchnorrAccountContract(encryptionPrivateKey);
//         this.account = new AccountManager(this.pxe, this.secretKey, this.accountContract);
//     }

//     async getWallet() {
//         // taking advantage that register is no-op if already registered
//         return await this.account.register();
//     }
// }

// export const deployerEnv = new PrivateEnv(SECRET_KEY, process.env.PXE_URL || 'http://localhost:8080');

export const connect_wallet = async () => {
    console.log("connect wallet");
};