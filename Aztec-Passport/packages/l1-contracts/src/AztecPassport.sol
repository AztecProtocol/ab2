// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

import {IRegistry} from "@aztec/l1-contracts/core/interfaces/messagebridge/IRegistry.sol";

contract AztecPassport {
    IRegistry public registry;

    constructor(address _registry) {
        registry = IRegistry(_registry);
    }
}
