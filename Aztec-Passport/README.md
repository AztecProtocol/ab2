# Aztec Passport

Aztec Passport is an identity verification platform that enables users to verify their social accounts, decentralized identifiers (DIDs), and on-chain activities while preserving privacy.

### How Aztec Passport leverages Aztec’s features:

- **Social Accounts Verification**: Uses zk-email proofs to validate ownership without exposing sensitive information.
- **DID Verification**: Utilizes zk-proofs to verify JWTs for secure validation of decentralized identifiers.
- **On-Chain Activity Verification**: Uses Aztec’s L1-to-L2 message portal to verify on-chain activities.

## Challenge Selection

- [x] ZKEmail Guardian
- [ ] Social Cipher

**Note**: You can change which challenges you've selected during the competition if you'd like. You are not bound by your choices or descriptions entered during the one week check-in.

## Team information

- **Vedant Chainani**: [github/Envoy-VC](https://github.com/Envoy-VC) - Full Stack Developer.

## Technical Approach

### Smart Contracts

- **Coordinator Contract**: Central contract that manages interactions between different modules, coordinating the identity verification process and facilitating seamless integration of new modules.

- **Module Whitelist Contract**: Maintains a list of approved modules that the Coordinator Contract can interact with. This ensures only verified modules are used for identity verification.

  - **Social Verification Module**: Verifies social accounts using zk-email proofs, enabling private proof of ownership for platforms like Twitter, GitHub, or LinkedIn.

  - **zkJWT Contracts**: Verifies DIDs by processing JWTs using zk-proofs.

  - **Message Portal Contracts**: Utilize Aztec’s L1-to-L2 message portal to verify on-chain activities such as balances, transactions, and other blockchain interactions, ensuring cross-layer communication.

### Front-End

- **Web Application**: A user interface that enables users to interact with the Coordinator Contract, granting access to all modules.

### Specific Aztec Tools Used

- zk-email
- Portals

## Expected Outcomes

- **Modular, Scalable Identity Framework**: Create a modular identity framework that supports various identification mechanisms and strategies.
- **zkJWT Implementation on Noir**: Successfully implement JWT Validation in Noir using primitives like RSA, SHA_256, Base64 and Finite point Arithmetic.
- **On-Chain Verification**: Implement on-chain verification of user activities using Aztec’s L1-to-L2 message portal.

## Lessons Learned (For Submission)

- What are the most important takeaways from your project?
- Are there any patterns or best practices that you've learned that would be useful for other projects?
- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Please provide links to any relevant documentation, code, or other resources that you've used in your project.

## Video Demo (For Submission)

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes and should include a brief intro to your team and your project.
