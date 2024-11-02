import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { currentWalletAtom, nftContractAtom } from "../atoms.js";
import { Spinner } from "./Spinnner.js";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { PXE, readFieldCompressedString } from "@aztec/aztec.js";

export const VerifyWallet = ({ pxe }: { pxe: PXE }) => {
  const [currentWallet] = useAtom(currentWalletAtom);
  const [nftContract] = useAtom(nftContractAtom);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const [isFetching, setIsFetching] = useState(false)
  const [nftName, setNFTName] = useState('')
  const [nftSymbol, setNFTSymbol] = useState('')


  useEffect(() => {
    if (nftContract) {
      setIsFetching(true)
      Promise.all([nftContract.methods.public_get_name?.().simulate(), nftContract.methods.public_get_symbol?.().simulate(),])
        .then(([nftName, nftSymbol]) => {
          console.log({ nftName, nftSymbol });
          const nftNameStr = readFieldCompressedString(nftName)
          setNFTName(nftNameStr);
          setNFTSymbol(readFieldCompressedString(nftSymbol))
        })
        .catch((error: any) => {
          console.error("Failed to fetch NFT name and symbol")
          toast.error("Failed to fetch NFT name and symbol", error)
        }).finally(() => {
          setIsFetching(false)
        })
    }
  }, [nftContract])


  const handleVerification = async () => {
    if (!currentWallet || !nftContract) {
      toast.error("Please connect your wallet using the header menu");
      return;
    }

    try {
      setIsVerifying(true);

      // Fetch private NFTs
      const [tokenIds = [], isMoreNfts] = await nftContract.methods
        .get_private_nfts(currentWallet.getAddress(), 0)
        .simulate();
      console.log("Token IDS", tokenIds)
      const nonZeroTokenIds = tokenIds.filter(
        (nftTokenId: bigint) => nftTokenId !== 0n
      );
      console.log("Token IDs", tokenIds)

      if (nonZeroTokenIds.length === 0) {
        toast.error("You don't own any NFTs from this collection");
        return;
      }

      // Call API to verify role
      const response = await fetch(
        `http://localhost:3000/api/verify-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setIsVerified(true);
        toast.success("Verification successful! You can now close this window.");
        setTimeout(() => {
          window.close();
        }, 5000);
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (error: any) {
      toast.error(`Verification failed: ${error.toString()}`);
    } finally {
      setIsVerifying(false);
    }
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Invalid Verification Request</h2>
          <p className="text-gray-600">Missing user ID parameter. Please try the verification through Discord.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10 p-4 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <h1 className="text-2xl md:text-3xl font-bold text-center">
              NFT Ownership Verification
            </h1>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            {nftContract && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="space-y-3">
                  <div className="flex space-x-4 items-center">
                    <h3 className="font-medium text-gray-700">Collection Name: </h3>
                    <p className="text-lg font-semibold text-black">
                      {isFetching ? <span>Loading...</span> : <span>{nftName}</span>}
                    </p>
                  </div>
                  <div className="flex space-x-4 items-center">
                    <h3 className="font-medium text-gray-700">Symbol: </h3>
                    <p className="text-lg font-semibold text-black">
                      {isFetching ? <span>Loading...</span> : <span>{nftSymbol}</span>}
                    </p>
                  </div>
                  <div className="flex space-x-4 items-center">
                    <h3 className="font-medium text-gray-700">Address: </h3>
                    <p className="text-lg font-semibold text-black">
                      {nftContract.address.toShortString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Status and Button */}
            <div className="text-center space-y-6">
              {isVerified ? (
                <div className="p-6 bg-green-50 rounded-lg">
                  <div className="text-green-600 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Verification Successful!
                  </h3>
                  <p className="text-green-600">
                    You can now close this window and return to Discord.
                    Your NFT OWNER role has been assigned.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Click the button below to verify your NFT ownership and receive the NFT OWNER role in Discord.
                  </p>
                  <button
                    onClick={handleVerification}
                    disabled={isVerifying || !currentWallet || !nftContract}
                    className="inline-flex items-center justify-center px-8 py-4 text-lg
                             bg-gradient-to-r from-primary to-secondary text-white font-semibold
                             rounded-xl hover:opacity-90 transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-lg hover:shadow-xl w-full md:w-auto"
                  >
                    {isVerifying ? (
                      <>
                        <Spinner />
                        <span className="ml-2">Verifying...</span>
                      </>
                    ) : (
                      'Verify NFT Ownership'
                    )}
                  </button>

                  {(!currentWallet || !nftContract) && (
                    <p className="text-sm text-gray-500">
                      Please ensure your wallet is connected using the header menu
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};