# Getting Started with Alpha Build 2

## Context

zkEmail is a powerful primitive for breaking down the data silos of web2. Combined with the composability of the Aztec network, zkemail proofs can be used as attesationst unlock new use cases in social applications, payments and gaming. Alpha build 2 is designed to start exploring the design space around these primitives and share knowledge about what can be accomplished with this new technology.

## Challenge 1: ZKEmail Guardian

**Objective**: Use zkEmail to prove things on Aztec.

**Requirements:**

1. Choose one idea from the list below or propose your own to the Aztec team before starting the challenge through detailing it in your project’s README
2. Use existing zkEmail circuit in Noir

**Ideas to build:**

- Prove restaurant reservations to write privacy preserving reviews, a Private Yelp
- Prove car registration privately through email, private used car sales
- Prove employment privately through email, and details about employment (ex: salary range, health benefits, etc)
- “Proof-of-quit” - Prove that you canceled a service (from the cancellation email) so you can get a discount at a competitor (inspiration)
- Prove builder status - Prove contribution to a GitHub repo without revealing your username (ex through PR merged email) to claim airdrops anonymously
- Sports betting platform with email verification of placed bets and social reputation system
- Proving credit score above some amount via email credit report
- Fitness challenge platform using gym email receipts and social media post verifications
- Decentralized escrow service using email verifications and social reputation
  - Transfer notifications for payment proof
  - Restaurant reservation trading
  - Domain ownership escrow
  - Explore: tickets, shipping, investments
- Carbon offset tracking system with email-verified purchases and social impact attestations
- Private event ticketing system with email confirmations and social group membership
- Skill verification system using email certificates
- See also: [zkEmail's Project Ideas List](https://github.com/zkemail/#project-ideas) for even more expansion on these ideas and more novel ways in which email can be used for verification
- See also: [Reclaim Protocol Ideas List](https://reclaimprotocol.org/blog/posts/zktls-rfps)

**Note**: Full implementation might not be feasible in a week. Participants can focus on specific aspects or create a proof-of-concept. Participants have the option to build out email through Challenge 2’s timeframe if they choose to prioritize email. If this overlaps too heavily with what you built in AB1, you may optionally work on Challenge 2 during this timeframe. For simplification, as proving data in attachments such as PDFs is quite challenging, “email verification” can be done through text within the body or subject of an email with details on how you’d expand functionality in your readme.

**Additional Note on Account Contracts:**

- Private-side account contracts don't require deployment, even for transactions
- Public-side account contracts need deployment to receive funds
- Deployment costs are minimized through Aztec's contract classes and instances system
- For more details on contract deployment, see: https://docs.aztec.network/aztec/smart_contracts/contract_creation

Consider exploring ways to optimize the deployment process or implement batched transaction calls to enhance usability and reduce upfront costs.

**Stretch goals:**

- Implement zkEmail as 2FA for high-value transactions

## Challenge 2: Social Cipher

**Objective:** Implement onchain or offchain verification of NFT ownership on Aztec

**Requirements:**

1. Implement offchain verification of NFT ownership on Aztec
2. Prove on an aztec contract that you own an NFT at a specific block, using archive tree
3. Document the process with system architecture overview in the readme of your project

**Ideas to build:**

- Private NFT gallery showcase - ex: Shopify like app where store owners can create a store, list their NFTs for sale and users can come in and buy anonymously
- Private NFT gated event check-in system
- Prove you own an NFT from a collection at some timestamp to another contract and enable ability to:
  - Claim an airdrop
  - Mint a subscription
  - Enable tiered memberships
  - Variable pricing on subscriptions
- Discord bot for private NFT ownership verification
- X (formerly Twitter) bot for private NFT based profile verification

**Stretch goals:**

- Develop a system to prove ownership of multiple social media accounts privately
- Use portals (bridges) on Ethereum to privately prove things from Aztec data

**Note:** This challenge is quite Noir heavy and goes deep into storage on Aztec.

## Resources

- [Official zkemail in Noir repo](https://github.com/zkemail/zkemail.nr)
- [Getting started with Aztec Sandbox](https://docs.aztec.network/guides/getting_started)
- [Aztec Tutorials](https://docs.aztec.network/tutorials)
- [Writing an Account Contract](https://docs.aztec.network/tutorials/codealong/contract_tutorials/write_accounts_contract)
- [Example Aztec NFT Contract](https://github.com/AztecProtocol/aztec-packages/tree/master/noir-projects/noir-contracts/contracts/nft_contract)
- [Using the Archive Tree](https://docs.aztec.network/guides/developer_guides/smart_contracts/writing_contracts/how_to_prove_history)
