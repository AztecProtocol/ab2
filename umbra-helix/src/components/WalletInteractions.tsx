import React, { useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentWalletAtom, nftContractAtom, walletsAtom } from "../atoms.js";
import { useAccount } from "../hooks/useAccounts.js";
import { Spinner } from "./Spinnner.js";
import {
  AztecAddress,
  Fr,
  PXE,
} from "@aztec/aztec.js";
import chalk from "chalk";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { useLoadAccountFromStorage } from "../hooks/useLoadAccountsFromStorage.js";

export const WalletInteractions = ({ pxe }: { pxe: PXE }) => {
  const pxeClient = pxe;
  const [isInProgressObj, setIsInProgressObj] = useState<{
    [key: string]: boolean;
  }>({});
  const [nftContract, setNFTContract] = useAtom(nftContractAtom);
  const [NFTMintAddress, setNFTMintAddress] = useState("");
  const [currentWallet, setCurrentWallet] = useAtom(currentWalletAtom)

  const { createAccount, isCreating, deployNFTContract } = useAccount(pxeClient)
  const [tokenId, setTokenId] = useState(0)

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");
  const wallets = useAtomValue(walletsAtom)
  useLoadAccountFromStorage(pxe)


  const handleDeployNFTContract = async () => {
    if (!currentWallet) {
      console.error("Current Wallet not found!");
      return;
    }
    setIsInProgressObj({ ...isInProgressObj, nftContract: true });
    console.log("Deploying token");
    const nftContract = await deployNFTContract(
      currentWallet,
      "Umbra OG",
      "UMOG"
    );
    setNFTContract(nftContract);

    setIsInProgressObj({ ...isInProgressObj, nftContract: false });
  };

  const handleMintNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error("no contract or addrees");
      return;
    }
    try {
      setIsInProgressObj({ ...isInProgressObj, isMintingNFT: true });
      const tx = await nftContract.methods
        .mint(AztecAddress.fromString(NFTMintAddress), tokenId)
        .send();

      console.log(`Sent nft mint transaction ${await tx.getTxHash()}`);
      console.log(chalk.blackBright("Awaiting transaction to be mined"));
      const receipt = await tx.wait();
      console.log(
        chalk.green(
          `Transaction has been mined on block ${chalk.bold(receipt.blockNumber)}`
        )
      );
      toast.success(`NFT Minted successfully`)
    } catch (error: any) {
      toast.error(`NFT Mint error`, error.toString())
    } finally {
      setIsInProgressObj({ ...isInProgressObj, isMintingNFT: false });
    }
  };

  const handlePublicTransferNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error("no contract or addrees");
      return;
    }
    setIsInProgressObj({
      ...isInProgressObj,
      isPublicTransferNFTInProgress: true,
    });
    const tx = await nftContract.methods
      .transfer_in_public(
        currentWallet.getAddress(),
        AztecAddress.fromString(NFTMintAddress),
        tokenId,
        0
      )
      .send();

    console.log(`Sent public nft transfer transaction ${await tx.getTxHash()}`);
    console.log(chalk.blackBright("Awaiting transaction to be mined"));
    const receipt = await tx.wait();
    console.log(
      chalk.green(
        `Transaction has been mined on block ${chalk.bold(receipt.blockNumber)}`
      )
    );
    setIsInProgressObj({
      ...isInProgressObj,
      isPublicTransferNFTInProgress: false,
    });
  };

  const handleFetchNFTOwner = async () => {
    if (!nftContract) {
      console.error("no contract or addrees");
      return;
    }

    try {
      setIsInProgressObj({ ...isInProgressObj, isFetchingNFTOwner: true });
      const owner = await nftContract.methods.owner_of(tokenId).simulate();
      toast.success(`Owner of token Id ${tokenId}: ${owner}`);
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsInProgressObj({ ...isInProgressObj, isFetchingNFTOwner: false });
    }
  };

  const handlePreaparePrivateTransferNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error("no contract or addrees");
      return;
    }

    try {
      setIsInProgressObj({
        ...isInProgressObj,
        isPreparePrivateTransferNFTInProgress: true,
      });
      const slotRandomness = Fr.random();
      // const tx = await nftContract.methods.prepare_transfer_to_private(currentWallet.getAddress(), AztecAddress.fromString(NFTMintAddress), slotRandomness).send()
      const tx = await nftContract.methods
        .transfer_to_private(AztecAddress.fromString(NFTMintAddress), tokenId)
        .send();
      console.log(`Private transfer transaction ${await tx.getTxHash()}`);
      console.log(chalk.blackBright("Awaiting transaction to be mined"));
      const receipt = await tx.wait();
      console.log(
        chalk.green(
          `Transaction has been mined on block ${chalk.bold(
            receipt.blockNumber
          )}`
        )
      );
      toast.success("Private Transfer  done");
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsInProgressObj({
        ...isInProgressObj,
        isPreparePrivateTransferNFTInProgress: false,
      });
    }
  };

  const handleFetchPrivateNFTTokenIds = async () => {
    let nfts: [number[], boolean] = [[], false];
    if (!nftContract || !currentWallet) {
      console.error("no contract or addrees");
      return nfts;
    }

    try {
      setIsInProgressObj({
        ...isInProgressObj,
        isFetchPrivateNFTTokenIds: true,
      });
      nfts = await nftContract.methods
        .get_private_nfts(currentWallet.getAddress(), 0)
        .simulate();
      toast.success(`Private NFTS: ${nfts}`);
    } catch (error: any) {
      toast.error(error.toString());
    } finally {
      setIsInProgressObj({
        ...isInProgressObj,
        isFetchPrivateNFTTokenIds: false,
      });
      return nfts;
    }
  };

  const handleVerifyWallet = async () => {
    //!! I commented this line because after fixing route issue /verify route was giving error of /verify route not found
    // const pathname = window.location.pathname;
    // const pathParts = pathname.split("/").filter((path) => path !== "");
    // if (pathParts.length !== 2 || pathParts[0] !== "verify") {
    //   return toast.error(`Invalid path. path should follow /verify/<token>`);
    // }
    let privateNFTResponse = await handleFetchPrivateNFTTokenIds();
    console.log("PRIVATEN NFT RESPONSE", privateNFTResponse);
    const [tokenIds = [], isMoreNfts] = privateNFTResponse;
    // console.log("Private NFTS", privateNFTs)

    const nonZeroTokenIds = tokenIds.filter(
      (nftTokenId: number) => nftTokenId !== 0
    );
    if (nonZeroTokenIds.length === 0) {
      return toast.error(`Current wallet is not an NFT holder`);
    }

    toast.success(
      "You are an NFT holder \n So you assigned a role of the NFT owner in our discord server"
    );

    try {
      console.log("verifying role");
      //TODO : HERE ARE THE MAIN CODE TO VERIFY ROLE
      const response = await fetch(
        //!! This code is printing like http://localhost:5173/undefined/api/verify-role  i think the reason is it's not in the API folder
        `${process.env.REACT_APP_API_URL}/api/verify-role`,
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
        setTimeout(() => {
          window.close();
        }, 3000);

        console.log("verified role");
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (err) {
      console.log("ERROR in verify", err);
      // setError(err.message || "Failed to verify. Please try again.");
    } finally {
      // setVerifying(false);
    }
  };

  return (
    <main className="h-screen w-full p-4 md:p-8">
      <h1 className="mb-4"> Wallet Interactions</h1>
      <div className="grid md:grid-cols-2 gap-4 md:gap-8">
        <div className="flex-1">
          <hr />
          {wallets.map((wallet, idx) => (
            <button
              key={wallet.getAddress().toShortString()}
              onClick={() => {
                setCurrentWallet(wallet);
              }}
              className={`btn ${currentWallet === wallet ? "btn-primary" : "btn-secondary"
                } `}
            >
              Wallet{idx + 1}
            </button>
          ))}
          <hr />
          <div className="actions mt-4 flex flex-col border px-8 gap-6 py-4 rounded-md bg-primary/10 border-primary/10">
            {/* <button onClick={() => interactWithCounter(pxeClient!)}> Wallet Interaction</button> */}
            <button onClick={createAccount} className="btn btn-primary">
              Create New Wallet {isCreating && <Spinner />}
            </button>
            <button
              onClick={handleDeployNFTContract}
              className="flex items-center btn btn-primary"
            >
              Deploy NFT Contract {isInProgressObj.nftContract && <Spinner />}
            </button>
          </div>

          {/** Mint NFT Flow  Starts*/}
          <hr />
          <div className="border border-primary/20 rounded-md p-8 flex flex-col gap-2 mt-4">
            <h3> Mint NFT</h3>
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                type="number"
                className="grow"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => {
                  setTokenId(+e.target.value);
                }}
              />
            </label>
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                type="text"
                className="grow"
                placeholder="Receiver Address"
                value={NFTMintAddress}
                onChange={(e) => {
                  setNFTMintAddress(e.target.value);
                }}
              />
            </label>
            <button className="btn btn-primary" onClick={handleMintNFT}>
              Mint New NFT {isInProgressObj.isMintingNFT && <Spinner />}
            </button>
          </div>
          <hr />
          {/** Mint NFT Flow  Ends*/}

          {/** Public Transfer NFT Flow  Starts*/}
          <hr />
          <div className="border border-primary/20 rounded-md p-8 flex flex-col gap-2 mt-4">
            <h3> Public Transfer NFT</h3>
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                type="number"
                className="grow"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => {
                  setTokenId(+e.target.value);
                }}
              />
            </label>
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                type="text"
                className="grow"
                placeholder="Receiver Address"
                value={NFTMintAddress}
                onChange={(e) => {
                  setNFTMintAddress(e.target.value);
                }}
              />
            </label>
            <button
              className="btn btn-primary"
              onClick={handlePublicTransferNFT}
            >
              Transfer{" "}
              {isInProgressObj.isPublicTransferNFTInProgress && <Spinner />}
            </button>
          </div>
          <hr />
          {/** Public Transfer NFT Flow  Ends*/}

          {/** Fetch NFT Owner Flow  Starts*/}
          <hr />
          <div className="border border-primary/20 rounded-md p-8 flex flex-col gap-2 mt-4">
            <h3> Check NFT Owner </h3>
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                type="number"
                className="grow"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => {
                  setTokenId(+e.target.value);
                }}
              />
            </label>
            <button className="btn btn-primary" onClick={handleFetchNFTOwner}>
              Fetch Owner {isInProgressObj.isFetchingNFTOwner && <Spinner />}
            </button>

            <button className="btn btn-primary" onClick={handleVerifyWallet}>
              Verify Wallet {isInProgressObj.verifyWallet && <Spinner />}
            </button>
          </div>
          <hr />
          {/** Fetch NFT Owner Flow  Ends*/}

          {/** Private Transfer NFT Flow  Starts*/}
          <hr />
          <div className="border border-primary/20 rounded-md p-8 flex flex-col gap-2 mt-4">
            <h3>Public to Private NFT Transfer</h3>
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                type="number"
                className="grow"
                placeholder="Token ID"
                value={tokenId}
                onChange={(e) => {
                  setTokenId(+e.target.value);
                }}
              />
            </label>
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                type="text"
                className="grow"
                placeholder="Receiver Address"
                value={NFTMintAddress}
                onChange={(e) => {
                  setNFTMintAddress(e.target.value);
                }}
              />
            </label>
            <button
              className="btn btn-secondary"
              onClick={handlePreaparePrivateTransferNFT}
            >
              Prepare for Transfer{" "}
              {isInProgressObj.isPreparePrivateTransferNFTInProgress && (
                <Spinner />
              )}
            </button>

          </div>
          <hr />
          {/** Private Transfer NFT Flow  Ends*/}

          <button
            className="btn btn-secondary"
            onClick={handleFetchPrivateNFTTokenIds}
          >
            {" "}
            Fetch Private NFTS{" "}
            {isInProgressObj.isFetchPrivateNFTTokenIds && <Spinner />}
          </button>
        </div>
        <div className="output border border-primary/10 rounded-md flex flex-1 bg-primary/60 text-black flex-col gap-2 p-8">
          {currentWallet && (
            <p className="break-all">
              Current Wallet Address:
              <span className="bg-secondary text-white rounded-lg p-2 inline-block font-medium">
                {currentWallet.getAddress().toString()}
              </span>
            </p>
          )}
          {nftContract && (
            <p className="break-all">
              Deployed NFT Contract Address:
              <span className="bg-secondary text-white rounded-lg p-2 inline-block font-medium">
                {nftContract.address.toString()}
              </span>
            </p>
          )}
        </div>
      </div>
    </main>
  );
};
