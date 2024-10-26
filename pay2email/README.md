# Pay to an Email
## (Transfer to an Email address)

**The idea** was to enable transfers to & from people who don't know about Aztec or hesitate to get themselve an account, but interacting with some Aztec users. \
Any asset fits the concept, but tokens are the most obvious choice for the challenge. \
My research of different approaches during the challenge concludes that there's no good way of conducting private txs this way. (By a _good way_ I mean enabling something for a person; I rejected a pile of approaches since their requirements bring user to the point where it's already easier to move forwarding with just Aztec ditching ZK-email tech.) \
The last part I had to ditch is transfers between email addresses since it raises the problems of negative balances and/or txs ordering which only sane solution is to become an Aztec real user.

So this system is a contract that enables to send a token to an email address (even if its owner never heard about Aztec yet), and redeem the token to a public address (known or a one-time thing), and then leverage the privacy of Aztec token if the one feels so.

Recipient claim via linking the email address, which enables many use cases. \
Most notably it's 
* paying/sending to anyone who isn't on the Aztec yet, as well as
  * to a receiver whos address user can't ask rn, or
  * it might be a group/company;
* facilitation of donations reception.
* Further real-world impact is numerous as it can be leveraged to businesses, receipts, cashback, and so on, which smoothly blends-in to flexibility of native account abstraction.

In a sense it could be a proto (like very-very proto) Aztec Name System. Though I'm really not sure if we need one more NS; on the other hand sooner or later it will inevitably appear.

## Challenge Selection
- [x] ZKEmail Guardian
- [ ] Social Cipher

## Team information
@skaunov

## Technical Approach
The contract holds balances for each email used with it, the tokens to redeem, and addresses linked to an email.

While I was hoping to pull off transfers between emails there were also other stuff to hold in the contract. It's a hashed signature preventing it reuse; contract addresses for used tickers to facilitate email payments. There was also a fee designated in the email for the one who processes the payment order (i.e. feeds the signed email into the contract) to incentivize the processing. Usually it should be the receiver but for email-to-email payments it could be anyone they choose to share the email. Also a _get balance_ function was designed so an user via a block-explorer integration could check their balance (via email responder, or a web-page). The email were designed to be highly structured to fight scamming users into accidentally put into a signed message enough data to trick them into a payment. The problem is it's a hard question what to do with an email payment order which spends more than the email sender has in the contract. Introduction payment order invalidation makes whole system more complicated to use than just having a wallet. So it will be valid until fed into the contract, and receiver can be sure they can redeem it when the sender has the balance. But I see no good way to stop an user from issuing such email payments Tracking the debt doesn't sound

- Probably it will be a contract holding the assets and releasing it on the email control proof.
- Linking an email to the system needs additional design, though it will smooth experience from fees side, number of txs, and general perception. It could be a registry, probably inside the contract.
- Management of the registry. Administration of the system (root CA?).
- Additional (temporary?) account contract would be nice, but doesn't seem to fit into the time limit of the challenge.

## Expected Outcomes
A prototype which could be interesting to play with on the Devnet (though deployment and maintenance it there during the challenge is a very optimistic shot for me), highlighting of successes and problems of approaches and designs for the problem, exploration of integration this into a wallet. No UI is expected from me, btw.

## Lessons Learned (For Submission)

- What are the most important takeaways from your project?
- Are there any patterns or best practices that you've learned that would be useful for other projects?
- Highlight reusable code patterns, key code snippets, and best practices - what are some of the ‘lego bricks’ you’ve built, and how could someone else best use them?

## Project Links (For Submission)

Please provide links to any relevant documentation, code, or other resources that you've used in your project.

## Video Demo (For Submission)

Please provide a link to a video demo of your project. The demo should be no longer than 5 minutes and should include a brief intro to your team and your project.
