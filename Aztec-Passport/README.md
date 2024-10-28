# Aztec Passport

Aztec Passport is an identity verification platform that enables users to verify their social accounts, decentralized identifiers (DIDs), Biometrics and on-chain activities while preserving privacy.

### How Aztec Passport leverages Aztec’s features:

- **Social Accounts Verification**: Uses zk-email proofs to validate ownership without exposing sensitive information.
- **DID Verification**: Utilizes zk-proofs to verify JWTs for secure validation of decentralized identifiers.
- **Bio-metric Verification**: Use of face descriptors to verify government issued IDs such as Driver's License, Passport, etc.
- **On-Chain Activity Verification**: Uses Aztec’s L1-to-L2 message portal to verify on-chain activities such as ETH Balance and ENS Names.

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

- As on current state the Sandbox doesn't generate any proofs and we were verifying the whole Email Body during Twitter Verification, which could take a lot of time, so in future we would like to use body masking to decrease the body size to only the required sections.
- As Noir does not have a interfaces, we moved to a module pattern where there is a Entrypoint contract called Passport and all the modules have `Ownable` functions and `passport_address` in one of their storage slots, which can be used to invoke functions in the Entrypoint contract, which helped to achieve a modular architecture.
- There is a small snippet to compare `BoundedVec` to `[u8]` which helped in comparing extracted Twitter Usernames: [here](https://github.com/Envoy-VC/noir_social_verify/blob/main/lib/src/utils.nr#L8)

## Project Links (For Submission)

Entire Code for the project can be found [here](https://github.com/Envoy-VC/ab2/tree/aztec-passport/Aztec-Passport)

https://github.com/Envoy-VC/ab2/tree/aztec-passport/Aztec-Passport

as well as some of the Libraries created during building this Project as developer tooling:

- `noir_hmac`: HMAC implementation in Noir Language over SHA-256 Hash Algorithm.
- `noir_base64_lib`: Extension of `noir_base64` with support for Vectors and Base64 URL encoding and decoding
- `noir_jwt`: Verify JWTs and attest claims in Noir Language
- `noir_social_verify`: Wrapper around zkemailnr to verify social accounts and extract details like X username, and emails.

All of them can be found here

https://github.com/Envoy-VC/noir_hmac
https://github.com/Envoy-VC/noir_base64_lib
https://github.com/Envoy-VC/noir_jwt
https://github.com/Envoy-VC/noir_social_verify

## Video Demo (For Submission)

https://youtu.be/3IpaD-8wxCM

[![Demo Video](https://img.youtube.com/vi/3IpaD-8wxCM/0.jpg)](https://www.youtube.com/watch?v=3IpaD-8wxCM)
