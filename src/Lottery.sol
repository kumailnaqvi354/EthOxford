// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Strings} from "@openzeppelin-contracts/utils/Strings.sol";
import {ContractRegistry} from "dependencies/flare-periphery-0.0.1/src/coston2/ContractRegistry.sol";
import {RandomNumberV2Interface} from "dependencies/flare-periphery-0.0.1/src/coston2/RandomNumberV2Interface.sol";
import {Ownable} from "@openzeppelin-contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin-contracts/token/ERC20/IERC20.sol";
import {FtsoV2Interface} from "dependencies/flare-periphery-0.0.1/src/coston2/FtsoV2Interface.sol";

contract FlareLottery is Ownable {
    IERC20 public lotteryToken;
    RandomNumberV2Interface _generator;
    FtsoV2Interface ftso;
    address[] public players;

    uint256 public ticketPrice;
    uint256 public lotteryEndTime;
    uint256 public rngRequestId;
    uint256 public duration;
    uint256 public lotterPrice = 1e18;
    uint16 private _secretNumber;
    bool public lotteryActive;

    string public message;

    event TicketPurchased(address indexed player);
    event LotteryWinner(address indexed winner, uint256 prize);
    event LotteryStarted(uint256 endTime);

    error InsufficientFunds();
    error InvalidAmount();
    error InvalidDuration();
    error LotterNotAcitve();
    error LotteryEnded();
    error RNGNotAvailable();
    constructor(
        address _lotteryToken,
        uint256 _ticketPrice
    ) Ownable(msg.sender) {
        lotteryToken = IERC20(_lotteryToken);
        ticketPrice = _ticketPrice;
        emit LotteryStarted(lotteryEndTime);
        ftso = ContractRegistry.getFtsoV2();

        _generator = ContractRegistry.getRandomNumberV2();
    }

    function addLottery(uint256 _duration) public onlyOwner {
        if (_duration == 0) {
            revert InvalidDuration();
        }
        duration = block.timestamp + _duration;
        lotteryActive = true;
    }

    function buyTicket() external payable {
        if (!lotteryActive) {
            revert LotterNotAcitve();
        }
        if (block.timestamp > duration) {
            revert LotteryEnded();
        }
        uint256 price = getPriceInFLR();

        // Transfer ticket price to contract
        lotteryToken.transferFrom(msg.sender, address(this), ticketPrice);
        players.push(msg.sender);

        emit TicketPurchased(msg.sender);
    }

    function finalizeLottery() external onlyOwner {
        (uint256 randomNumber, , ) = _generator.getRandomNumber();
        if (randomNumber == 0) {
            revert RNGNotAvailable();
        }

        // Select winner
        address winner = players[randomNumber % players.length];
        uint256 prize = lotteryToken.balanceOf(address(this));

        // Transfer prize to winner
        lotteryToken.transfer(winner, prize);
        lotteryActive = false;
        emit LotteryWinner(winner, prize);

        // Reset for next round
        delete players;
        rngRequestId = 0;
    }

    function getPriceInFLR() public returns (uint price) {
        uint value = getFeedById();
        price = (lotterPrice) / value;
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
