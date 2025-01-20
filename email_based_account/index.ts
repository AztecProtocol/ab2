import { getDeployedTestAccountsWallets } from '@aztec/accounts/testing';
import { 
  AztecAddress,
  createDebugLogger, 
  createPXEClient, 
  waitForPXE,
} from '@aztec/aztec.js';
import { TokenContract } from '@aztec/noir-contracts.js/Token';
import { format } from 'node:util';
import { interactWithToken } from './interactWithToken.js';

const PXE_URL = process.env.PXE_URL || 'http://localhost:8080';

async function main() {
  const logger = createDebugLogger('token');
  
  try {
    // Connect to PXE
    logger.info('Creating PXE client...');
    const pxe = createPXEClient(PXE_URL);
    await waitForPXE(pxe, logger);
    
    const nodeInfo = await pxe.getNodeInfo();
    logger.info(format('Aztec Sandbox Info ', nodeInfo));

    // Get Alice's account
    const accounts = await getDeployedTestAccountsWallets(pxe);
    const aliceWallet = accounts[0];
    const alice = aliceWallet.getAddress();
    logger.info(`Loaded alice's account at ${alice.toShortString()}`);

    // Get action from command line arguments
    if (process.argv.length < 3) {
      throw new Error("Not enough arguments. Usage: yarn start <action> [<args>]");
    }

    const action = process.argv[2];

    if (action === 'deploy') {
      if (process.argv.length < 6) {
        throw new Error("Not enough arguments. Usage: yarn start deploy <tokenName> <tokenSymbol> <initialSupply>");
      }

      const tokenName = process.argv[3];
      const tokenSymbol = process.argv[4];
      const initialSupply = BigInt(process.argv[5]);

      // Deploy the token contract
      logger.info(`Deploying token contract: ${tokenName} (${tokenSymbol}) with initial supply of ${initialSupply}`);
      const deployTx = await TokenContract.deploy(aliceWallet, alice, tokenName, tokenSymbol, 18).send();
      const token = await deployTx.deployed();
      logger.info(`Token contract deployed at ${token.address.toString()}`);

      // Mint initial supply to Alice (publicly)
      logger.info(`Minting ${initialSupply} tokens to Alice's public balance`);
      const mintTx = await token.methods.mint_public(alice, initialSupply).send();
      await mintTx.wait();

      // Check Alice's balance
      const aliceBalance = await token.methods.balance_of_public(alice).simulate();
      logger.info(`Alice's public balance: ${aliceBalance.toString()}`);

      // Return the contract address
      return token.address.toString();
    } else if (action === 'interact') {
      if (process.argv.length < 6) {
        throw new Error("Not enough arguments. Usage: yarn send-tokens <tokenAddress> <destinationAddress> <amount>");
      }

      const tokenAddress = AztecAddress.fromString(process.argv[3]);
      const destinationAddress = AztecAddress.fromString(process.argv[4]);
      const amount = BigInt(process.argv[5]);

      // Interact with the token (transfer and show balances)
      await interactWithToken(pxe, aliceWallet, tokenAddress, destinationAddress, amount);

      // Return the contract address
      return tokenAddress.toString();
    } else {
      throw new Error("Invalid action. Use 'deploy' to deploy a new token or 'interact' to interact with an existing token.");
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`An error occurred: ${error.message}`);
      if (error.stack) {
        logger.error(`Stack trace: ${error.stack}`);
      }
    } else {
      logger.error('An unknown error occurred');
    }
  }
}

main().then((contractAddress) => {
  if (contractAddress) {
    console.log(`Token contract address: ${contractAddress}`);
  }
  process.exit(0);
}).catch(error => {
  console.error('An unhandled error occurred:', error);
  process.exit(1);
});
