## **TxnProof**

Studies show that around 61% of consumers are concerned about their financial data being shared without their consent​ ([RestorePrivacy](https://restoreprivacy.com/email/secure/)). Additionally, email-based transactions are particularly vulnerable, with 92% of malware delivered via email and phishing attacks accounting for more than 80% of reported security incidents​ ([GitHub](https://github.com/zkemail/zk-email-verify))​

Using zkEmail and zero-knowledge proofs (ZKPs) built on Aztec's Noir, the platform will enable users to securely prove their financial activities without disclosing sensitive information. 

### How does your project leverage Aztec's unique features? 
#### Programmable Cryptography: 
Aztec's zkregex implementation will be leveraged to match section of texts in email body and/or attachments.

#### Zero Knowledge Proofs:
Aztec's zkemail.nr will be used to create zkps of the email content and sensitive information eg: sender, receiver and mail server without disclosing it.

#### Challenge Selection
This project will use zkEmail and zkRegex to prove aspects of the emails specific to trasactions without exposing sensitive information.


### Team information
Krish | [Github](https://github.com/ronykris)

A web3 developer since the last 7 years with 


### Technical Approach
#### High level outline of main components
Using Aztec's zkRegex and zkEmail implementation build proving systems. 
Proofs for the sender's, receiver's email. Email provider the DKIM signature and necessary content in the email to prove the txn has occurred.

##### Any specific Aztec tools or features you used
zkEmail.nr and noir_string_search

### Expected Outcomes

#### What do you hope to achieve by the end of the challenge(s)?
By the end of this challenge I hope to achieve the following:
- Build proving circuits for txn emails (fiat and crypto)
- Create soulbound non transferable token on Aztec.nr that can be used to prove that a txn has occurred whenever needed.
- Sensitive info will be obscured. The verifier will only be provided by the token with the proof embedded.