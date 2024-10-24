// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";
import {AztecPassportPortal} from "src/AztecPassportPortal.sol";
import {MockENS} from "src/mocks/MockENS.sol";

contract CounterTest is Test {
    AztecPassportPortal public portal;
    MockENS public ens;
    Vm.Wallet public owner;
    Vm.Wallet public alice;
    Vm.Wallet public bob;

    function setUp() public {
        owner = vm.createWallet("owner");
        alice = vm.createWallet("alice");
        bob = vm.createWallet("bob");

        ens = new MockENS();
        address registry = address(0);
        bytes32 l2Bridge = bytes32(0);
        portal = new AztecPassportPortal(registry, l2Bridge, address(ens));
    }
}
