// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title VaultRouter V3
 * @notice Helper contract for interacting with the TimelockVault
 * @dev Version 3.0 - Updated interface for TimelockVaultV3
 */

interface ITimelockVaultV3 {
    function deposit(uint256 amount, uint8 lockOptionId) external;
    function withdraw(uint256 depositId) external;
    function emergencyWithdraw(uint256 depositId) external;
    function getDeposit(uint256 depositId) external view returns (
        address owner,
        uint256 amount,
        uint256 lockEndTime,
        bool withdrawn,
        uint8 lockOptionId
    );
    function getUserDeposits(address user) external view returns (uint256[] memory);
    function minimumDeposit() external view returns (uint256);
    function canWithdraw(uint256 depositId) external view returns (bool);
    function getTimeRemaining(uint256 depositId) external view returns (uint256);
    function getVaultStats() external view returns (
        uint256 totalDeposits,
        uint256 totalWithdrawn,
        uint256 currentBalance,
        uint256 depositCount
    );
}

interface ILockOptions {
    struct LockOption {
        uint256 duration;
        uint256 bonusRate;
        bool active;
    }
    function getLockOption(uint8 optionId) external view returns (LockOption memory);
    function getAllLockOptions() external view returns (LockOption[] memory);
    function getLockOptionsCount() external view returns (uint256);
}

contract VaultRouterV3 is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    string public constant VERSION = "3.0.0";
    
    IERC20 public immutable usdc;
    ITimelockVaultV3 public vault;
    ILockOptions public lockOptions;

    event VaultUpdated(address oldVault, address newVault);
    event LockOptionsUpdated(address oldLockOptions, address newLockOptions);
    event DepositedViaRouter(address indexed user, uint256 amount, uint8 lockOptionId);

    constructor(
        address _usdc,
        address _vault,
        address _lockOptions
    ) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_vault != address(0), "Invalid vault address");
        require(_lockOptions != address(0), "Invalid lock options address");
        
        usdc = IERC20(_usdc);
        vault = ITimelockVaultV3(_vault);
        lockOptions = ILockOptions(_lockOptions);
    }

    /**
     * @notice Deposit USDC to the vault with approval in one transaction
     * @dev User must have approved this router to spend their USDC
     * @param amount Amount of USDC to deposit
     * @param lockOptionId Lock period option (0-3)
     */
    function depositToVault(uint256 amount, uint8 lockOptionId) external nonReentrant {
        require(amount >= vault.minimumDeposit(), "Below minimum deposit");
        
        // Transfer USDC from user to router
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        
        // Approve vault to spend USDC
        usdc.approve(address(vault), amount);
        
        // Deposit to vault
        vault.deposit(amount, lockOptionId);
        
        emit DepositedViaRouter(msg.sender, amount, lockOptionId);
    }

    /**
     * @notice Get all active deposits for a user with full details
     */
    function getUserActiveDeposits(address user) external view returns (
        uint256[] memory depositIds,
        uint256[] memory amounts,
        uint256[] memory lockEndTimes,
        uint8[] memory lockOptionIds,
        uint256[] memory timeRemaining
    ) {
        uint256[] memory allIds = vault.getUserDeposits(user);
        
        // Count active deposits
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allIds.length; i++) {
            (,,,bool withdrawn,) = vault.getDeposit(allIds[i]);
            if (!withdrawn) {
                activeCount++;
            }
        }
        
        // Populate arrays
        depositIds = new uint256[](activeCount);
        amounts = new uint256[](activeCount);
        lockEndTimes = new uint256[](activeCount);
        lockOptionIds = new uint8[](activeCount);
        timeRemaining = new uint256[](activeCount);
        
        uint256 index = 0;
        for (uint256 i = 0; i < allIds.length; i++) {
            (address owner, uint256 amount, uint256 lockEndTime, bool withdrawn, uint8 lockOptionId) = vault.getDeposit(allIds[i]);
            if (!withdrawn && owner == user) {
                depositIds[index] = allIds[i];
                amounts[index] = amount;
                lockEndTimes[index] = lockEndTime;
                lockOptionIds[index] = lockOptionId;
                timeRemaining[index] = vault.getTimeRemaining(allIds[i]);
                index++;
            }
        }
    }

    /**
     * @notice Get total USDC locked by a user
     */
    function getUserTotalLocked(address user) external view returns (uint256 total) {
        uint256[] memory depositIds = vault.getUserDeposits(user);
        for (uint256 i = 0; i < depositIds.length; i++) {
            (, uint256 amount,, bool withdrawn,) = vault.getDeposit(depositIds[i]);
            if (!withdrawn) {
                total += amount;
            }
        }
    }

    /**
     * @notice Get withdrawable deposits (lock period ended)
     */
    function getUserWithdrawableDeposits(address user) external view returns (
        uint256[] memory depositIds,
        uint256[] memory amounts
    ) {
        uint256[] memory allIds = vault.getUserDeposits(user);
        
        // Count withdrawable
        uint256 count = 0;
        for (uint256 i = 0; i < allIds.length; i++) {
            if (vault.canWithdraw(allIds[i])) {
                count++;
            }
        }
        
        depositIds = new uint256[](count);
        amounts = new uint256[](count);
        
        uint256 index = 0;
        for (uint256 i = 0; i < allIds.length; i++) {
            if (vault.canWithdraw(allIds[i])) {
                (, uint256 amount,,,) = vault.getDeposit(allIds[i]);
                depositIds[index] = allIds[i];
                amounts[index] = amount;
                index++;
            }
        }
    }

    /**
     * @notice Calculate expected bonus for a deposit
     */
    function calculateBonus(uint256 amount, uint8 lockOptionId) external view returns (uint256) {
        ILockOptions.LockOption memory option = lockOptions.getLockOption(lockOptionId);
        return (amount * option.bonusRate) / 10000;
    }

    /**
     * @notice Get all lock options with their details
     */
    function getAllLockOptions() external view returns (ILockOptions.LockOption[] memory) {
        return lockOptions.getAllLockOptions();
    }

    /**
     * @notice Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 totalDeposits,
        uint256 totalWithdrawn,
        uint256 currentBalance,
        uint256 depositCount
    ) {
        return vault.getVaultStats();
    }

    /**
     * @notice Check if a deposit can be withdrawn (lock period ended)
     */
    function canWithdraw(uint256 depositId) external view returns (bool) {
        return vault.canWithdraw(depositId);
    }

    /**
     * @notice Get time remaining until deposit can be withdrawn
     */
    function getTimeRemaining(uint256 depositId) external view returns (uint256) {
        return vault.getTimeRemaining(depositId);
    }

    /**
     * @notice Get minimum deposit amount
     */
    function getMinimumDeposit() external view returns (uint256) {
        return vault.minimumDeposit();
    }

    // ============ Admin Functions ============

    function setVault(address _vault) external onlyOwner {
        require(_vault != address(0), "Invalid vault");
        address oldVault = address(vault);
        vault = ITimelockVaultV3(_vault);
        emit VaultUpdated(oldVault, _vault);
    }

    function setLockOptions(address _lockOptions) external onlyOwner {
        require(_lockOptions != address(0), "Invalid lock options");
        address oldLockOptions = address(lockOptions);
        lockOptions = ILockOptions(_lockOptions);
        emit LockOptionsUpdated(oldLockOptions, _lockOptions);
    }

    /**
     * @notice Emergency token recovery
     */
    function recoverToken(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        IERC20(token).safeTransfer(to, amount);
    }
}
