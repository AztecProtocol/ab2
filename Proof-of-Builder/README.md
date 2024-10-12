# Anonymous Proof of Builder Status via GitHub Contributions

**Description:**

This projects enables developers to prove their builder status, verifying their contributions to various GitHub repositories, without showing their GitHub username or any other personal information. Thanks to **zkEmail** and the privacy enabled by the **Aztec**, it's possible to create zero-knowledge proofs using emails notifications from GitHub, for example, commit confirmations or pull request merges which in turn, would enable developers to claim airdrops or access exclusive events or perks on a completely anonymous basis using just their github contributions.

## Challenge Selection

- [x] ZKEmail Guardian
- [ ] Social Cipher

**Note**: You can change which challenges you've selected during the competition if you'd like. You are not bound by your choices or descriptions entered during the one-week check-in.

## Team Information

- **Author:** @joaolago1113
- **Role:** Solo Developer

## Technical Approach

- **High-Level Outline of Main Components:**

  1. **zkEmail Integration:**
     - **Email Verification:**
       - Review GitHub emails, such as commit confirmations or pull request merges.
       - Verify that it is indeed a valid email from GitHub.
     - **Zero-Knowledge Proof Generation:**
       - Creating of proof that actually attests a user contributed to any particular repository.

  2. **Regex Parsing of Email Content:**
     - **Extract Relevant Information:**
       - Employ zkRegex parsing the email body and extract commit hashes, repository names, or contribution details.
     - **Custom Circuits:**
       - Implement custom circuits to handle the peculiar patterns of GitHub emails.

  3. **Smart Contracts on Aztec Network:**
     - **Proof Verification Contract:**
       - A smart contract should be developed for verification of zero-knowledge proofs created by users.
     - **Airdrop Contract:**
       - A smart contract for giving out the airdrop.

  4. **User Interface:**
     - **Frontend Application:**
	- Front-end web interface or integrate into existing wallet UI to have user upload emails and generate proofs.

- **Specific Aztec Tools or Features Used:**
  - **Aztec Tools:** Nargo, Sandbox, etc... 
  - **ZK Email ecosystem**

## Expected Outcomes

A working application that allows developers to anonymously prove their GitHub contributions and claim airdrops or rewards.

## Lessons Learned (For Submission)

- What are the most important takeaways from your project?
- Are there any patterns or best practices that you've learned that would be useful for other projects?
- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Please provide links to any relevant documentation, code, or other resources that you've used in your project.

## Video Demo (For Submission)

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes and should include a brief intro to your team and your project.
