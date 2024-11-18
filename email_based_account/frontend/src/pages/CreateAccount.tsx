import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { createSchnorrAccount } from '../aztec';

const CreateAccount: React.FC = () => {
  const [isCreating, setIsCreating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAccount, setNewAccount] = useState<any>(null);
  const { setWalletInfo } = useWallet();
  const navigate = useNavigate();

  useEffect(() => {
    const createAccount = async () => {
      try {
        const account = await createSchnorrAccount();
        setNewAccount(account);
        setWalletInfo({
          ...account,
          balance: '0',
          transactions: [],
        });
        setIsCreating(false);
      } catch (error) {
        console.error('Error creating account:', error);
        setError('An error occurred while creating your account. Please try again.');
        setIsCreating(false);
      }
    };

    createAccount();
  }, [setWalletInfo]);

  const handleContinue = () => {
    navigate('/wallet');
  };

  const handleRetry = () => {
    setIsCreating(true);
    setError(null);
    setNewAccount(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  };

  if (isCreating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Creating Your Aztec Wallet
          </h1>
          <div data-testid="creating-account" className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-xl mb-4">Creating Account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Error Creating Account
          </h1>
          <div data-testid="account-error" className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (newAccount) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Your New Wallet
          </h1>
          <div data-testid="account-created" className="mb-6">
            <div className="mb-4">
              <p className="font-bold mb-2">Address:</p>
              <div className="flex items-center">
                <code className="bg-gray-100 p-2 rounded break-all">{newAccount.address}</code>
                <button 
                  onClick={() => copyToClipboard(newAccount.address)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="mb-4">
              <p className="font-bold mb-2">Encryption Secret Key:</p>
              <code className="bg-gray-100 p-2 rounded break-all block">{newAccount.encryptionSecretKey}</code>
            </div>
            <div className="mb-4">
              <p className="font-bold mb-2">Signing Secret Key:</p>
              <code className="bg-gray-100 p-2 rounded break-all block">{newAccount.signingSecretKey}</code>
            </div>
            <p className="text-red-500 font-bold mb-4">Warning: Never share your encryption secret key or signing secret key!</p>
          </div>
          <button 
            onClick={handleContinue}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Continue to Wallet
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default CreateAccount;