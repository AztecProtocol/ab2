# Email Based Account

Create an email based aztec account. That one can sign into using an email address (gmail) and a password. The user can sign transactions using the password.  

This project uses zkemail.nr library for email verification on the user's device. The email ID and the password are kept private and do not leave the user's browser. 

[watch the demo here](https://youtu.be/V_2vtAR1lzo)

How to run the project locally:
1. Clone the repo (either this or the parent repo: https://github.com/rajeshb62/ab2)
2. From project root (email_based_account), run:
```
nargo compile
```
3. From project root, run:
```
yarn install
cd frontend
yarn install
cd ..
```
4. From project root (email_based_account folder), run:
```
yarn workspace frontend dev
```
5. Run tests:
```
# to run both noir and frontend tests
yarn test
# to run only frontend tests
yarn test:frontend
```


## Challenge Selection
Read [this article](https://aztec.network/blog/unlocking-the-future-of-privacy-exploring-identity-and-social-use-cases-in-alpha-build-2-with-100k-in-prizes) that announces Alpha Build 2 to learn more about the challenges and get ideas on what to build!

- [x] ZKEmail Guardian
- [ ] Social Cipher

**Note**: You can change which challenges you've selected during the competition if you'd like. You are not bound by your choices or descriptions entered during the one week check-in.

## Team information

[Rajesh ](https://github.com/rajeshb62)

## Technical Approach
### Questions/ approach
- create an account for an email address abc@xyz.com based on .eml file:
    - verify header is valid using dkim signature verification
    - check sender is 'abc@xyz.com'
    - (additional check) check if subject contains a specific random string shown in UI
- hash email+password into sha256 hash, and use it as encryption key in getSchnorrAccount(..) function, hash the password and use it as signing key. Show the account wallet in UI (user can sign tx from this wallet using their password)
Inspirations: 
https://zkemail.shieldswap.org/
https://docs.aztec.network/guides/developer_guides/smart_contracts/writing_contracts/authwit#usage
Inspiration codebases: Loads account based on Face ID of user: loads account based on password: https://github.com/skaunov/aabch1_23

## Expected Outcomes
A wallet app (previously created in alpha build 1 https://github.com/rajeshb62/aztec-wallet) that now is modified to use email ownership proof to create aztec account

## Lessons Learned (For Submission)

- What are the most important takeaways from your project? 
Creation of email based private blockchain accounts are a reality. 
- Are there any patterns or best practices that you've learned that would be useful for other projects?Learning about zkemail.nr library will help improve readme/ other documentation for this library.
- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Please provide links to any relevant documentation, code, or other resources that you've used in your project.

## Video Demo (For Submission)

[![Email Based Account Demo]](https://www.youtube.com/watch?v=V_2vtAR1lzo)

A brief demo showing:
- Email verification process
- Account creation

- How does your project leverage Aztec's unique features? (programmable cryptography, private/public state, etc.)
While not directly within scope of AB2, the wallet is being built only because
1. it allows fully private state and activities, most importantly:
    - private transfers of stablecoins and eth
    - assets can stay fully private for user, as absolutely esstial for card games 
2. account abstraction features that make possible 
    - user friendly encryption and signing key namely, email based hash for private key and Face ID for signing key
    - email ID based token transfer (???)
    - transaction rules like 'allow only transactions below $100 / day by email(???)'
    - allow session ID based transaction approval
3. fee abstraction features:
    -allow for wallet provider to pay gas (needed for activities like card games)

- What is the potential real-world impact of your project?
- onboard web2 users using familiar account creation and signing methods like email ID and password
- ( there are other features relevant for web2 users in wallet but that are not directly within scope of AB2)

## Scope for future research, improvements and problems to solve
- an email can be used for multiple accounts currently by using different passwords. I want to explore Aztec's note/ nullifier features to allow one email ID to be used for single account only
- is user's privacy compromoised here what are privacy best practices? Is sha256 hashing sufficient privacy for user's email and password?
- current implementation has users sending emails to an inbox controlled by the developer. It defeats the purpose of user privacy. It needs a better solution (user sending verification email to themselves for the verification step???)
- zkemail seems to support a limited number of domains currently. The app itself only supports emails sent from  icloud.com and that too emails of a small size. 
- Replace password with touch/face ID for better UX and security
- emails and aliases need to be studied. The goal is one email ID one aztec account (users have multiple aliases for one email ID, how does that work and how to handle that? Users can own domain name and have emails sent from and to all email ids using that domain name (a@joshcrites.com, b@joshcrites.com) be operated from the same inbox (??). there is lot of scope to better understand the email protocol)