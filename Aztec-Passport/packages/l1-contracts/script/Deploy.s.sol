// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {AztecPassportPortal} from "src/AztecPassportPortal.sol";
import {MockENS} from "src/mocks/MockENS.sol";
import {UltraVerifier} from "src/verifiers/KYCAge.sol";

contract DeployScript is Script {
    AztecPassportPortal public portal;
    MockENS public ens;
    UltraVerifier public verifier;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        ens = new MockENS();
        address registry = 0x5FbDB2315678afecb367f032d93F642f64180aa3;
        bytes32 l2Bridge = bytes32(0x1abe6c7f5c4caf04cbf7556495e08ad9c0a225a5f9d33554ae07285b13c494d7);
        verifier = new UltraVerifier();
        portal = new AztecPassportPortal(registry, l2Bridge, address(ens), address(verifier));

        console.log("Deployed AztecPassportPortal at", address(portal));
        vm.stopBroadcast();
    }
}
