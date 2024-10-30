import React, { useState } from "react";
import { useAccount } from "../hooks/useAccounts.js";
import { AccountWalletWithSecretKey, AztecAddress, Fr } from "@aztec/aztec.js";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { NFTContract } from "@aztec/noir-contracts.js";

interface NftInteractionsProps {
  currentWallet: AccountWalletWithSecretKey | null;
  setNftContract: (contract: NFTContract) => void;
  nftContract: NFTContract | null;
}

export const NftInteractions = ({
  currentWallet,
  setNftContract,
  nftContract,
}: NftInteractionsProps) => {
  const { deployNFtToken } = useAccount();
  const [isLoading, setIsLoading] = useState<{
    deployNFTToken?: boolean;
    isMintingNFT?: boolean;
    isPublicTransferNFT?: boolean;
    isFetchOwner?: boolean;
    isPrivateTransferNFT?: boolean;
    isFetchPrivateToken?: boolean;
  }>({
    deployNFTToken: false,
    isMintingNFT: false,
    isPublicTransferNFT: false,
    isFetchOwner: false,
    isPrivateTransferNFT: false,
    isFetchPrivateToken: false,
  });
  const [tokenId, setTokenId] = useState<number>(0);
  const [nftMintAddress, setNFTMintAddress] = useState<string>("");
  const [verifyAddress, setNFTVerifyAddress] = useState<string>("");
  const handleDeplyNftToken = async () => {
    if (!currentWallet) {
      toast.error("Please select a wallet first");
      return;
    }
    setIsLoading({ ...isLoading, deployNFTToken: true });
    try {
      const nftContract = await deployNFtToken(
        currentWallet,
        "phantom og",
        "PHOG"
      );

      setNftContract(nftContract as NFTContract);
      toast.success("NFT Token deployed successfully!");
    } catch (error) {
      toast.error("Failed to deploy token: " + (error as Error).message);
    } finally {
      setIsLoading({ ...isLoading, deployNFTToken: false });
    }
  };

  const handleMintNFT = async () => {
    if (!nftContract || !currentWallet || tokenId === 0) {
      console.error("no contract or addrees or token id is 0");
      return;
    }
    try{
      setIsLoading({ ...isLoading, isMintingNFT: true });
      const tx = await nftContract.methods
        .mint(AztecAddress.fromString(nftMintAddress), tokenId)
        .send();
      console.log(`Sent nft mint transaction ${await tx.getTxHash()}`);
      toast.success("NFT minted successfully");
      const receipt = await tx.wait();
      console.log(`Transaction has been mined on block ${receipt.blockNumber}`);
    }
    catch(e){
      console.error("Error in minting NFT", e);
      toast.error("Error in minting NFT");
    }
   finally {
    setIsLoading({ ...isLoading, isMintingNFT: false });
  }
  };

  const handlePublicTransferNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error("no contract or addrees");
      return;
    }
    try {
      setIsLoading({ ...isLoading, isPublicTransferNFT: true });
      const tx = await nftContract.methods
        .transfer_in_public(
          currentWallet.getAddress(),
          AztecAddress.fromString(nftMintAddress),
          tokenId,
          0
        )
        .send();
      console.log(`Sent public transfer transaction ${await tx.getTxHash()}`);
      toast.success("NFT transferred successfully");
      const receipt = await tx.wait();
      console.log(`Transaction has been mined on block ${receipt.blockNumber}`);
    } catch (e) {
      console.error("Error in public transfer", e);
      toast.error("Error in public transfer of NFT");
    } finally {
      setIsLoading({ ...isLoading, isPublicTransferNFT: false });
    }
  };

  const handleFetchNFTOwner = async () => {
    if (!nftContract || !currentWallet) {
      console.error("no contract or addrees");
      return;
    }
    try{
      setIsLoading({ ...isLoading, isFetchOwner: true });
    const owner = await nftContract.methods.owner_of(tokenId).simulate();
    console.log(`Owner of NFT is ${tokenId}: ${owner}`);
    toast.success(`Owner of NFT is ${tokenId}: ${owner}`);
    }
    catch(e){
      console.error("Error in fetching owner", e);
      toast.error("Error in fetching owner");
    }
    finally{
      setIsLoading({ ...isLoading, isFetchOwner: false });
    }
  };

  const handlePrivateTransferNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error("no contract or addrees");
      return;
    }
    try {
      setIsLoading({ ...isLoading, isPrivateTransferNFT: true });

      const tx = await nftContract.methods
        .transfer_to_private(AztecAddress.fromString(nftMintAddress), tokenId)
        .send();
      console.log(`Private transaction ${await tx.getTxHash()}`);
      console.log("Awaiting Transaction to be mined");
      const receipt = await tx.wait();
      console.log(`Transaction has been mined on block ${receipt.blockNumber}`);
      console.log("Private Transaction has been done");
      toast.success("Private transfer of NFT done successfully");
    } catch (e) {
      console.error("Error in private transfer", e);
      toast.error("Error in private transfer of NFT");
    } finally {
      setIsLoading({ ...isLoading, isPrivateTransferNFT: false });
    }
  };

  const handleFetchPrivateNFTTokenId = async (address: any) => {
    let nftToken: [number[], boolean] = [[], false];
    if (!nftContract || !currentWallet) {
      console.error("no contract or addrees");
      return;
    }
    try {
      // const privateAddress =address || currentWallet.getAddress();
      setIsLoading({ ...isLoading, isFetchPrivateToken: true });
      nftToken = await nftContract.methods
        .get_private_nfts(address, 0)
        .simulate();
      toast.success("Private token fetched successfully" + nftToken);
      console.log(`Private token id is ${nftToken}`);
    } catch (error) {
      console.error(error);
      toast.error("Error in fetching private token");
    } finally {
      setIsLoading({ ...isLoading, isFetchPrivateToken: false });
      return nftToken;
    }
  };

  const handleVerify = async () => {
    let privateNFTResponse = await handleFetchPrivateNFTTokenId(
      AztecAddress.fromString(verifyAddress)
    );
    const [tokenIds = []] = privateNFTResponse || [[], false];
    const nonZeroTokenIds = (tokenIds as unknown as bigint[]).filter(
      (nftTokenId: bigint) => nftTokenId !== 0n
    );
    if (nonZeroTokenIds.length === 0) {
      return toast.error(`Current wallet is not an NFT holder`);
    }
    return toast.success("You are an NFT holder");
  };

  return (
    <div className="bg-black bg-opacity-50 rounded-lg p-6 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4">NFT Actions</h2>
      <button
        onClick={handleDeplyNftToken}
        className=" mb-4 mt-4 w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
        disabled={isLoading.deployNFTToken}
      >
        {isLoading.deployNFTToken ? (
          <Loader className="animate-spin mr-2" />
        ) : null}
        Deploy NFT Contract
      </button>

      {/* mint nft contract flow  */}

      <div className="grid grid-cols-2 gap-4 ">
        <input
          type="number"
          className="bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => {
            setTokenId(+e.target.value);
          }}
        />

        <input
          type="text"
          className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Receiver Address"
          value={nftMintAddress}
          onChange={(e) => {
            setNFTMintAddress(e.target.value);
          }}
        />
        <button
          onClick={handleMintNFT}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
          disabled={isLoading.isMintingNFT}
        >
          {isLoading.isMintingNFT ? (
            <Loader className="animate-spin mr-2" />
          ) : null}
          Mint New NFT
        </button>

        <button
          onClick={handlePublicTransferNFT}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
          disabled={isLoading.isPublicTransferNFT}
        >
          {isLoading.isPublicTransferNFT ? (
            <Loader className="animate-spin mr-2" />
          ) : null}
          Public Transfer
        </button>
      </div>

      <input
        type="number"
        className=" mb-4 mt-4 bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => {
          setTokenId(+e.target.value);
        }}
      />
      <button
        onClick={handleFetchNFTOwner}
        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
        disabled={isLoading.isFetchOwner}
      >
        {isLoading.isFetchOwner ? (
          <Loader className="animate-spin mr-2" />
        ) : null}
        Fetch Owner
      </button>
      {/** Private Transfer NFT Flow  Starts*/}
      {/* token id */}
      <div className="grid grid-cols-2 gap-4 mb-4 mt-4">
        <input
          type="number"
          className=" bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => {
            setTokenId(+e.target.value);
          }}
        />
        <input
          type="text"
          className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Receiver Address"
          value={nftMintAddress}
          onChange={(e) => {
            setNFTMintAddress(e.target.value);
          }}
        />
        <button
          onClick={handlePrivateTransferNFT}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
          disabled={isLoading.isPrivateTransferNFT}
        >
          {isLoading.isPrivateTransferNFT ? (
            <Loader className="animate-spin mr-2" />
          ) : null}
          Private Transfer
        </button>
        <button
          onClick={() =>
            handleFetchPrivateNFTTokenId(currentWallet?.getAddress())
          }
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
          disabled={isLoading.isFetchPrivateToken}
        >
          {isLoading.isFetchPrivateToken ? (
            <Loader className="animate-spin mr-2" />
          ) : null}
          Fetch Private Token
        </button>
      </div>

      <div className="flex gap gap-4 ">
        <input
          type="text"
          className="bg-gray-800 text-white px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Verifier Address"
          value={verifyAddress}
          onChange={(e) => {
            setNFTVerifyAddress(e.target.value);
          }}
        />
        <button
          onClick={handleVerify}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white w-96 px-4 py-3 rounded-md flex items-center justify-center hover:from-indigo-600 hover:to-purple-600 transition-all"
        >
          Verify Wallet
        </button>
      </div>
    </div>
  );
};
