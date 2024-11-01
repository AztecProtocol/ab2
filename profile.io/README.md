# Profile.io: privacy preserving identity, nationality and age verification 

The Profile.io team are building an open platform and network for individuals and organisations to verify themselves and their online presence, to unlock trusted transactions, including privacy preserving stablecoin payments between users and organisations. Our vision is a universal blue checkmark, associating a verified person or organisation to authenticated social accounts, account abstracted accounts / EOAs and enabling privacy preservation through a choice of either using a pseudonym primary profile.io account, or a real name primary profile with pseudonymised alias/burner accounts. Sdks will enable applications across web2 and web3 to open access to trusted user interactions and ultimately to syndicate verification.

You can signup now to claim your profile.io handle and be part of enhancements as we move towards further decentralisation and zk enabled privacy.

This repo demonstrates enabling a user to verify their current employment listed on their profile, using zkemail. Scoping service for third parties to verify such information privately, either through profile.io/verify or their own user flows (eg. exploring potentially using Frames.js).


## Challenge Selection

- [x] ZKEmail Guardian
- [ ] Social Cipher

**Note**: You can change which challenges you've selected during the competition if you'd like. You are not bound by your choices or descriptions entered during the one week check-in.

## Team information

Profile.io is built by the team at Tabled Technologies Limited.
[Profile.io](https://www.profile.io/)

## Technical Approach
- Used the DKIM-Signature verification feature

### Email verification
We'd like to use ZKEmail to verify the email address, generate proof, and verify proof on our app.

The plan is to use ZKEmail to verify a user's work experience in their profile. When the user inputs his/her email, the service requests an email response which then verifies the employment domain using the dkim.  Future updates will utilise Aztec to generate proofs of the dkim verification to enable an email search at profile.io/verify to provide a privacy preserving employment and email verification.

Here is the user flow:
1. In FE (frontend), a user inputs his email on FE (ex: alan@tabled.io).
2. A verification email is sent by the system to the user.
3. The user replies to the verification email.
4. In BE (backend), the system will retrieve the raw email and then verify the email address from the DKIM-Signature.

Future planned features:
6. The BE calls Aztec contract to create a zk proof with the Note which has the verified email address. 
7. Another user (verifier) wants to verify if the email address is valid / or the person is actually an employee of the company.  They can do this via profile.io/verify - inputting the email address and receiving privacy preserving response.
8. Also, on the user profile, the FE has a "verify" button and when the verifier clicks that button -> Calling Aztec contract to process the target user's email verification -> FE shows whether the email address is verified on the UI.

### How to start the application
Prerequisite:
- nodejs version V20.10.0 or above

Here is the program start flow:
1. Run "npm install typescript --save-dev" to install TypeScript.
1. Run "npm install ts-node --save-dev" to install the TypeScript Library.
1. Run "npm install" to install the required libraries.
1. Run "npm run start".
1. Open the browser and type the URL "http://127.0.0.1:3000".
1. The screen will show the value of "fromEmailAddress", "isFromEmailAddressValid", and "dkimPass" results.

## Some technical questions

## Expected Outcomes
Providing a quick email verification feature.

## Lessons Learned (For Submission)

- What are the most important takeaways from your project?
- Are there any patterns or best practices that you've learned that would be useful for other projects?
- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Please provide links to any relevant documentation, code, or other resources that you've used in your project.

## Video Demo (For Submission)

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes and should include a brief intro to your team and your project.