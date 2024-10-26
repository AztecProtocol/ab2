// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";
import {AztecPassportPortal} from "src/AztecPassportPortal.sol";
import {MockENS} from "src/mocks/MockENS.sol";
import {UltraVerifier} from "src/verifiers/KYCAge.sol";

contract CounterTest is Test {
    AztecPassportPortal public portal;
    MockENS public ens;
    UltraVerifier public verifier;
    Vm.Wallet public owner;
    Vm.Wallet public alice;
    Vm.Wallet public bob;

    function setUp() public {
        owner = vm.createWallet("owner");
        alice = vm.createWallet("alice");
        bob = vm.createWallet("bob");

        ens = new MockENS();
        address registry = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
        verifier = new UltraVerifier();
        portal = new AztecPassportPortal(registry, address(ens), address(verifier));
    }
}
