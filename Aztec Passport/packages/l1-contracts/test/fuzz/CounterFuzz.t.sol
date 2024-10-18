// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";
import {Counter} from "src/Counter.sol";

import {SetUp} from "test/base/SetUp.t.sol";

contract CounterFuzzTest is Test, SetUp {
    Vm.Wallet public alice;
    Vm.Wallet public bob;

    function setUp() public virtual override {
        super.setUp();
        alice = vm.createWallet("alice");
        bob = vm.createWallet("bob");
    }

    function testFuzz_SetNumber(uint256 value) public {
        counter.setNumber(value);
        assertEq(counter.number(), value);
    }
}
