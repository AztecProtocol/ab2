import React from 'react';
import { useWallet } from '../context/WalletContext';
import { useNavigate } from 'react-router-dom';

const Wallet: React.FC = () => {
  const { walletInfo } = useWallet();
  const navigate = useNavigate();

  if (!walletInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <p className="text-xl text-center mb-4">No wallet information available.</p>
          <button 
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            onClick={() => navigate('/create-account')}
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Wallet</h1>
        <div className="mb-4">
          <p className="font-bold mb-2">Address:</p>
          <code className="bg-gray-100 p-2 rounded break-all block">{walletInfo.address}</code>
        </div>
        <div className="mb-4">
          <p className="font-bold mb-2">Balance:</p>
          <p>{walletInfo.balance} ETH</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-2">Recent Transactions</h2>
          {walletInfo.transactions.length > 0 ? (
            <ul>
              {walletInfo.transactions.map((tx, index) => (
                <li key={index}>{tx}</li>
              ))}
            </ul>
          ) : (
            <p>No transactions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;