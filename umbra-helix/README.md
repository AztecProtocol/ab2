# UmbraHelix

## Overview
UmbraHelix is an Aztec NFT holder verifier for Discord. It also has other useful features like creating collection, minting nft, public and private transfer and to fetch nft owner.

Developers can use UmbraHelix by installing the sdk from npm.



### A. For dApp Developers

```typescript
import { UmbraHelixClient } from '@umbra-helix/client';

// Initialize client
const client = new UmbraHelixClient({
  pxeUrl: 'your-pxe-url',
});

// Create Wallet
const wallet = client.createWallet()

// Create collection
const collection = await client.createCollection({
  name: 'My Collection',
  symbol: 'MC',
  maxSupply: 1000
}, wallet);

// Mint NFT
const nft = await client.mintNFT({
  contractAddress: collection.address,
  recipient: recipientAddress,
  tokenId: tokenId
}, wallet);

// Public Transfer
const nft = await client.publicTransfer({
  contractAddress: collection.address,
  tokenId: tokenId,
  recipient: recipientAddress,
}, wallet);

```



### Local Installation
```bash
# Clone the repository
git clone https://github.com/satyambnsal/ab2

cd umbra-helix

# Install dependencies
bun install


# Start development server
bun run dev
```

### Contract Commands
Custom NFT contract is written in `contracts/nft_contracts` folder

**Note:** *Before running following commands, Please make sure your **aztec sandbox** is running locally with version `0.57.0`*


```bash
# Go to contract Directory
cd contracts/nft_contracts

# Compile contracts
aztec-nargo compile

# Generate Artifacts
aztec codegen target --outdir ../../src/artifacts
```


## License
MIT License

## Contact
- Discord Server: satyambnsal
- Twitter: @satyambnsal
- Email: satyamsgsits1994@gmail.com

## Acknowledgments
- Aztec Network Team
- Discord API Documentation
- Community Contributors