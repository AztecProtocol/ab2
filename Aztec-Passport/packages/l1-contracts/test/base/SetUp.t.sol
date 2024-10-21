// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2 as console, Vm} from "forge-std/Test.sol";
import {Counter} from "src/Counter.sol";

contract SetUp is Test {
    Counter public counter;
    Vm.Wallet public owner;

    bool public __setUpDone;

    event NumberSet(address indexed setter, uint256 newNumber);
    event NumberIncremented(address indexed incrementer);

    function testSetUp() public {
        // Prevents being counted in Foundry Coverage
    }

    function setUp() public virtual {
        if (__setUpDone) {
            return;
        }
        owner = vm.createWallet("owner");
        counter = new Counter(owner.addr);
        __setUpDone = true;
    }
}
