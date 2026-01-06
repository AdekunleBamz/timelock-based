// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title VaultTreasury V3
 * @notice Treasury contract that receives fees from TimelockVault
 * @dev Version 3.0 - Fresh deployment, receives emergency withdrawal fees
 */
contract VaultTreasuryV3 is Ownable {
    using SafeERC20 for IERC20;
    
    string public constant VERSION = "3.0.0";
    
    uint256 public totalFeesReceived;
    
    event FeesReceived(uint256 amount);
    event TokenWithdrawn(address indexed token, address indexed to, uint256 amount);
    event ETHWithdrawn(address indexed to, uint256 amount);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Called by TimelockVault when emergency fees are collected
     * @param amount The amount of fees received (informational only, tokens already transferred)
     */
    function receiveFees(uint256 amount) external {
        totalFeesReceived += amount;
        emit FeesReceived(amount);
    }

    /**
     * @notice Withdraw ERC20 tokens from treasury
     * @param token The token address to withdraw
     * @param to The recipient address
     * @param amount The amount to withdraw
     */
    function withdrawToken(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        IERC20(token).safeTransfer(to, amount);
        emit TokenWithdrawn(token, to, amount);
    }

    /**
     * @notice Withdraw all of a specific token from treasury
     * @param token The token address to withdraw
     * @param to The recipient address
     */
    function withdrawAllToken(address token, address to) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No balance");
        IERC20(token).safeTransfer(to, balance);
        emit TokenWithdrawn(token, to, balance);
    }

    /**
     * @notice Withdraw ETH from treasury
     * @param to The recipient address
     * @param amount The amount to withdraw
     */
    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "ETH transfer failed");
        emit ETHWithdrawn(to, amount);
    }

    /**
     * @notice Get the balance of a specific token in the treasury
     * @param token The token address to check
     * @return The token balance
     */
    function getTokenBalance(address token) external view returns (uint256) {
        return IERC20(token).balanceOf(address(this));
    }

    receive() external payable {}
}
