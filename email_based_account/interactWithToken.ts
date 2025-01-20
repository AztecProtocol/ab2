import { 
  AztecAddress,
  createDebugLogger,
  type PXE,
  AccountWallet
} from '@aztec/aztec.js';
import { TokenContract } from '@aztec/noir-contracts.js/Token';

export async function interactWithToken(pxe: PXE, aliceWallet: AccountWallet, tokenAddress: AztecAddress, destinationAddress: AztecAddress, amount: bigint) {
  const logger = createDebugLogger('token');

  try {
    const alice = aliceWallet.getAddress();

    // Connect to the existing token contract
    logger.info(`Connecting to existing token contract at ${tokenAddress.toString()}`);
    const token = await TokenContract.at(tokenAddress, aliceWallet);

    logger.info(`Destination address: ${destinationAddress.toString()}`);

    // Check initial balances
    const aliceInitialBalance = await token.methods.balance_of_public(alice).simulate();
    const destinationInitialBalance = await token.methods.balance_of_public(destinationAddress).simulate();
    logger.info(`Alice's initial public balance: ${aliceInitialBalance.toString()}`);
    logger.info(`Destination's initial public balance: ${destinationInitialBalance.toString()}`);

    // Transfer the specified amount of tokens from Alice to the destination address
    logger.info(`Attempting to transfer ${amount} tokens from Alice to ${destinationAddress.toString()}...`);
    const transferTx = await token.methods.transfer_public(alice, destinationAddress, amount, 0n).send();
    await transferTx.wait();
    logger.info(`Transferred ${amount} tokens from Alice to ${destinationAddress.toString()}`);

    // Check final balances
    const aliceFinalBalance = await token.methods.balance_of_public(alice).simulate();
    const destinationFinalBalance = await token.methods.balance_of_public(destinationAddress).simulate();
    logger.info(`Alice's final public balance: ${aliceFinalBalance.toString()}`);
    logger.info(`Destination's final public balance: ${destinationFinalBalance.toString()}`);

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

