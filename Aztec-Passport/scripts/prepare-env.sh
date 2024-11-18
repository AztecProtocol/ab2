#!/bin/bash
pnpm i

# Build L2 Contracts
cd packages/l2-contracts
bun prepare-env

cd ../l1-contracts

# Compile L1 Contracts
cd packages/l1-contracts
forge compile