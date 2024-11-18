import React, { createContext, useState, useContext } from 'react';

export interface WalletInfo {
  address: string;
  balance: string;
  transactions: any[]; // You might want to define a more specific type for transactions
  encryptionSecretKey: string;
  signingSecretKey: string;
}

interface WalletContextType {
  walletInfo: WalletInfo | null;
  setWalletInfo: React.Dispatch<React.SetStateAction<WalletInfo | null>>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: React.ReactNode;
  initialWalletInfo?: WalletInfo;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children, initialWalletInfo }) => {
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(initialWalletInfo || null);

  return (
    <WalletContext.Provider value={{ walletInfo, setWalletInfo }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};