import React, { useState, useEffect } from "react";
import {
  AccountWalletWithSecretKey,
  AztecAddress,
  computeSecretHash,
  Contract,
  ExtendedNote,
  Fr,
  Note,
} from "@aztec/aztec.js";
import { NFTContract, TokenContract } from "@aztec/noir-contracts.js";
import { useAccount } from "../hooks/useAccounts.js";
import { Bell, Search, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import WalletSection from "./walletSelection.js";
import { NftInteractions } from "./NftInteractions.js";

const TokenRow = ({ token, onSelect }: { token: any; onSelect: any }) => (
  <tr
    className="border-b border-gray-700 hover:bg-gray-800 cursor-pointer"
    onClick={() => onSelect(token)}
  >
    <td className="py-4 flex items-center">
      <img
        src={token.logo}
        alt={token.name}
        className="w-8 h-8 mr-3 rounded-full"
      />
      <div>
        <div className="font-medium">{token.symbol}</div>
        <div className="text-sm text-gray-400">{token.name}</div>
      </div>
    </td>
    <td className="py-4">{token.portfolio}%</td>
    <td className="py-4">
      <div>${token.price.toFixed(2)}</div>
      <div
        className={`text-sm ${
          token.priceChange >= 0 ? "text-green-500" : "text-red-500"
        }`}
      >
        {token.priceChange >= 0 ? "+" : ""}
        {token.priceChange.toFixed(2)}%
      </div>
    </td>
    <td className="py-4">
      <div>${token.balance.toFixed(2)}</div>
      <div className="text-sm text-gray-400">
        {token.amount} {token.symbol}
      </div>
    </td>
  </tr>
);

export const WalletInteractions = () => {
  const { deployToken } = useAccount();
  const [wallets, setWallets] = useState<AccountWalletWithSecretKey[]>([]);
  const [currentWallet, setCurrentWallet] =
    useState<AccountWalletWithSecretKey | null>(null);
  const [isLoading, setIsLoading] = useState<{
    checkBalancePublic: boolean | undefined;
    checkBalancePrivate: boolean | undefined;
    createAccount?: boolean;
    deployToken?: boolean;
    mintPublic?: boolean;
    mintPrivate?: boolean;
    transferPublic?: boolean;
    transferPrivate?: boolean;
    deployNFTToken?: boolean;
    movingPublic?: boolean;
    movingPrivate?: boolean;
  }>({
    checkBalancePublic: undefined,
    checkBalancePrivate: undefined,
    createAccount: false,
    deployToken: false,
    mintPublic: false,
    mintPrivate: false,
    transferPublic: false,
    transferPrivate: false,
  });
  const [tokenContract, setTokenContract] = useState<Contract | null>(null);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState(0);
  const [transactionStatus, setTransactionStatus] = useState("");
  const [tokens, setTokens] = useState<
    {
      id: number;
      name: string;
      symbol: string;
      logo: string;
      portfolio: number;
      price: number;
      priceChange: number;
      balance: number;
      amount: number;
    }[]
  >([]);
  const [, setSelectedToken] = useState(null);
  const [tab, setTab] = useState("Tokens");
  const [deployTokenAddress, setDeployTokenAddress] = useState("");
  const [nftContract, setNftContract] = useState<NFTContract | null >(null);

  useEffect(() => {
    // Simulated token data
    setTokens([
      {
        id: 1,
        name: "USD Coin",
        symbol: "USDC",
        logo: "/usdc-logo.svg",
        portfolio: 81.09,
        price: 1.0,
        priceChange: -0.14,
        balance: 279.73,
        amount: 280.0713,
      },
      {
        id: 2,
        name: "Dai Stablecoin",
        symbol: "DAI",
        logo: "/dai-logo.svg",
        portfolio: 15.44,
        price: 1.0,
        priceChange: -0.11,
        balance: 53.26,
        amount: 53.3194,
      },
      {
        id: 3,
        name: "Ether",
        symbol: "ETH",
        logo: "/eth-logo.svg",
        portfolio: 3.48,
        price: 2323.93,
        priceChange: -1.03,
        balance: 11.99,
        amount: 0.0052,
      },
    ]);
  }, []);

  const handleDeployToken = async () => {
    if (!currentWallet) {
      toast.error("Please select a wallet first");
      return;
    }
    setIsLoading({ ...isLoading, deployToken: true });
    try {
      const contract = await deployToken(currentWallet);
      setTokenContract(contract);
      console.log("Token deployed at:", contract.address.toString());
      setDeployTokenAddress(contract.address.toString());
      toast.success("Token deployed successfully!");
    } catch (error) {
      toast.error("Failed to deploy token: " + (error as Error).message);
    } finally {
      setIsLoading({ ...isLoading, deployToken: false });
    }
  };

  const handleMint = async (isPublic: boolean) => {
    if (!tokenContract || !currentWallet) {
      toast.error("Please deploy a token and select a wallet first");
      return;
    }
    setIsLoading({
      ...isLoading,
      [isPublic ? "mintPublic" : "mintPrivate"]: true,
    });
    try {
      let tx;
      if (isPublic) {
        tx = await tokenContract.methods
          .mint_public(currentWallet.getAddress(), 100n)
          .send();
      } else {
        const random = Fr.random();
        const secretHash = await computeSecretHash(random);
        tx = await tokenContract.methods.mint_private(100n, secretHash).send();
        const receipt = await tx.wait();
        const note = new Note([new Fr(100n), secretHash]);
        const extendedNote = new ExtendedNote(
          note,
          currentWallet.getAddress(),
          tokenContract.address,
          TokenContract.storage.pending_shields.slot,
          TokenContract.notes.TransparentNote.id,
          receipt.txHash
        );
        await currentWallet.addNote(extendedNote);
        tx = await tokenContract.methods
          .redeem_shield(currentWallet.getAddress(), 100n, random)
          .send();
      }
      const receipt = await tx.wait();
      setTransactionStatus(`${receipt.status}`);
      toast.success(`${isPublic ? "Public" : "Private"} minting successful!`);
    } catch (error) {
      toast.error(
        `Failed to mint ${isPublic ? "public" : "private"}: ${String(error)}`
      );
    } finally {
      setIsLoading({
        ...isLoading,
        [isPublic ? "mintPublic" : "mintPrivate"]: false,
      });
    }
  };
  const checkBalance = async (isPublic = true) => {
    if (!tokenContract || !currentWallet) {
      console.error("No contract or wallet address found");
      return;
    }

    try {
      const method = isPublic ? "balance_of_public" : "balance_of_private";
      const balance = await tokenContract.methods[method](
        currentWallet.getAddress()
      ).simulate();

      toast.success(
        `${isPublic ? "Public" : "Private"} Balance of address ${currentWallet
          .getAddress()
          .toShortString()}: ${balance}`
      );
    } catch (error) {
      console.error("Error checking balance:", error);
      toast.error(
        `Error checking ${isPublic ? "public" : "private"} balance: ${
          (error as Error).message
        }`
      );
    }
  };

  const handleTransfer = async (isPublic: boolean) => {
    if (
      !tokenContract ||
      !currentWallet ||
      !recipientAddress ||
      transferAmount <= 0
    ) {
      toast.error("Please fill in all transfer details");
      return;
    }
    setIsLoading({
      ...isLoading,
      [isPublic ? "transferPublic" : "transferPrivate"]: true,
    });
    try {
      let tx;
      if (isPublic) {
        tx = await tokenContract.methods
          .transfer_public(
            currentWallet.getAddress(),
            recipientAddress,
            BigInt(transferAmount),
            BigInt(0)
          )
          .send();
      } else {
        tx = (
          await TokenContract.at(tokenContract.address, currentWallet)
        ).methods
          .transfer(recipientAddress as any as AztecAddress, transferAmount)
          .send();
      }
      const receipt = await tx.wait();
      setTransactionStatus(`${receipt.status}`);
      toast.success(`${isPublic ? "Public" : "Private"} transfer successful!`);
    } catch (error) {
      toast.error(
        `Failed to transfer ${isPublic ? "public" : "private"}: ` +
          (error as Error).message
      );
    } finally {
      setIsLoading({
        ...isLoading,
        [isPublic ? "transferPublic" : "transferPrivate"]: false,
      });
    }
  };

  const handleMovingTokens = async (isPublic = true) => {
    if (
      !recipientAddress ||
      transferAmount === 0 ||
      !tokenContract ||
      !currentWallet
    ) {
      return toast.error(
        "Invalid call: Please check recipient address, transfer amount, and contract/wallet availability."
      );
    }

    try {
      setIsLoading({
        ...isLoading,
        [isPublic ? "movingPublic" : "movingPrivate"]: true,
      });

      let tx;
      if (isPublic) {
        tx = await tokenContract.methods
          .unshield(
            currentWallet.getAddress(),
            recipientAddress,
            BigInt(transferAmount),
            BigInt(0)
          )
          .send();
      } else {
        const random = Fr.random();
        const secretHash = await computeSecretHash(random);
        tx = await tokenContract.methods
          .shield(
            currentWallet.getAddress(),
            BigInt(transferAmount),
            secretHash,
            BigInt(0)
          )
          .send();
      }

      const receipt = await tx.wait();
      setTransactionStatus(`${receipt.status}`);
      toast.success(
        `${isPublic ? "Public" : "Private"} token move successful!`
      );
    } catch (e: any) {
      toast.error(
        `Error moving ${isPublic ? "public" : "private"} tokens: ${e.message}`
      );
    } finally {
      setIsLoading({
        ...isLoading,
        [isPublic ? "movingPublic" : "movingPrivate"]: false,
      });
    }
    return;
  };
  const onSelecTab = (tab: string) => {
    setTab(tab);
    console.log(tab);
  };
  return (
    <div className="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white min-h-screen overflow-auto">
      <header className="bg-black bg-opacity-50 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* <img src="/metamask-fox.svg" alt="Logo" className="w-10 h-10" /> */}
          <h1 className="text-2xl ml-4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            AzGuard Wallet
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for a token..."
              className="bg-gray-800 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <Bell className="text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <WalletSection
            wallets={wallets}
            setWallets={setWallets}
            setCurrentWallet={setCurrentWallet}
          />
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4">Decentralized accounts</h2>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-4xl font-bold">$344.98</span>
              <span className="text-red-500">-$0.57 (-0.16%)</span>
            </div>
            <div className="space-y-2">
              {["Tokens", "NFTs", "DeFi", "Transactions", "Spending Caps"].map(
                (tabAction) => (
                  <button
                    key={tabAction}
                    className={`block w-full text-left py-2 px-4 rounded transition-all ${
                      tabAction === tab
                        ? "bg-purple-700 shadow-lg"
                        : "hover:bg-gray-800"
                    }`}
                    disabled={
                      !(
                        tabAction === "Transactions" ||
                        tabAction === "Tokens" ||
                        tabAction === "NFTs"
                      )
                    }
                    onClick={() => onSelecTab(tabAction)}
                  >
                    {tabAction}
                  </button>
                )
              )}
            </div>
          </div>
          {tab === "Tokens" && (
            <div className="bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">Wallet Actions</h2>
              {/* <WalletSection wallets={wallets} setWallets={setWallets} setCurrentWallet={setCurrentWallet} /> */}
              <div className="mb-4 mt-4 w-full">
                <button
                  onClick={handleDeployToken}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
                  disabled={isLoading.deployToken}
                >
                  {isLoading.deployToken ? (
                    <Loader className="animate-spin mr-2" />
                  ) : null}
                  Deploy Token
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <button
                  onClick={() => handleMint(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                  disabled={isLoading.mintPublic}
                >
                  {isLoading.mintPublic ? (
                    <Loader className="animate-spin mr-2" />
                  ) : null}
                  Mint Public
                </button>
                <button
                  onClick={() => handleMint(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                  disabled={isLoading.mintPrivate}
                >
                  {isLoading.mintPrivate ? (
                    <Loader className="animate-spin mr-2" />
                  ) : null}
                  Mint Private
                </button>
                <button
                  onClick={() => checkBalance(true)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                  disabled={isLoading.checkBalancePublic}
                >
                  Public Balance
                </button>
                <button
                  onClick={() => checkBalance(false)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                  disabled={isLoading.checkBalancePrivate}
                >
                  Private Balance
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter Recipient Address"
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(+e.target.value)}
                  placeholder="Transfer Amount"
                  className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="grid grid-cols-4 gap-4">
                  <button
                    onClick={() => handleTransfer(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                    disabled={isLoading.transferPublic}
                  >
                    {isLoading.transferPublic ? (
                      <Loader className="animate-spin mr-2" />
                    ) : null}
                    Public Transfer
                  </button>
                  <button
                    onClick={() => handleTransfer(false)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                    disabled={isLoading.transferPrivate}
                  >
                    {isLoading.transferPrivate ? (
                      <Loader className="animate-spin mr-2" />
                    ) : null}
                    Private Transfer
                  </button>
                  <button
                    onClick={() => handleMovingTokens(true)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                    disabled={isLoading.movingPublic}
                  >
                    Move To Public
                    {isLoading.movingPublic ? (
                      <Loader className="animate-spin mr-2" />
                    ) : null}
                  </button>
                  <button
                    onClick={() => handleMovingTokens(false)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full text-sm hover:from-blue-600 hover:to-purple-600 transition-all"
                    disabled={isLoading.movingPrivate}
                  >
                    Move To Private
                    {isLoading.movingPrivate ? (
                      <Loader className="animate-spin mr-2" />
                    ) : null}
                  </button>
                </div>
              </div>
            </div>
          )}
          {tab === "Transactions" && (
            <div className="bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm overflow-auto">
              <h2 className="text-2xl font-bold mb-4">Transactions</h2>
              <div className="items-center space-x-4 ">
                <span className="text-2xl font-bold">
                  Deployed Token Address:
                </span>
                <span className="text-gray-400">{deployTokenAddress}</span>
              </div>
              <div className="items-center space-x-4 ">
                <span className="text-2xl font-bold">Transaction Status:</span>
                <span className="text-gray-400">{transactionStatus}</span>
              </div>
              <div className="items-center space-x-4 ">
                <span className="text-2xl font-bold">
                  Deployed NFT Token Address:
                </span>
                <span className="text-gray-400">{nftContract?.address?.toString()}</span>
              </div>
            </div>
          )}
          {tab === "NFTs" && (
            <NftInteractions
              currentWallet={currentWallet as AccountWalletWithSecretKey}
              setNftContract={setNftContract}
              nftContract={nftContract}
            />
          )}
        </div>
      
        {tab === "Tokens" &&<div className="mt-6 bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-4">Token List</h2>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="pb-2">Token</th>
                <th className="pb-2">Portfolio %</th>
                <th className="pb-2">Price (24hr)</th>
                <th className="pb-2">Balance</th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => (
                <TokenRow
                  key={token.id}
                  token={token}
                  onSelect={setSelectedToken}
                />
              ))}
            </tbody>
          </table>
        </div>}
      </main>
    </div>
  );
};

export default WalletInteractions;
// export const WalletInteractions = () => {
