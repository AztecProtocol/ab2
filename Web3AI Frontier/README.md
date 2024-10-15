# EZKL + ZK Email

## Description:

EZKL + ZK Email is a privacy-first application that utilizes [EZKL framework](https://docs.ezkl.xyz/) to parse email contents and reveal only the outputs of the machine learning model. By integrating zero-knowledge technology, 
the project ensures that sensitive email data remains confidential while providing useful summaries and parsed information. The application will leverage the existing zkEmail circuit in Noir
and build on the Aztec platform to enhance privacy and usability.

## Project Leverage of Aztec's Unique Features

- **Programmable Cryptography:** By utilizing Aztec's programmable cryptography, we can create custom privacy-preserving logic that allows for confidential interactions with email data. This enables
us to implement the zkEmail circuit effectively.
- **[Private/Public State](https://docs.aztec.network/aztec/concepts/state_model):** The project will take advantage of Aztec's ability to manage both private and public states, allowing us to handle sensitive email information securely while still enabling 
necessary interactions with public blockchain data.

## Potential Real-World Impact

The EZKL + ZK Email project aims to revolutionize how users interact with their emails by providing a privacy-preserving solution that allows for secure communication and data management. This can 
significantly enhance user trust in email systems, reduce the risk of data breaches, and promote the adoption of privacy-first technologies in everyday applications.

## Challenge Selection
Read [this article](https://aztec.network/blog/unlocking-the-future-of-privacy-exploring-identity-and-social-use-cases-in-alpha-build-2-with-100k-in-prizes) that announces Alpha Build 2 to learn more about the challenges and get ideas on what to build!

- [x] ZKEmail Guardian
- [ ] Social Cipher

## Team Information

- [Emarc](https://github.com/emarc99)
- [Dike](https://github.com/psychemist)
- [Michael](https://github.com/michojekunle/)


## Technical Approach

### High-Level Outline of Main Components:

1. **Email Parsing Module:** Utilizing the EZKL framework, this machine learning component analyzes email contents and generates summaries or extracts relevant information.
2. **Zero-Knowledge Proof Integration:** Utilizing the existing zkEmail circuit in Noir to ensure that the outputs of the ML model can be verified without revealing the original email data.
3. **Aztec Layer 2 Implementation:** Building the application on the Aztec platform to leverage its privacy features and manage confidential transactions.

### Specific Aztec Tools Used:

- **[zkEmail](https://github.com/zkemail)/[zkemail.nr](https://github.com/zkemail/zkemail.nr):** To implement the zero-knowledge proof logic for email verification and output validation.
- **[Aztec SDK](https://docs.aztec.network/):** For integrating the application with the Aztec Layer 2 solution, enabling private transactions and interactions.

## Expected Outcomes

By the end of the challenge, we hope to achieve the following:
- A functional prototype of the EZKL + ZK Email application that successfully parses emails and generates privacy-preserving outputs.
- Demonstration of the integration between the Noir zkEmail circuit, the EZKL framework, and the Aztec platform, showcasing the effectiveness of zero-knowledge technology in real-world applications.
- A clear understanding of user interactions with the application, paving the way for further development and potential deployment.

