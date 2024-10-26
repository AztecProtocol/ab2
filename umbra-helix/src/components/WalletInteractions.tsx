import React, { useState } from 'react'
// import { createAccount } from '../handlers/create-account.js'
// import { CREATE_ACCOUNT_DEFAULT_PARAMS } from '../constants.js'
import { useAtomValue } from 'jotai'
import { pxeAtom } from '../atoms.js'
// import { interactWithCounter } from '../utils/setup.js'
import { useAccount } from '../hooks/useAccounts.js'
import { Spinner } from './Spinnner.js'
// import { FeeOpts } from '../utils/options/fees.js'
import {
  AccountWalletWithSecretKey,
  AztecAddress,
  AztecAddressLike,
  computeSecretHash,
  Contract,
  ExtendedNote,
  Fr,
  Note,
  PXE,

} from '@aztec/aztec.js'
import chalk from 'chalk'
import { toast } from 'react-hot-toast'
import { TokenContract } from '@aztec/noir-contracts.js'
import { NFTContract } from '@aztec/noir-contracts.js/NFT'
import { pedersenHash } from '@aztec/foundation/crypto'

const TRANSIENT_STORAGE_SLOT_PEDERSEN_INDEX = 3

export const WalletInteractions = ({ pxe }: { pxe: PXE }) => {
  // const pxeClient = useAtomValue(pxeAtom)
  const pxeClient = pxe
  const { deployToken, createAccount, deployNFTContract } = useAccount()
  const [wallets, setWallets] = useState<AccountWalletWithSecretKey[]>([])
  const [customWallets, setCustomWallets] = useState<AccountWalletWithSecretKey[]>([])
  const [currentWallet, setCurrentWallet] = useState<AccountWalletWithSecretKey | null>(null)
  const [isInProgressObj, setIsInProgressObj] = useState<{
    [key: string]: boolean
  }>({})
  const [tokenContract, setTokenContract] = useState<TokenContract | null>(null)
  const [nftContract, setNFTContract] = useState<NFTContract | null>(null)
  const [receipentAddress, setReceipentAddress] = useState('')
  const [transferAmount, setTransferAmount] = useState<number>(0)
  const [shieldAmount, setShiedAmount] = useState<number>(0)

  const [tokenId, setTokenId] = useState(0)
  const [NFTMintAddress, setNFTMintAddress] = useState('')

  const [storageSlotRandomness, setStorageSlotRandomness] = useState<Fr | null>(null)


  const handleCreateAccount = async () => {
    setIsInProgressObj({ ...isInProgressObj, createAccount: true })
    // // createAccount({client: pxeAtom, ...CREATE_ACCOUNT_DEFAULT_PARAMS});
    const wallet = await createAccount(pxeClient!)
    if (wallet) {
      setWallets([...wallets, wallet])
    }
    setIsInProgressObj({ ...isInProgressObj, createAccount: false })
  }

  const handleDeployToken = async () => {
    if (!currentWallet) {
      console.error('Current Wallet not found!')
      return
    }
    setIsInProgressObj({ ...isInProgressObj, deployToken: true })
    console.log('Deploying token')
    const tokenContract = await deployToken(currentWallet)
    setTokenContract(tokenContract)

    setIsInProgressObj({ ...isInProgressObj, deployToken: false })
  }

  const handleDeployNFTContract = async () => {
    if (!currentWallet) {
      console.error('Current Wallet not found!')
      return
    }
    setIsInProgressObj({ ...isInProgressObj, nftContract: true })
    console.log('Deploying token')
    const nftContract = await deployNFTContract(currentWallet, 'Umbra OG', 'UMOG')
    setNFTContract(nftContract)

    setIsInProgressObj({ ...isInProgressObj, nftContract: false })
  }

  const handleMintPublic100 = async () => {
    if (!tokenContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }
    setIsInProgressObj({ ...isInProgressObj, mintPublic: true })
    const tx = await tokenContract.methods.mint_public(currentWallet.getAddress(), 100n).send()

    console.log(`Sent mint transaction ${await tx.getTxHash()}`)
    console.log(chalk.blackBright('Awaiting transaction to be mined'))
    const receipt = await tx.wait()
    console.log(
      chalk.green(`Transaction has been mined on block ${chalk.bold(receipt.blockNumber)}`)
    )
    setIsInProgressObj({ ...isInProgressObj, mintPublic: false })
  }

  const handleMintPrivate100 = async () => {
    if (!tokenContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }

    setIsInProgressObj({ ...isInProgressObj, mintPrivate: true })
    const random = Fr.random()
    const secretHash = await computeSecretHash(random)

    const tx = await tokenContract.methods.mint_private(100n, secretHash).send()
    console.log(`Sent mint transaction ${await tx.getTxHash()}`)
    console.log(chalk.blackBright('Awaiting transaction to be mined'))
    const receipt = await tx.wait()
    console.log(
      chalk.green(`Transaction has been mined on block ${chalk.bold(receipt.blockNumber)}`)
    )
    const note = new Note([new Fr(100n), secretHash])
    const extendedNote = new ExtendedNote(
      note,
      currentWallet.getAddress(),
      tokenContract.address,
      TokenContract.storage.pending_shields.slot,
      TokenContract.notes.TransparentNote.id,
      receipt.txHash
    )
    await currentWallet.addNote(extendedNote)

    console.log(
      chalk.bgBlueBright(
        `Redeeming created note for second wallet: ${currentWallet.getAddress()} \n`
      )
    )

    const tx1 = await tokenContract.methods
      .redeem_shield(currentWallet.getAddress(), 100n, random)
      .send()
    console.log(`Sent mint transaction ${await tx.getTxHash()}`)
    console.log(chalk.blackBright('Awaiting transaction to be mined'))
    const receipt1 = await tx1.wait()
    console.log(
      chalk.green(`Transaction has been mined on block ${chalk.bold(receipt1.blockNumber)}`)
    )
    setIsInProgressObj({ ...isInProgressObj, mintPrivate: false })
  }

  const checkBalancePublic = async () => {
    if (!tokenContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }

    const balance = await tokenContract.methods
      .balance_of_public(currentWallet.getAddress())
      .simulate()
    toast.success(
      `Public Balance of address ${currentWallet.getAddress().toShortString()}: ${balance}`
    )
  }

  const checkBalancePrivate = async () => {
    if (!tokenContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }

    const balance = await tokenContract.methods
      .balance_of_private(currentWallet.getAddress())
      .simulate()
    toast.success(
      `Private Balance of address ${currentWallet.getAddress().toShortString()}: ${balance}`
    )
  }

  const handlePublicTransfer = async () => {
    if (!receipentAddress || transferAmount === 0 || !tokenContract || !currentWallet) {
      return toast.error(`Invalid call`)
    }
    try {
      setIsInProgressObj({ ...isInProgressObj, transferPublic: true })

      const tx = tokenContract.methods
        .transfer_public(
          currentWallet.getAddress(),
          AztecAddress.fromString(receipentAddress),
          BigInt(transferAmount),
          BigInt(0)
        )
        .send()
      console.log(`Sent mint transaction ${await tx.getTxHash()}`)
      console.log(chalk.blackBright('Awaiting transaction to be mined'))
      const receipt1 = await tx.wait()
      console.log(
        chalk.green(`Transaction has been mined on block ${chalk.bold(receipt1.blockNumber)}`)
      )
    } catch (e: any) {
      toast.error(e.toString())
    } finally {
      setIsInProgressObj({ ...isInProgressObj, transferPublic: false })
    }
  }
  const handlePrivateTransfer = async () => {
    if (!receipentAddress || transferAmount === 0 || !tokenContract || !currentWallet) {
      return toast.error(`Invalid call`)
    }

    try {
      setIsInProgressObj({ ...isInProgressObj, transferPrivate: true })
      const tx = await tokenContract.methods
        .transfer(receipentAddress as any as AztecAddress, transferAmount)
        .send()
      console.log(`Sent mint transaction ${await tx.getTxHash()}`)
      console.log(chalk.blackBright('Awaiting transaction to be mined'))
      const receipt1 = await tx.wait()
      console.log(
        chalk.green(`Transaction has been mined on block ${chalk.bold(receipt1.blockNumber)}`)
      )
    } catch (e: any) {
      toast.error(e.toString())
    } finally {
      setIsInProgressObj({ ...isInProgressObj, transferPrivate: false })
    }
  }

  const handleShield = async () => {
    if (shieldAmount === 0 || !tokenContract || !currentWallet) {
      return toast.error(`Invalid call`)
    }
    try {
      setIsInProgressObj({ ...isInProgressObj, shield: true })
      const secret = Fr.random()
      const secret_hash = computeSecretHash(secret)
      const tx = await tokenContract.methods
        .shield(currentWallet.getAddress(), shieldAmount, secret_hash, 0)
        .send()
      console.log(`Sent mint transaction ${await tx.getTxHash()}`)
      console.log(chalk.blackBright('Awaiting transaction to be mined'))
      const receipt1 = await tx.wait()
      console.log(
        chalk.green(`Transaction has been mined on block ${chalk.bold(receipt1.blockNumber)}`)
      )
    } catch (e: any) {
      toast.error(e.toString())
    } finally {
      setIsInProgressObj({ ...isInProgressObj, shield: false })
    }
  }

  const handleFetchPendingShields = async () => { }

  const handleCreateCustomAccount = async () => {
    // setIsInProgressObj({ ...isInProgressObj, createCustomAccount: true })
    // // // createAccount({client: pxeAtom, ...CREATE_ACCOUNT_DEFAULT_PARAMS});
    // const customWallet = await createNewCustomAccount(pxeClient!)
    // if (customWallet) {
    //   setCustomWallets([...customWallets, customWallet])
    // }
    // setIsInProgressObj({ ...isInProgressObj, createCustomAccount: false })
  }

  const handleMintNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }
    setIsInProgressObj({ ...isInProgressObj, isMintingNFT: true })
    const tx = await nftContract.methods.mint(AztecAddress.fromString(NFTMintAddress), tokenId).send()

    console.log(`Sent nft mint transaction ${await tx.getTxHash()}`)
    console.log(chalk.blackBright('Awaiting transaction to be mined'))
    const receipt = await tx.wait()
    console.log(
      chalk.green(`Transaction has been mined on block ${chalk.bold(receipt.blockNumber)}`)
    )
    setIsInProgressObj({ ...isInProgressObj, isMintingNFT: false })
  }

  const handlePublicTransferNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }
    setIsInProgressObj({ ...isInProgressObj, isPublicTransferNFTInProgress: true })
    const tx = await nftContract.methods.transfer_in_public(currentWallet.getAddress(), AztecAddress.fromString(NFTMintAddress), tokenId, 0).send()

    console.log(`Sent public nft transfer transaction ${await tx.getTxHash()}`)
    console.log(chalk.blackBright('Awaiting transaction to be mined'))
    const receipt = await tx.wait()
    console.log(
      chalk.green(`Transaction has been mined on block ${chalk.bold(receipt.blockNumber)}`)
    )
    setIsInProgressObj({ ...isInProgressObj, isPublicTransferNFTInProgress: false })
  }

  const handleFetchNFTOwner = async () => {
    if (!nftContract) {
      console.error('no contract or addrees')
      return
    }

    try {
      setIsInProgressObj({ ...isInProgressObj, isFetchingNFTOwner: true })
      const owner = await nftContract.methods.owner_of(tokenId).simulate();
      toast.success(
        `Owner of token Id ${tokenId}: ${owner}`
      )
    } catch (error: any) {
      toast.error(error.toString())
    } finally {
      setIsInProgressObj({ ...isInProgressObj, isFetchingNFTOwner: false })
    }
  }

  const handlePreaparePrivateTransferNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }

    try {
      setIsInProgressObj({ ...isInProgressObj, isPreparePrivateTransferNFTInProgress: true })
      setStorageSlotRandomness(null)
      const slotRandomness = Fr.random();
      // const tx = await nftContract.methods.prepare_transfer_to_private(currentWallet.getAddress(), AztecAddress.fromString(NFTMintAddress), slotRandomness).send()
      const tx = await nftContract.methods.transfer_to_private(AztecAddress.fromString(NFTMintAddress), tokenId).send()
      console.log(`Private transfer transaction ${await tx.getTxHash()}`)
      console.log(chalk.blackBright('Awaiting transaction to be mined'))
      const receipt = await tx.wait()
      console.log(
        chalk.green(`Transaction has been mined on block ${chalk.bold(receipt.blockNumber)}`)
      )
      setStorageSlotRandomness(slotRandomness)
      toast.success('Private Transfer  done')
    } catch (error: any) {
      toast.error(error.toString())
    } finally {
      setIsInProgressObj({ ...isInProgressObj, isPreparePrivateTransferNFTInProgress: false })
    }
  }

  const handleFinalizePrivateTransferNFT = async () => {
    if (!nftContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }
    if (storageSlotRandomness === null) {
      return toast.error(`Storage slot randomness shouldn't be null`)
    }

    const commitment = pedersenHash([currentWallet.getAddress().toField(), storageSlotRandomness], TRANSIENT_STORAGE_SLOT_PEDERSEN_INDEX)
    try {
      setIsInProgressObj({ ...isInProgressObj, isFinalizePrivateTransferNFTInProgress: true })
      const tx = await nftContract.methods.finalize_transfer_to_private(tokenId, commitment).send()
      console.log(`Private transfer transaction ${await tx.getTxHash()}`)
      console.log(chalk.blackBright('Awaiting transaction to be mined'))
      const receipt = await tx.wait()
      console.log(
        chalk.green(`Transaction has been mined on block ${chalk.bold(receipt.blockNumber)}`)
      )
      return toast.success('Private Transfer finalize step done')

    } catch (error: any) {
      return toast.error(error.toString())
    } finally {
      setIsInProgressObj({ ...isInProgressObj, isFinalizePrivateTransferNFTInProgress: false })
      return
    }
  }

  const handleFetchPrivateNFTTokenIds = async () => {
    if (!nftContract || !currentWallet) {
      console.error('no contract or addrees')
      return
    }

    try {
      setIsInProgressObj({ ...isInProgressObj, isFetchPrivateNFTTokenIds: true })
      const nfts = await nftContract.methods.get_private_nfts(currentWallet.getAddress(), 0).simulate()
      return toast.success(`Private NFTS: ${nfts}`)

    } catch (error: any) {
      return toast.error(error.toString())
    } finally {
      setIsInProgressObj({ ...isInProgressObj, isFetchPrivateNFTTokenIds: false })
      return
    }
  }


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
                setCurrentWallet(wallet)
              }}
              className={`btn ${currentWallet === wallet ? 'btn-primary' : 'btn-secondary'} `}
            >
              Wallet{idx + 1}
            </button>
          ))}
          <hr />
          <h4>Custom Accounts</h4>
          {customWallets.map((wallet, idx) => (
            <button
              key={wallet.getAddress().toShortString()}
              onClick={() => {
                setCurrentWallet(wallet)
              }}
              className={`btn ${currentWallet === wallet ? 'btn-primary' : 'btn-secondary'} `}
            >
              Custom Wallet{idx + 1}
            </button>
          ))}
          <hr />
          <div className="actions mt-4 flex flex-col border px-8 gap-6 py-4 rounded-md bg-primary/10 border-primary/10">
            {/* <button onClick={() => interactWithCounter(pxeClient!)}> Wallet Interaction</button> */}
            <button onClick={handleCreateAccount} className="btn btn-primary">
              Create New Wallet {isInProgressObj.createAccount && <Spinner />}
            </button>
            <button onClick={handleCreateCustomAccount} className="btn btn-primary">
              Create New Custom Wallet {isInProgressObj.createCustomAccount && <Spinner />}
            </button>
            <button onClick={handleDeployToken} className="flex items-center btn btn-primary">
              Deploy Token {isInProgressObj.deployToken && <Spinner />}
            </button>
            <button onClick={handleDeployNFTContract} className="flex items-center btn btn-primary">
              Deploy NFT Contract {isInProgressObj.nftContract && <Spinner />}
            </button>
            <button onClick={handleMintPublic100} className="flex items-center btn btn-primary">
              Mint Public {isInProgressObj.mintPublic && <Spinner />}
            </button>
            <button onClick={handleMintPrivate100} className="flex items-center btn btn-primary">
              Mint Private {isInProgressObj.mintPrivate && <Spinner />}
            </button>
            <button onClick={checkBalancePublic} className="btn btn-primary">
              Check Public Balance
            </button>
            <button onClick={checkBalancePrivate} className="btn btn-primary">
              Check Private Balance
            </button>
          </div>

          <div className="border border-primary/20 rounded-md p-8 flex flex-col gap-2 mt-4">
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                id="receiverAddress"
                type="text"
                className="grow"
                placeholder="Enter Receipent Address"
                data-testid="send/to"
                value={receipentAddress}
                onChange={(e) => {
                  setReceipentAddress(e.target.value)
                }}
              />
            </label>

            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                id="transferAmount"
                type="number"
                className="grow"
                placeholder="Transfer Amount"
                data-testid="send/to"
                value={transferAmount}
                onChange={(e) => {
                  setTransferAmount(+e.target.value)
                }}
              />
            </label>

            <button className="btn btn-primary" onClick={handlePublicTransfer}>
              Public Transfer {isInProgressObj.transferPublic && <Spinner />}
            </button>
            <button className="btn btn-primary" onClick={handlePrivateTransfer}>
              Private Transfer {isInProgressObj.transferPrivate && <Spinner />}
            </button>
          </div>
          <div className="border border-primary/20 rounded-md p-8 flex flex-col gap-2 mt-4">
            <h3> Shield Or Unshield</h3>
            <label className="input flex items-center gap-2 py-7 w-full">
              <input
                id="shieldAmount"
                type="number"
                className="grow"
                placeholder="Shield Balance"
                data-testid="send/to"
                value={shieldAmount}
                onChange={(e) => {
                  setShiedAmount(+e.target.value)
                }}
              />
            </label>
            <button className="btn btn-primary" onClick={handleShield}>
              Shield {isInProgressObj.shield && <Spinner />}
            </button>
            <button className="btn btn-primary" onClick={handleFetchPendingShields}>
              Fetch Pending Shields {isInProgressObj.pendingShields && <Spinner />}
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
                  setTokenId(+e.target.value)
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
                  setNFTMintAddress(e.target.value)
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
                  setTokenId(+e.target.value)
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
                  setNFTMintAddress(e.target.value)
                }}
              />
            </label>
            <button className="btn btn-primary" onClick={handlePublicTransferNFT}>
              Transfer {isInProgressObj.isPublicTransferNFTInProgress && <Spinner />}
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
                  setTokenId(+e.target.value)
                }}
              />
            </label>
            <button className="btn btn-primary" onClick={handleFetchNFTOwner}>
              Fetch Owner {isInProgressObj.isFetchingNFTOwner && <Spinner />}
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
                  setTokenId(+e.target.value)
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
                  setNFTMintAddress(e.target.value)
                }}
              />
            </label>
            <button className='btn btn-secondary' onClick={handlePreaparePrivateTransferNFT}>Prepare for Transfer {isInProgressObj.isPreparePrivateTransferNFTInProgress && <Spinner />}</button>
            <button className="btn btn-primary" onClick={handleFinalizePrivateTransferNFT} disabled={storageSlotRandomness === null}>
              Finalise Transfer {isInProgressObj.isFinalizePrivateTransferNFTInProgress && <Spinner />}
            </button>
          </div>
          <hr />
          {/** Private Transfer NFT Flow  Ends*/}

          <button className='btn btn-secondary' onClick={handleFetchPrivateNFTTokenIds}> Fetch Private NFTS {isInProgressObj.isFetchPrivateNFTTokenIds && <Spinner />}</button>
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
          {tokenContract && (
            <p className="break-all">
              Deployed Token Address:
              <span className="bg-secondary text-white rounded-lg p-2 inline-block font-medium">
                {tokenContract.address.toString()}
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
    </main >
  )
}
