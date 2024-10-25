import React from 'react';
import { AccountWalletWithSecretKey, Contract } from '@aztec/aztec.js';

interface WalletInformationProps {
  currentWallet: AccountWalletWithSecretKey | null;
  tokenContract: Contract | null;
  transactionStatus: string;
}

const WalletInformation: React.FC<WalletInformationProps> = ({ currentWallet, tokenContract, transactionStatus }) => {
  return (
    // add some height

    <div className="p-4 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Wallet Information</h2>
      {currentWallet ? (
        <p className="text-gray-600 break-all">Current Wallet Address: {currentWallet.getAddress().toString()}</p>
      ) : (
        <p className="text-gray-600">No wallet selected</p>
      )}
      {tokenContract ? (
        <p className="text-gray-600 mt-2 break-all">Deployed Token Address: {tokenContract.address.toString()}</p>
      ) : (
        <p className="text-gray-600 mt-2">No token deployed</p>
      )}
      {transactionStatus && (
        <p className="text-green-600 font-semibold mt-2">{transactionStatus}</p>
      )}
    </div>
  );
};

export default WalletInformation;
