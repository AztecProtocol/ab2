'use client';

import { useState } from "react";
import { useAztec } from "./hooks/AztecHook"

export default function Home() {
  const [isContractExecuting, setIsContractExecuting] = useState<boolean>(false);
  const [indicator, setIndicator] = useState<string>('Hi :)');

  const {setupContract, mintProfileNFT, seeNFTInfo} = useAztec();
  const buttonStyles = 'border rounded p-2 my-4 disabled:bg-gray-700 disabled:cursor-not-allowed';
  const sectionStyles = 'px-8 py-4';

  const initContract = async () => {
    setIndicator('Deploying NFT contract and set accounts.')
    setIsContractExecuting(true);
    await setupContract();
    setIsContractExecuting(false);
    setIndicator('The NFT contract has been deployed and Alice & Bob accounts are ready to use.')
  }

  const mintNFT = async () => {
    setIndicator('Minting a NFT with a note');
    setIsContractExecuting(true);
    const tx = await mintProfileNFT("1990/12/31");
    setIsContractExecuting(false);
    setIndicator(`
      Minted! 

      blockNumber: ${tx.blockNumber},
      transactionFee: ${tx.transactionFee}
    `);
  }

  const checkNFTwithNote = async () => {
    setIndicator(`Getting Alice's NFT with 'is_adult' note`);
    setIsContractExecuting(true);
    const nftList = await seeNFTInfo();
    const [ID, isAdult] = nftList[0];

    setIsContractExecuting(false);

    setIndicator(`
      NFT ID: ${ID}, 
      isAdult: ${isAdult}
    `);
  }

  return (
    <main className="flex min-h-screen flex-col p-24">
      <h1 className='text-3xl'>Aztec Profile.io Social Cipher</h1>

      <section className="relative p-6 m-8 border border-slate-100">
        {
          isContractExecuting &&
          <span className="absolute -top-1 -left-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-sky-500"></span>
          </span>
        }
        <p>Message:</p>
        <p className="text-lime-400">
          {indicator}
        </p>
      </section>
      
      <section className={sectionStyles}>
        <p>
          Set up Aztec NFT contract and accounts. Alice will be a NFT holder.
          You can see more data in the console. Please open the browser inspector.
        </p>
        <button type='button' disabled={isContractExecuting} className={buttonStyles} onClick={initContract}>1. set up contract and accounts</button>
      </section>
      
      <section className={sectionStyles}>
        <p>
          When a NFT is minted, a note will be added. It can be birthdate, gender, nationalities, eye colour, living country, etc. 
          <br />
          In this case, adding a note called "is_adult" which shows whether Alice is an adult or not.
        </p>
        <button type='button' disabled={isContractExecuting} className={buttonStyles} onClick={mintNFT}>2. mint a NFT with birthdate "1990/12/31"</button>
      </section>

      <section className={sectionStyles}>
        <p>
          Alice is the one who minted the NFT. Therefore she can see NFT and its note data.
        </p>
        <button type='button' disabled={isContractExecuting} className={buttonStyles} onClick={checkNFTwithNote}>3. Check NFT with note data</button>
      </section>

      <section className={sectionStyles}>
        <p>
          Bob wants to know whether Alice is an adult or not. Bob requests to Alice a proof. (Work In Progress)
        </p>
        <button type='button' disabled className={buttonStyles}>4. Request proof</button>
      </section>

      <section className={sectionStyles}>
        <p>
          Alice prove that she is an adult. (Work In Progress)
        </p>
        <button type='button' disabled className={buttonStyles}>5. Prove</button>
      </section>
    </main>
  )
}
