# zkUNO

## Project Description

zkUNO is a decentralized login system for the UNO card game that leverages `zkEmail` and Aztec's privacy features. The game of UNO is already built on-chain and currently runs on Arbitrum (Testnet) (GitHub link - https://github.com/ronykris/gameofuno). In this implementation, we integrate `zkEmail` to allow a trustless, secure, and private login without disclosing the user's email address.

## How zkUNO Leverages Aztec's Unique Features

- **Zero-Knowledge Proofs (ZKPs):** Utilizes `zkEmail` to securely verify email-based identities without exposing sensitive information. This allows users to authenticate with their email while keeping it private.
- **WebSocket Integration via Private Contracts:** Aztec’s private contracts handle WebSocket-based communication channels, ensuring only authenticated users can participate in real-time game interactions. This guarantees data synchronization privacy without requiring core gameplay migration from Arbitrum.

## Potential Real-World Impact

- **Enhanced Privacy:** With `zkEmail`, users can join blockchain-based games and applications without revealing their email, maintaining privacy beyond traditional login systems.
- **User Accessibility:** Email-based login reduces friction in onboarding new users to blockchain applications, making it accessible to non-crypto users.
- **Decentralized Security:** By eliminating reliance on centralized databases, zkUNO protects user data from breaches and central point-of-failure risks.

## Challenge Selection

We are targeting the **ZKEmail Guardian Challenge**, aiming to integrate a decentralized, user-friendly login system into an existing UNO game.

## Team Information

- **Saurabh** (GitHub - https://github.com/Saurus9290 )
- **Krish** (GitHub - https://github.com/ronykris )

Our team has experience in building blockchain-based games, decentralized identity solutions, and zero-knowledge proof systems. Our expertise includes smart contract development, frontend integration, cryptography, and game mechanics.

## Technical Approach

### High-Level Outline of Main Components

1. **Frontend UI for Email Login:**
   - User-friendly interface for email input.
   - Magic-link flow where users confirm login via email reply.
   - Secure generation and management of ephemeral ECDSA keypair in the user's browser.

2. **Smart Contract Integration:**
   - Adjusting the existing UNO game smart contract to handle authentication via ephemeral ECDSA keypairs.
   - Secure mechanisms to associate user accounts with email addresses using ZKPs without revealing sensitive data.

3. **Aztec’s Zero-Knowledge Proof Integration:**
   - Utilizes Aztec's private/public state capabilities to ensure that only valid users can interact with the game while maintaining privacy.

### Specific Aztec Tools or Features Used

- **Programmable Cryptography:** Manages the secure association between email and temporary keypair.
- **Zero-Knowledge Proofs (ZKPs):** Generates non-revealing verification of user email confirmations.
- **Private/Public State:** Links game interactions to authenticated users without exposing sensitive details.

## Expected Outcomes

By the end of the challenge, we aim to:

1. Develop a fully functioning zkEmail-based decentralized login for the UNO card game.
2. Create an open-source relayer service to securely facilitate email-based ECDSA session key authorization.
3. Demonstrate seamless gameplay for authenticated users while maintaining privacy using zkEmail + Aztec's ZKP capabilities.
4. Provide a robust framework adaptable for other blockchain applications seeking a decentralized, privacy-preserving login solution.
5. Showcase a privacy-focused login system that can serve as a drop-in replacement for traditional email logins in crypto-native applications.

