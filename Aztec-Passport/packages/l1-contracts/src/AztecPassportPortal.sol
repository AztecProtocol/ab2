// SPDX-License-Identifier: MIT
pragma solidity >=0.8.18;

// Messaging
import {IRegistry} from "@aztec/l1-contracts/core/interfaces/messagebridge/IRegistry.sol";
import {IInbox} from "@aztec/l1-contracts/core/interfaces/messagebridge/IInbox.sol";
import {IRollup} from "@aztec/l1-contracts/core/interfaces/IRollup.sol";
import {IOutbox} from "@aztec/l1-contracts/core/interfaces/messagebridge/IOutbox.sol";
import {DataStructures} from "@aztec/l1-contracts/core/libraries/DataStructures.sol";
import {Hash} from "@aztec/l1-contracts/core/libraries/Hash.sol";

// Services
import {MockENS} from "./mocks/MockENS.sol";
import {UltraVerifier} from "./verifiers/KYCAge.sol";

contract AztecPassportPortal {
    using Hash for DataStructures.L1ToL2Msg;

    IRegistry public registry;
    MockENS public ens;
    UltraVerifier public verifier;

    bytes32 public _lastMessageId;

    error NoENSFound();
    error NotEnoughBalance();
    error KYCAgeVerificationFailed();

    constructor(address _registry, address _ens, address _verifier) {
        registry = IRegistry(_registry);
        ens = MockENS(_ens);
        verifier = UltraVerifier(_verifier);
    }

    function verifyENS(bytes32 _secretHash, bytes32 _l2Address) public {
        bool hasENS = ens.hasEns(msg.sender);
        if (!hasENS) {
            revert NoENSFound();
        }

        bytes32 content = bytes32(uint256(1));
        _passMessageToL2(content, _secretHash, _l2Address);
    }

    function verifyBalance(bytes32 _secretHash, bytes32 _l2Address) public {
        // check ether balance >= 0.005 ETH
        bool hasEnoughBalance = msg.sender.balance >= 0.005 ether;
        if (!hasEnoughBalance) {
            revert NotEnoughBalance();
        }

        bytes32 content = bytes32(uint256(1));
        _passMessageToL2(content, _secretHash, _l2Address);
    }

    function verifyAge(bytes memory proof, bytes32 _secretHash, bytes32 _l2Address) public {
        // Age Claim in JWT using verifier
        bytes32[] memory publicInputs = new bytes32[](2);
        publicInputs[0] = bytes32(uint256(1729830622));
        publicInputs[1] = bytes32(uint256(1));

        bool verified = verifier.verify(proof, publicInputs);
        if (!verified) {
            revert KYCAgeVerificationFailed();
        }

        bytes32 content = bytes32(uint256(1));
        _passMessageToL2(content, _secretHash, _l2Address);
    }

    function _passMessageToL2(bytes32 _content, bytes32 _secretHash, bytes32 _l2Address) internal returns (bytes32) {
        IInbox inbox = IRollup(registry.getRollup()).INBOX();
        DataStructures.L1Actor memory l1Actor = DataStructures.L1Actor({actor: address(this), chainId: block.chainid});
        DataStructures.L2Actor memory l2Actor = DataStructures.L2Actor({actor: _l2Address, version: 1});

        DataStructures.L1ToL2Msg memory expectedMessage =
            DataStructures.L1ToL2Msg({sender: l1Actor, recipient: l2Actor, content: _content, secretHash: _secretHash});

        bytes32 expectedLeaf = expectedMessage.sha256ToField();

        bytes32 messageId = inbox.sendL2Message(l2Actor, _content, _secretHash);

        require(messageId == expectedLeaf, "Message ID does not match expected leaf");

        _lastMessageId = messageId;
        return messageId;
    }
}
