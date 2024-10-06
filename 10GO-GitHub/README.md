# 10GO-GitHub

> ✊ **10GO:** *"If you can prove it, you've got it!"*

10GO-GitHub is an innovative solution designed to prove builder status through contributions to a GitHub repository without revealing the user's identity, enabling anonymous claims of airdrops. Our project leverages Aztec's programmable cryptography to ensure a seamless, secure, and privacy-focused process for builders to claim rewards without compromising their GitHub username. We use zkEmail to create verifiable, privacy-preserving proofs of user contributions.

This project has the potential to empower builders in the Web3 space by providing a transparent yet private way to verify their work and claim rewards, fostering a more inclusive environment for developers who value their anonymity.

## Challenge Selection

- [x] ZKEmail Guardian
- [ ] Social Cipher

**Note**: You can change which challenges you've selected during the competition if you'd like. You are not bound by your choices or descriptions entered during the one week check-in.

## Team Information

- **Nicolás Biondini**: [github/NicolasBiondini](https://github.com/nicolasbiondini) - Web3 Frontend and Blockchain Developer, focused on dApps.
- **Yago Pajariño**: [github/yagopajarino](https://github.com/yagopajarino) - Tech Lead and data enthusiast with a computer science background.
- **Alejandro Almaraz**: [github/almaraz97](https://github.com/almaraz97) - Blockchain Developer experienced in NFTs and frontend development.
- **Arturo Beccar-Varela**: [github/arturoBeccar](https://github.com/arturoBeccar) - Technical Program Manager and Developer Relations with expertise in security and a math background.

We are a team based in Argentina with 2-3 years of experience in Web3. Our journey began as ZK enthusiasts participating in the PSE Core Program in Buenos Aires 2024, where we learned about Aztec. Fascinated by the potential of programmable cryptography, we are eager to build real-world applications that leverage Aztec's capabilities in private transactions and smart contracts.

Our collective experience includes working with zkDSLs like Circom and Noir, which has prepared us to dive deeper into zero-knowledge technologies. We've collaborated on several blockchain and privacy-focused projects, such as [OpenFlow](https://github.com/openflow-labs/openflow), [ZKam](https://github.com/zkam-labs/zkam), and [10GO](https://github.com/10GO-labs/10GO).

We've also actively participated in hackathons, winning first prize in the ZK/Privacy track at the Ethereum Argentina Level Up Hackathon with our project ZKam. Additionally, we secured first place in the Filecoin Foundation, ZKSync, and Protocol Labs tracks at the Aleph Ciudad de Crecimiento Hackathon with our project OpenFlow, and were runners-up in the Polygon track.

As an independent team, we're excited to contribute our skills and passion to the Aztec ecosystem and look forward to the opportunity to make a meaningful impact.

## Technical Approach

We use zkEmail to allow users to prove their GitHub contributions without revealing their usernames. By generating zero-knowledge proofs of their activity, users can anonymously claim airdrops through a smart contract, ensuring a secure and private verification process.

- **High-Level Outline of Main Components**
  1. **Frontend Interface**: A web application where users generate zero-knowledge proofs of their GitHub contributions.
  2. **Backend Server**: Interacts with GitHub APIs and utilizes zkEmail to create privacy-preserving proofs.
  3. **Smart Contracts**:
     - **ERC20 Token Contract**: Manages the distribution of airdropped tokens.
     - **Verification Contract**: Validates the zero-knowledge proofs before allowing token claims.

- **Specific Aztec Tool Used**
  - **zkEmail**: Employed to create verifiable proofs of user contributions without disclosing personal information.


## Expected Outcomes

By the end of the challenge, we aim to achieve:

- **Anonymity in Proof of Contribution**: Enable users to prove their GitHub contributions without revealing their usernames, preserving privacy.

- **Functional Platform Development**: Build a fully operational platform with a frontend interface, backend server, and smart contracts to facilitate anonymous airdrop claims.

- **Integration of zkEmail**: Successfully implement zkEmail to generate verifiable, privacy-preserving proofs of user contributions.

- **Secure Airdrop Distribution**: Deploy ERC20 token contracts and verification contracts to manage and securely distribute airdropped tokens based on validated proofs.

- **Comprehensive Documentation**: Provide detailed documentation of the solution, including setup instructions, usage guidelines, and technical explanations, to facilitate understanding and adoption.

- **Enhancing Privacy in Web3**: Contribute to a more inclusive Web3 ecosystem by empowering developers who value their anonymity.

- **Demonstrate Practical Use of Zero-Knowledge Proofs**: Showcase the effectiveness of zero-knowledge proofs in real-world applications, promoting broader adoption of privacy-preserving technologies.


## Lessons Learned (For Submission)

- What are the most important takeaways from your project?
- Are there any patterns or best practices that you've learned that would be useful for other projects?
- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Please provide links to any relevant documentation, code, or other resources that you've used in your project.

## Video Demo (For Submission)

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes and should include a brief intro to your team and your project.
