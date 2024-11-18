#!/bin/bash
# go to ./packages/l1-contracts and run forge deploy
cd packages/l1-contracts

source .env && forge script --chain anvil script/Deploy.s.sol:DeployScript --rpc-url http://127.0.0.1:8545 --broadcast -vvvv

# go back to root directory
cd ../../
cd ./packages/l2-contracts

bun run deploy-local