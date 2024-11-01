# UmbraHelix

UmbraHelix is an Aztec NFT Ownership verifier for Discord. It also has other useful features like creating collection, minting nft, public and private transfer and to fetch nft owner.

Developers can use UmbraHelix by installing the sdk from npm.

## Challenge Selection
- [x] Social Cipher 
- [ ] ZKEmail Guardian

## Team information
- **Satyam Bansal** - Full stack developer and open source contributor, Kernel community fellow
  - GitHub: https://github.com/satyambnsal
  - Twitter: @satyambnsal
  - Email: satyamsgsits1994@gmail.com

- **Yash Mittal** - UI developer
  - GitHub: https://github.com/yassmittal


## Technical Approach

### Main Components:
1. **NFT Smart Contract**
- Custom NFT contract written in Noir enabling both public and private transfers
- Support for collection creation, minting, and ownership verification  
- Located in `contracts/nft_contracts`

2. **Client SDK**
- TypeScript SDK for easy integration
- Support for wallet creation, collection management, and NFT operations
- Privacy-preserving ownership verification functions

3. **Discord Integration** 
- Bot interface for role management based on private NFT ownership verification
- Private membership verification without exposing full ownership details

### Key Aztec Features Used:
- Private state for NFT ownership records
- Public/private transfer functions 
- AuthWit for delegated operations
- PXE integration for client-side proof generation

## Expected Outcomes
- Easy-to-use SDK for developers
- Working Discord bot demonstrating private ownership verification
- Documentation and examples for building privacy-preserving social applications

## Lessons Learned (For Submission)
- Implementing privacy-preserving ownership verification requires careful consideration of information leakage
- Pattern for handling both public and private NFT transfers while maintaining privacy
- Best practices for PXE integration and client-side proof generation
- Reusable patterns for Discord bot integration with private state verification

## Project Links
- GitHub Repository: https://github.com/umbra-privacy/umbra-helix
- Documentation & Examples: [To be added]

## Video Demo
[Link to demo video will be added for final submission]

### Installation & Usage
```bash
# Clone the repository
git clone https://github.com/umbra-privacy/umbra-helix

cd umbra-helix

# Install dependencies
bun install

# Start development server
bun run dev