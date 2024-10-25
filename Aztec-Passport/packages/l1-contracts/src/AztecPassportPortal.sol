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
import {UltraVerifier} from "./verifiers/KYCAge.sol";

contract AztecPassportPortal {
    IRegistry public registry;
    MockENS public ens;
    UltraVerifier public verifier;
    bytes32 public l2Bridge;

    bytes32 public _lastMessageId;

    error NoENSFound();
    error NotEnoughBalance();
    error KYCAgeVerificationFailed();

    constructor(address _registry, bytes32 _l2Bridge, address _ens, address _verifier) {
        registry = IRegistry(_registry);
        l2Bridge = _l2Bridge;
        ens = MockENS(_ens);
        verifier = UltraVerifier(_verifier);
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

    function verifyAge(bytes memory proof, bytes32 _secretHash) public {
        // Age Claim in JWT using verifier
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = bytes32(uint256(1729830622));
        publicInputs[1] = bytes32(uint256(1));

        bool verified = verifier.verify(proof, publicInputs);
        if (!verified) {
            revert KYCAgeVerificationFailed();
        }

        bytes32 content = bytes32(uint256(1));
        _passMessageToL2(content, _secretHash);
    }

    function _passMessageToL2(bytes32 _content, bytes32 _secretHash) internal returns (bytes32) {
        IInbox inbox = IRollup(registry.getRollup()).INBOX();
        DataStructures.L2Actor memory actor = DataStructures.L2Actor(l2Bridge, 1);

        bytes32 messageId = inbox.sendL2Message(actor, _content, _secretHash);
        _lastMessageId = messageId;
        return messageId;
    }
}
