# Umbra NFT with Discord Verification

## Overview
A privacy-preserving NFT platform built on Aztec Network that enables users to mint NFTs privately while providing optional ownership verification through Discord integration. This project leverages Aztec's privacy features to protect user identity and transaction details while still allowing selective disclosure of NFT ownership.


### Installation
```bash
# Clone the repository
git clone https://github.com/satyambnsal/ab2

cd umbra-nft

# Install dependencies
bun install


# Start development server
bun run dev
```

### Contract Commands
NFT contracts are written in `contracts/nft_contracts` folder
**Note:** *Before running following commands, Please make sure your **aztec sandbox** is running locally with version `0.57.0`*


```bash
# Go to contract Directory
cd contracts/nft_contracts

# Compile contracts
aztec-nargo compile

# Generate Artifacts
aztec codegen target --outdir ../../src/artifacts
```



## Key Features

### Private NFT Minting
- Mint NFTs privately on Aztec Network
- Transaction details and ownership information remain confidential
- Support for both public and private minting options
- Customizable metadata and content storage

### Discord Verification System
- Seamless integration with Discord for NFT ownership verification
- Private verification process that doesn't compromise user privacy
- Role-based access control in Discord servers based on NFT ownership
- Optional public verification badges for community engagement

### Technical Architecture

#### Smart Contracts
- Privacy-preserving NFT contract built with Aztec.nr
- Authentication Witness (AuthWit) implementation for secure delegated actions
- Hybrid state model utilizing both public and private storage
- Integration with Aztec's Private Execution Environment (PXE)

#### Discord Bot
- Secure verification protocol for NFT ownership claims
- Privacy-preserving role management
- Automated verification and role assignment
- Command system for user interaction

## Technology Stack
- Aztec Network (Layer 2 Privacy Platform)
- Noir Programming Language
- Discord.js for Bot Development
- TypeScript/JavaScript
- Node.js Backend

## Security Features
- Zero-knowledge proofs for ownership verification
- Private state management
- Secure key management
- Rate limiting and abuse prevention
- Privacy-preserving authentication

## Getting Started

### Prerequisites
- Node.js >= 18
- Aztec SDK
- Discord Developer Account
- Supported Web3 Wallet




### Configuration
1. Set up Discord Bot credentials
2. Configure Aztec Network connection
3. Set up environment variables
4. Deploy smart contracts

## Usage

### Minting NFTs
```typescript
// Example minting process
const mintNFT = async (metadata: NFTMetadata) => {
  // Implementation details
};
```

### Discord Verification
```typescript
// Example verification process
const verifyOwnership = async (discordId: string, nftId: number) => {
  // Implementation details
};
```

## Contributing
I welcome contributions to improve the project! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

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