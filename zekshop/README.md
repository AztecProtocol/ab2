# ZeKshop

### [ZeKshop Demo](https://www.youtube.com/watch?v=MIDV-vBfs4s)

### [ZeKshop Whitepaper](./ZeKshopWhitepaper.pdf)

## Abstract

ZeKshop addresses the severe privacy issues in purchasing erotic merchandise by using Aztec, a privacy-first Layer 2 on Ethereum. ZeKshop is a privacy-centric adult store using cryptography to protect user anonymity. Purchases are secured via Aztec Layer 2 with zero-knowledge proofs, while zkEmail library enables private, verified reviews and communication with the store. Loyal customers can earn on-chain NFT vouchers for free products, ensuring both privacy and rewards. The purchases are being privately collected with the parcel-receiving machines BoxNow. This document outlines the key features of ZeKshop, including private payment methods, order receipt through BoxNow, secure communication and privately sharing opinion on product using zkemail.

## Diagram

![ZeKshop diagram](docs_imgs/ZeKshop_full_diagram.png)

## Technical guidance

### Run ZeKshop locally

To run the ZeKshop client locally:

1. Go to `cd zekshop/app`

2. Run `yarn` to install necessary dependencies

3. Run `yarn dev` to run the client locally on [http://localhost:3000](http://localhost:3000)

> [!IMPORTANT]
>
> As the buying product functionality is still actively worked upon, you'll have to send an email manually
> The steps are the following:
> Go to `cd zekshop/app/page/api/sendEmail.js`
> Change the `email` variable to your email address.
> In the directory you are (`cd zekshop/app/page/api/sendEmail.js`) execute `node sendEmail.js`
> Check your email, you have an email by ZeKshop!
> Click on the vertical three dots for `more` options
> Click `Show original` button
> Click `Download Original` button on the bottom-left
> You can now drag and drop it and prove that you bought product with a specific ID!

### Giving an opinion on a product

1. Click `Opinion` button

2. Dialog pops up where you have to drag and drop your `.eml` email metadata

3. Verifying in process...

4. You've verified you have received email from ZeKshop for successful purchase! (aka you bought that product).

> [!IMPORTANT]
>
> The compiled binaries of the `verify_purchase` circuit are already in `zekshop/app/app/assets` so you **don't have** to compile it before trying to verify an email!

## [ZeKshop's X (formerly Twitter)](https://x.com/ZeKshopOfficial)
