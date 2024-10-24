// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

// Messaging
import {IRegistry} from "@aztec/l1-contracts/core/interfaces/messagebridge/IRegistry.sol";
import {IInbox} from "@aztec/l1-contracts/core/interfaces/messagebridge/IInbox.sol";
import {IRollup} from "@aztec/l1-contracts/core/interfaces/IRollup.sol";
import {IOutbox} from "@aztec/l1-contracts/core/interfaces/messagebridge/IOutbox.sol";
import {DataStructures} from "@aztec/l1-contracts/core/libraries/DataStructures.sol";

// Services
import {MockENS} from "./mocks/MockENS.sol";

contract AztecPassportPortal {
    IRegistry public registry;
    MockENS public ens;
    bytes32 public l2Bridge;

    error NoENSFound();
    error NotEnoughBalance();

    constructor(address _registry, bytes32 _l2Bridge, address _ens) {
        registry = IRegistry(_registry);
        l2Bridge = _l2Bridge;
        ens = MockENS(_ens);
    }

    function verifyENS(bytes32 _secretHash) public {
        bool hasENS = ens.hasEns(msg.sender);
        if (!hasENS) {
            revert NoENSFound();
        }

        bytes32 content = bytes32(uint256(1));
        _passMessageToL2(content, _secretHash);
    }

    function verifyBalance(bytes32 _secretHash) public {
        // check ether balance >= 0.005 ETH
        bool hasEnoughBalance = msg.sender.balance >= 0.005 ether;
        if (!hasEnoughBalance) {
            revert NotEnoughBalance();
        }

        bytes32 content = bytes32(uint256(1));
        _passMessageToL2(content, _secretHash);
    }

    function _passMessageToL2(bytes32 _content, bytes32 _secretHash) internal {
        IInbox inbox = IRollup(registry.getRollup()).INBOX();
        DataStructures.L2Actor memory actor = DataStructures.L2Actor(l2Bridge, 1);

        inbox.sendL2Message(actor, _content, _secretHash);
    }
}
