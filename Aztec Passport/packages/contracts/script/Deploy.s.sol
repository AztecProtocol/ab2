// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Counter} from "src/Counter.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Counter with deployer address", deployerAddress);

        Counter counter = new Counter(deployerAddress);

        console.log("Deployed Counter at address: %s", address(counter));
        vm.stopBroadcast();
    }
}
