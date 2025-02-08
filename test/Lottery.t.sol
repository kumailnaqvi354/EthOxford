// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import {Test, console} from "dependencies/forge-std-1.9.5/src/Test.sol";
import {FlareLottery} from "src/Lottery.sol";
import {FLRToken} from "src/FLRToken.sol";

contract FlareLotteryTest is Test {
    FlareLottery lottery;
    FLRToken FLT;
    address alice;
    address spencer;
    address bob;
    address owner;

    function setUp() public {
        owner = address(0x5);
        alice = address(0x1);
        spencer = address(0x2);
        bob = address(0x3);

        vm.startPrank(owner);
        FLT = new FLRToken();
        lottery = new FlareLottery(address(FLT), 1e18);
        vm.stopPrank();
    }

    function testDuration() public {
        vm.prank(owner);
        lottery.addLottery(1 weeks);
    }

    function testDurationNonOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        lottery.addLottery(1 weeks);
    }

    function testBuyLottery() public {
        vm.prank(owner);
        lottery.addLottery(1 weeks);
        vm.startPrank(alice);
        vm.deal(alice, 1000e18);
        FLT.BuyToken{value: 1e8}(1000 ether);
        assertEq(FLT.balanceOf(address(alice)), 1000 ether);
        FLT.approve(address(lottery), 100000 ether);
        lottery.buyTicket{value: 0.1 ether}();
        assertEq(lottery.players(0), address(alice));
        vm.stopPrank();
    }

    receive() external payable {} // Add this function to accept ETH
}
