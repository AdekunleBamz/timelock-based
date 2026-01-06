// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title VaultTreasury V2
 * @notice Treasury contract that receives fees from TimelockVaultV2
 * @dev Includes receiveFees function required by TimelockVaultV2
 */
contract VaultTreasuryV2 is Ownable {
    using SafeERC20 for IERC20;
    
    uint256 public totalFeesReceived;
    
    event FeesReceived(uint256 amount);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /**
     * @notice Called by TimelockVaultV2 when emergency fees are collected
     * @param amount The amount of fees received (informational only, tokens already transferred)
     */
    function receiveFees(uint256 amount) external {
        totalFeesReceived += amount;
        emit FeesReceived(amount);
    }

    function withdrawToken(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }

    function withdrawETH(address payable to, uint256 amount) external onlyOwner {
        (bool ok, ) = to.call{value: amount}("");
        require(ok, "ETH transfer failed");
    }

    receive() external payable {}
}
