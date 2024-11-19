import React, { useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { currentWalletAtom, walletsAtom } from '../atoms.js';
import { useAccount } from '../hooks/useAccounts.js';
import { Spinner } from './Spinnner.js';
import { Link, useLocation } from 'react-router-dom';
import { PXE } from '@aztec/aztec.js';
import { useLoadAccountFromStorage } from '../hooks/useLoadAccountsFromStorage.js';

const Header = ({ pxe }: { pxe: PXE }) => {
  const [currentWallet, setCurrentWallet] = useAtom(currentWalletAtom);
  const wallets = useAtomValue(walletsAtom);
  const { createAccount, isCreating } = useAccount(pxe);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const location = useLocation();

  const shortenAddress = (address: string) => {
    const str = address.toString();
    return `${str.slice(0, 6)}...${str.slice(-4)}`;
  };

  useLoadAccountFromStorage(pxe);

  return (
    <header>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <nav className="flex items-center space-x-4">
            <Link
              to="/admin"
              className={`px-6 py-2 rounded-full transition-all duration-200 ${location.pathname === '/admin'
                ? 'bg-white text-black-600 shadow-md'
                : 'text-white hover:bg-white/10'
                }`}
            >
              Admin Panel
            </Link>
            <Link
              to="/verify"
              className={`px-6 py-2 rounded-full transition-all duration-200 ${location.pathname === '/verify'
                ? 'bg-white text-black-600 shadow-md'
                : 'text-white hover:bg-white/10'
                }`}
            >
              Verify Wallet
            </Link>
          </nav>

          {/* Wallet Management */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                className="flex items-center space-x-2 px-6 py-2 backdrop-blur-sm 
                          rounded-full text-white hover:bg-white/20 transition-all duration-200
                          border border-white/20"
              >
                {currentWallet ? (
                  <>
                    <span className="font-medium">
                      {shortenAddress(currentWallet.getAddress().toString())}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                ) : (
                  <span>No Wallet Selected</span>
                )}
              </button>

              {/* Wallet Dropdown */}
              {isWalletDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl z-50 
                               border border-purple-100 overflow-hidden">
                  <div className="py-2">
                    {wallets.map((wallet, index) => (
                      <button
                        key={wallet.getAddress().toString()}
                        onClick={() => {
                          setCurrentWallet(wallet);
                          setIsWalletDropdownOpen(false);
                        }}
                        className={`w-full my-2 px-4 py-3 text-left bg-indigo-50 duration-200
                                  ${currentWallet === wallet ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700'}`}
                      >
                        <div className="flex items-center justify-between bg-transparent">
                          <span className="font-medium">Wallet {index + 1}</span>
                          <span className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                            {shortenAddress(wallet.getAddress().toString())}
                          </span>
                        </div>
                      </button>
                    ))}

                    {/* Create New Wallet Button */}
                    <button
                      onClick={async () => {
                        await createAccount();
                        setIsWalletDropdownOpen(false);
                      }}
                      disabled={isCreating}
                      className="w-full px-4 py-3 mt-2 text-left border-t border-purple-100 
                               hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 
                               flex items-center group transition-all duration-200"
                    >
                      {isCreating ? (
                        <>
                          <Spinner />
                          <span className="ml-2 text-indigo-600">Creating Wallet...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-8 h-8 flex items-center justify-center rounded-full 
                                        bg-gradient-to-r from-indigo-500 to-purple-500 text-white
                                        group-hover:scale-110 transition-transform duration-200">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </div>
                          <span className="ml-2 font-medium text-gray-300 group-hover:text-indigo-400">
                            Create New Wallet
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;