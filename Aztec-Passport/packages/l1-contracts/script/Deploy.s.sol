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
        verifier = new UltraVerifier();
        portal = new AztecPassportPortal(registry, address(ens), address(verifier));

        string memory addrStr = vm.toString(address(portal));

        vm.writeJson(addrStr, "../l2-contracts/config.json", ".PORTAL_L1_ADDRESS");
        vm.writeJson(addrStr, "../../apps/www/config.json", ".PORTAL_L1_ADDRESS");
        vm.writeJson(vm.toString(address(ens)), "../../apps/www/config.json", ".MOCK_ENS_ADDRESS");

        console.log("Deployed AztecPassportPortal at", address(portal));
        vm.stopBroadcast();
    }
}
