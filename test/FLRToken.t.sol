// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "dependencies/forge-std-1.9.5/src/Test.sol";
import {FLRToken} from "src/FLRToken.sol";
contract FLRTokenTest is Test {
    FLRToken FLT;
    address alice;
    address spencer;
    address bob;

    function setUp() public {
        FLT = new FLRToken();
        alice = address(0x1);
        spencer = address(0x2);
        bob = address(0x3);
    }

    receive() external payable {} // Add this function to accept ETH

    function testBuyToken() public {
        vm.prank(alice);
        vm.deal(alice, 1000e8);
        FLT.BuyToken{value: 1e8}(1000 ether);
        assertEq(FLT.balanceOf(address(alice)), 1000 ether);
    }
}
