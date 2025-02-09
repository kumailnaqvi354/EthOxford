// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Script} from "dependencies/forge-std-1.9.5/src/Script.sol";
import {FLRToken} from "src/FLRToken.sol";

// Run with command
//      forge script script/FLRToken.s.sol:Deploy 100 --sig "run(uint256)" --private-key $PRIVATE_KEY --rpc-url $COSTON2_RPC_URL --etherscan-api-key $FLARE_API_KEY --broadcast --verify
//      forge script script/FLRToken.s.sol:Deploy 100 --sig "run(uint256)" --private-key $PRIVATE_KEY --rpc-url $COSTON2_RPC_URL --etherscan-api-key $FLARE_API_KEY --resume --verify --verifier-url https://api.routescan.io/v2/network/testnet/evm/114/etherscan/api

//      forge script script/FLRToken.s.sol:Deploy 100 --sig "run(uint256)" --private-key $PRIVATE_KEY --rpc-url $COSTON2_RPC_URL --etherscan-api-key "X" --broadcast --verify --verifier-url https://api.routescan.io/v2/network/testnet/evm/114/etherscan/api

contract Deploy is Script {
    FLRToken flrToken;

    function run(uint256 _max) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        flrToken = new FLRToken();

        vm.stopBroadcast();
    }
}
