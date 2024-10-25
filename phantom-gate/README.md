# Private NFT-Gated Event Check-in System on Aztec

## Overview

`PhantomGate` implements a private NFT-gated event check-in system on Aztec Network, allowing users to prove their NFT ownership without revealing their identity or specific NFT details. The system verifies NFT ownership at specific block heights while maintaining privacy through zero-knowledge proofs. We will also provide minting the nft.

## System Architecture

### Components

#### 1. Client-Side (PXE)
- Aztec.js integration for client interactions
- Private execution environment for NFT ownership verification
- Zero-knowledge proof generation for NFT ownership
- User interface for check-in process


#### 2. Smart Contracts
- Event management contract (public state)
- NFT verification contract (private state)
- Portal contract for Ethereum NFT communication

#### 3. Public VM
- Processes rollups of private check-ins
- Maintains public event statistics
- Handles state transitions

### Flow Diagram

```
User (with NFT) -> PXE (Private Verification) -> Aztec Contract
                                             -> Portal Contract
                                             -> Ethereum NFT Contract
```

### Local Installation
```bash
# Clone the repository
git clone https://github.com/ankit875/alpha-build2/phantom-gate

cd phantom-gate

# Install dependencies
yarn install


# Start development server
yarn run dev
```

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
- Discord Server: ankitagrwal
- Twitter: @ankitagrwal
- Email: ankitagrawal620@gmail.com

## Acknowledgments
- Aztec Network Team
- Discord API Documentation
- Community Contributors
