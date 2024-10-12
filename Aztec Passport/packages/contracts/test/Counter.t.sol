// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";
import {Counter} from "src/Counter.sol";

import {SetUp} from "test/base/SetUp.t.sol";

contract CounterTest is Test, SetUp {
    Vm.Wallet public alice;
    Vm.Wallet public bob;

    function setUp() public virtual override {
        super.setUp();
        alice = vm.createWallet("alice");
        bob = vm.createWallet("bob");
    }

    function test_Increment() public {
        vm.startBroadcast(owner.addr);

        vm.expectEmit(true, true, true, true);
        emit NumberIncremented(owner.addr);
        counter.increment();

        assertEq(counter.number(), 1);

        vm.stopBroadcast();
    }

    function test_SetNumber() public {
        vm.startBroadcast(owner.addr);

        vm.expectEmit(true, true, true, true);
        emit NumberSet(owner.addr, 1);
        counter.setNumber(1);

        assertEq(counter.number(), 1);

        vm.stopBroadcast();
    }
}
