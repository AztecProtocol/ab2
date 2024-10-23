# Umbra NFT - Technical Plan and Architecture

## 1. System Components

### A. Core Contract Layer
1. **Base NFT Contract (Already Implemented)**
   - Mint functionality
   - Public/private transfer methods
   - Ownership verification
   - Collection management

2. **Authentication Witness Contract**
   - Handle authwit generation for external verifications
   - Manage approval delegations for verification services
   - Support time-bound verification tokens

### B. SDK Layer (NPM Packages)
1. **@umbra-nft/core**
   - Contract interaction utilities
   - Key management
   - Type definitions
   - Event handling

2. **@umbra-nft/client**
   - High-level abstractions for dApp integration
   - Collection management utilities
   - Verification helper functions

3. **@umbra-nft/discord**
   - Discord bot integration utilities
   - Role management
   - Verification workflows

## 2. Privacy-Preserving Verification Flow

### A. On-chain Verification
1. NFT owner generates an authentication witness using their account contract
2. Verification service (e.g., Discord bot) validates the witness on-chain
3. Access granted based on successful verification

### B. Off-chain Verification
1. NFT owner proves ownership through partial note revelation
2. Discord bot verifies the proof without requiring on-chain interaction
3. Implements tag hopping for efficient note discovery

## 3. Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
- Set up monorepo structure
- Implement base SDK functionality
- Create type definitions and interfaces
- Establish testing framework

### Phase 2: Verification System (Week 3-4)
- Implement authentication witness contract
- Create verification utilities
- Build proof generation/verification system
- Develop partial note revelation mechanism

### Phase 3: Discord Integration (Week 5-6)
- Create Discord bot framework
- Implement role management system
- Build verification commands
- Create user onboarding flow

### Phase 4: Documentation & Polish (Week 7-8)
- Write comprehensive documentation
- Create usage examples
- Perform security review
- Optimize gas usage

## 4. Technical Specifications

### A. Authentication Witness Contract
```rust
contract AuthWitness {
    // Witness generation for NFT ownership
    fn generate_ownership_witness(
        collection_id: Field,
        token_id: Field,
        expiry: Field
    ) -> AuthenticationWitness;

    // Verify ownership witness
    fn verify_ownership_witness(
        witness: AuthenticationWitness,
        collection_id: Field,
        token_id: Field
    ) -> bool;
}
```

### B. SDK Interface
```typescript
interface UmbraNFTCore {
  // Collection Management
  createCollection(params: CollectionParams): Promise<Collection>;
  mintNFT(params: MintParams): Promise<NFTToken>;
  
  // Verification
  generateVerificationProof(tokenId: string): Promise<OwnershipProof>;
  verifyOwnership(proof: OwnershipProof): Promise<boolean>;
  
  // Discord Integration
  generateDiscordVerification(
    tokenId: string,
    discordId: string
  ): Promise<VerificationToken>;
}
```

## 5. Security Considerations

### A. Privacy Protection
- Implement zero-knowledge proofs for ownership verification
- Use partial notes for minimal information disclosure
- Implement secure key management

### B. Access Control
- Time-bound verification tokens
- Revocation mechanisms
- Rate limiting for verification attempts

### C. Data Protection
- Encrypted storage for verification metadata
- Secure communication channels
- Protected PXE interactions

## 6. Integration Guidelines

### A. For dApp Developers
```typescript
import { UmbraNFTClient } from '@umbra-nft/client';

// Initialize client
const client = new UmbraNFTClient({
  pxeUrl: 'your-pxe-url',
  network: 'testnet'
});

// Create collection
const collection = await client.createCollection({
  name: 'My Collection',
  symbol: 'MC',
  maxSupply: 1000
});

// Mint NFT
const nft = await client.mintNFT({
  collectionId: collection.id,
  recipient: recipientAddress,
  tokenUri: 'ipfs://...'
});
```

### B. For Discord Bot Integration
```typescript
import { UmbraNFTDiscord } from '@umbra-nft/discord';

// Initialize Discord bot
const bot = new UmbraNFTDiscord({
  clientId: 'your-discord-client-id',
  guildId: 'your-guild-id',
  verificationRole: 'holder'
});

// Handle verification command
bot.onVerificationRequest(async (interaction) => {
  const proof = await bot.verifyNFTOwnership(
    interaction.user.id,
    collection.id
  );
  
  if (proof.isValid) {
    await bot.assignRole(interaction.user.id, 'holder');
  }
});
```

## 7. Testing Strategy

### A. Unit Tests
- Contract functionality
- SDK methods
- Verification logic

### B. Integration Tests
- End-to-end verification flows
- Discord bot interactions
- Cross-component communication

### C. Privacy Tests
- Information leakage prevention
- Zero-knowledge proof validation
- Security boundary testing