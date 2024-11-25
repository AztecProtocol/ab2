import { Copy, Loader, PlusCircle } from 'lucide-react';
import React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAccount } from '../hooks/useAccounts.js';

export const WalletSection = ({ wallets, setWallets, setCurrentWallet }: { wallets: any[], setWallets: any, setCurrentWallet: any }) => {
    const { createCustomAccount } = useAccount();
    const [selectedWallet, setSelectedWallet] = useState<any>(null);
    const [isLoading, setIsLoading] = useState({ createWallet: false });

    const handleCreateWallet = async () => {
        setIsLoading({ ...isLoading, createWallet: true });
        try {
            const newWallet = await createCustomAccount();
            if (newWallet) {
                setWallets((prevWallets: any) => [...prevWallets, newWallet]);
                setCurrentWallet(newWallet); // Automatically set the created wallet as the current one
                setSelectedWallet(newWallet); // Set it as the selected wallet
                toast.success('Wallet created successfully');
            }
            setIsLoading({ ...isLoading, createWallet: false });
        } catch (error) {
            setIsLoading({ ...isLoading, createWallet: false });
            toast.error('Error creating wallet: ' + (error as Error).message);
        }
    };

    const handleCopyAddress = (address: any) => {
        navigator.clipboard.writeText(address);
        toast.success('Address copied to clipboard');
    };

    const handleSelectWallet = (wallet: any) => {
        setCurrentWallet(wallet);
        setSelectedWallet(wallet);
    };

    return (
        <div className="mt-4 px-4 py-2 rounded-full flex items-center space-x-2 hover:from-purple-600 hover:to-pink-600 transition-all">
            {wallets.length > 0 ? (
                <div className="mb-4">
                    <select
                        value={selectedWallet ? selectedWallet.getAddress().toString() : ''}
                        onChange={(e) => {
                            const wallet = wallets.find(w => w.getAddress().toString() === e.target.value);
                            if (wallet) handleSelectWallet(wallet);
                        }}
                        className="bg-gray-800 text-white px-4 py-2 rounded-md w-fit"
                    >
                        {/* <option value="" disabled>Select a wallet</option> */}
                        {wallets.map((wallet:any) => (
                            <option key={wallet.getAddress().toString()} value={wallet.getAddress().toString()}>
                                {wallet.getAddress().toShortString()}

                            </option>
                        ))}

                    </select>
                    {selectedWallet && <button
                        className="text-blue-400 hover:text-blue-600 ml-2"
                        onClick={() => handleCopyAddress(selectedWallet.getAddress().toString())}
                    >
                        <Copy size={16} />
                    </button>}
                </div>
            ) : (
                <div className="text-white mb-4">Wallet</div>
            )} 
            
            <div className='flex'><PlusCircle className='mb-4' size={20} onClick={handleCreateWallet} />
            {isLoading.createWallet ? <Loader className="animate-spin mr-2" /> : null}</div>
        </div>
    );
};

export default WalletSection;
