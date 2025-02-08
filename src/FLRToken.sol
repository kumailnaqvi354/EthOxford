// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {ERC20} from "@openzeppelin-contracts/token/ERC20/ERC20.sol";
import {Strings} from "@openzeppelin-contracts/utils/Strings.sol";
import {ContractRegistry} from "dependencies/flare-periphery-0.0.1/src/coston2/ContractRegistry.sol";
import {FtsoV2Interface} from "dependencies/flare-periphery-0.0.1/src/coston2/FtsoV2Interface.sol";
// import {TestFtsoV2Interface} from "@flarenetwork/flare-periphery-contracts/coston2/TestFtsoV2Interface.sol";

contract FLRToken is ERC20 {
    address public owner;

    FtsoV2Interface ftso;
    string public message;

    uint256 tokenPrice = 1; // represents 1 usd

    error InvalidAmount();
    error InsufficientFunds();
    constructor() ERC20("FLRToken", "FLT") {
        owner = msg.sender;
        _mint(address(this), type(uint256).max);
        ftso = ContractRegistry.getFtsoV2();
    }

    function BuyToken(uint256 _amount) external payable {
        if (_amount == 0) {
            revert InvalidAmount();
        }
        uint256 price = getPriceInFLR(_amount);
        if (msg.value < price) {
            revert InsufficientFunds();
        }
        // payable(owner).transfer(msg.value);
        (bool success, ) = payable(owner).call{value: msg.value, gas: 2300}("");
        _transfer(address(this), msg.sender, _amount);
    }

    function getPriceInFLR(
        uint256 _amountInPurchase
    ) public returns (uint price) {
        if (_amountInPurchase == 0) {
            revert InvalidAmount();
        }
        uint value = getFeedById();
        price = (_amountInPurchase * tokenPrice) / value;
    }

    function getFeedById() public returns (uint) {
        bytes21 id = 0x01464c522f55534400000000000000000000000000;
        (uint256 value, int8 decimals, uint64 timestamp) = ftso.getFeedById(id);
        // string memory idString = string(id);
        message = string.concat(
            "The value of feed ",
            "0x01464c522f55534400000000000000000000000000",
            " at time ",
            Strings.toString(timestamp),
            " was ",
            Strings.toString(value),
            "e",
            Strings.toStringSigned(decimals)
        );
        return (value * 1e18) / 1e7;
    }
    receive() external payable {}
}
