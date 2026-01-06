// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LockOptions V2
 * @notice Manages lock duration options for the TimelockVault
 * @dev Version 2.0 - Compatible with TimelockVaultV2, NO BONUSES (0% rates)
 */
contract LockOptionsV2 is Ownable {
    
    string public constant VERSION = "2.0.0";

    struct LockOption {
        uint256 duration;    // Lock duration in seconds
        uint256 bonusRate;   // Bonus rate in basis points (0 = no bonus)
        bool active;         // Whether this option is available
    }

    // Array of all lock options
    LockOption[] public lockOptions;

    // Events
    event LockOptionAdded(uint8 indexed optionId, uint256 duration, uint256 bonusRate);
    event LockOptionUpdated(uint8 indexed optionId, uint256 duration, uint256 bonusRate, bool active);

    constructor() Ownable(msg.sender) {
        // Initialize with 4 lock options, ALL WITH 0% BONUS
        
        // Option 0: 3 days (259200 seconds), 0% bonus
        lockOptions.push(LockOption({
            duration: 259200,
            bonusRate: 0,
            active: true
        }));

        // Option 1: 7 days (604800 seconds), 0% bonus
        lockOptions.push(LockOption({
            duration: 604800,
            bonusRate: 0,
            active: true
        }));

        // Option 2: 14 days (1209600 seconds), 0% bonus
        lockOptions.push(LockOption({
            duration: 1209600,
            bonusRate: 0,
            active: true
        }));

        // Option 3: 30 days (2592000 seconds), 0% bonus
        lockOptions.push(LockOption({
            duration: 2592000,
            bonusRate: 0,
            active: true
        }));

        emit LockOptionAdded(0, 259200, 0);
        emit LockOptionAdded(1, 604800, 0);
        emit LockOptionAdded(2, 1209600, 0);
        emit LockOptionAdded(3, 2592000, 0);
    }

    /**
     * @notice Get a specific lock option by ID
     * @param optionId The ID of the lock option (0-3)
     * @return The LockOption struct
     */
    function getLockOption(uint8 optionId) external view returns (LockOption memory) {
        require(optionId < lockOptions.length, "Invalid option ID");
        return lockOptions[optionId];
    }

    /**
     * @notice Get all lock options
     * @return Array of all LockOption structs
     */
    function getAllLockOptions() external view returns (LockOption[] memory) {
        return lockOptions;
    }

    /**
     * @notice Get total number of lock options
     * @return Number of lock options
     */
    function getLockOptionsCount() external view returns (uint256) {
        return lockOptions.length;
    }

    // ============ Admin Functions ============

    /**
     * @notice Add a new lock option
     * @param duration Lock duration in seconds
     * @param bonusRate Bonus rate in basis points (use 0 for no bonus)
     */
    function addLockOption(uint256 duration, uint256 bonusRate) external onlyOwner {
        require(duration > 0, "Duration must be > 0");
        require(lockOptions.length < 10, "Max 10 options");
        
        uint8 optionId = uint8(lockOptions.length);
        lockOptions.push(LockOption({
            duration: duration,
            bonusRate: bonusRate,
            active: true
        }));

        emit LockOptionAdded(optionId, duration, bonusRate);
    }

    /**
     * @notice Update an existing lock option
     * @param optionId The ID of the option to update
     * @param duration New duration in seconds
     * @param bonusRate New bonus rate in basis points
     * @param active Whether the option should be active
     */
    function updateLockOption(
        uint8 optionId,
        uint256 duration,
        uint256 bonusRate,
        bool active
    ) external onlyOwner {
        require(optionId < lockOptions.length, "Invalid option ID");
        require(duration > 0, "Duration must be > 0");

        lockOptions[optionId] = LockOption({
            duration: duration,
            bonusRate: bonusRate,
            active: active
        });

        emit LockOptionUpdated(optionId, duration, bonusRate, active);
    }

    /**
     * @notice Enable or disable a lock option
     * @param optionId The ID of the option
     * @param active Whether to enable or disable
     */
    function setOptionActive(uint8 optionId, bool active) external onlyOwner {
        require(optionId < lockOptions.length, "Invalid option ID");
        lockOptions[optionId].active = active;
        
        emit LockOptionUpdated(
            optionId,
            lockOptions[optionId].duration,
            lockOptions[optionId].bonusRate,
            active
        );
    }
}
