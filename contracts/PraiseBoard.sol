// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PraiseBoard is ReentrancyGuard {
    address public owner;

    // The event declares the note parameter as requested.
    event TipReceived(address indexed sender, uint256 amount, string note);

    constructor() {
        owner = msg.sender;
    }

    // A length bound is enforced in the contract itself
    function tip(string calldata note) external payable {
        require(msg.value > 0, "Tip must be greater than 0");
        require(bytes(note).length <= 256, "Note is too long (max 256 chars)");

        // The emitted amount is taken from msg.value
        // The recorded sender is taken from msg.sender
        // The event declares the note parameter
        emit TipReceived(msg.sender, msg.value, note);
    }

    // The contract state is written before the external transfer (or reentrancy guard used).
    // The withdraw function restricts the caller to the owner.
    function withdraw() external nonReentrant {
        require(msg.sender == owner, "Only owner can withdraw");
        
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }
}
