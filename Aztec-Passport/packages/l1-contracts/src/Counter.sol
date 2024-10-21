// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract Counter {
    uint256 public number;
    address public owner;

    event NumberSet(address indexed setter, uint256 newNumber);
    event NumberIncremented(address indexed incrementer);

    constructor(address _initialOwner) {
        owner = _initialOwner;
    }

    function setNumber(uint256 newNumber) public {
        number = newNumber;
        emit NumberSet(msg.sender, newNumber);
    }

    function increment() public {
        number++;
        emit NumberIncremented(msg.sender);
    }
}
