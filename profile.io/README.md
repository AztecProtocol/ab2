# Profile.io: privacy preserving identity, nationality and age verification 

Using a profile.io user's indentity verification KYC results to prove user's adult verification and/or nationality without revealing personal data by using ~~Aztec Connect~~ Noir circuit ZKP. Scoping service for third parties to verify such information privately, either through profile.io/verify or their own user flows (eg. exploring potentially using Frames.js).


## Challenge Selection

- [x] ZKEmail Guardian
- [x] Social Cipher

**Note**: You can change which challenges you've selected during the competition if you'd like. You are not bound by your choices or descriptions entered during the one week check-in.

## Team information

[Profile.io](https://www.profile.io/)

## Technical Approach

### Adult verification
We'd like to use Aztec ZKP for proving adult verification (or any other user info) on our app.
~~We have already smart contract that mints NFTs on Polygon mainnet~~ 

The plan is to use ZKP and Aztec Note when user inputs his/her identity including age then the user can use it when the age verification is required without revealing details.

Here is the user flow:
1. In FE (frontend), a user inputs his birthdate on FE (ex: 20/04/1995) 
1. The FE calls Aztec contract to mint a NFT with the Note which has his birthdate (at this step, PXE creates ZKP when a private function is called on the Aztec contract if I am understood properly)
1. Now the user owns the age-NFT
1. Another user (verifier) wants to verify if the user is an adult or not.
1. The user doesn't want to reveal his exact age but can prove whether he is adult or not by using ZKP (or Note?)
1. The FE has a "verify" button and when verifier clicks that button -> Calling Aztec contract to process target user's age verification -> FE shows whether the user is an adult or not on the UI.

### Email verification
We'd like to use ZKEmail to verify the email address, generate proof, and verify proof on our app.

The plan is to use ZKEmaip when the user inputs his/her email, and then the user can use it when email verification is required without revealing details.

Here is the user flow:
1. In FE (frontend), a user inputs his email on FE (ex: alan@tabled.io).
1. There will be sent a verification email to the user.
1. The user needs to reply to that email.
1. In BE (backend), the system will retrieve the raw email and then verify the email address from the DKIM-Siguature.
1. The BE calls Aztec contract to mint an NFT with the Note which has the verified email address (this point should be the same mentioned in the Adult verification user flow). 
1. Now the user owns the email-NFT
1. Another user (verifier) wants to verify if the user is an adult or not.
1. The user doesn't want to reveal the exact email but can prove whether the user has the email address.
1. The FE has a "verify" button and when the verifier clicks that button -> Calling Aztec contract to process the target user's email verification -> FE shows whether the email address is verified on the UI.

## Some technical questions
a. At above step 2, the created Note is an actual ZKP? I am confused the relation between Note and ZKP?

b. At above step 6, can Aztec contract retrieve age-NFT data without the NFT owner's permission? Do I need the "Witness"?

c. At above step 6, if Aztec contract can retrieve age-NFT data (birthdate), can the Aztec contract process calculation of the Note data? For example, `isUserAdult(note)`, `isUserOver50(note)`, `isUserOver70(note)`.

## Expected Outcomes
Providing a quick age verification feature. 
Providing a quick email verification feature.

## Lessons Learned (For Submission)

- What are the most important takeaways from your project?
- Are there any patterns or best practices that you've learned that would be useful for other projects?
- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Please provide links to any relevant documentation, code, or other resources that you've used in your project.

## Video Demo (For Submission)

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes and should include a brief intro to your team and your project.
