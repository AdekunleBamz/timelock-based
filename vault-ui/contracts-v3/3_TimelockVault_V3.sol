// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TimelockVault V3
 * @notice A vault for time-locked USDC deposits with configurable lock periods
 * @dev Version 3.0 - Fresh deployment with improved features
 * 
 * FEATURES:
 * - Minimum deposit: 0.11 USDC
 * - Emergency withdrawal fee: 5%
 * - Pausable functionality
 * - Configurable minimum deposit
 * - Version tracking
 */

interface ILockOptions {
    struct LockOption {
        uint256 duration;
        uint256 bonusRate;
        bool active;
    }
    function getLockOption(uint8 optionId) external view returns (LockOption memory);
}

interface IVaultTreasury {
    function receiveFees(uint256 amount) external;
}

contract TimelockVaultV3 is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    string public constant VERSION = "3.0.0";
    
    // ============ State Variables ============
    IERC20 public immutable usdc;
    ILockOptions public lockOptions;
    IVaultTreasury public treasury;
    
    uint256 public minimumDeposit = 110000; // 0.11 USDC (6 decimals)
    uint256 public emergencyWithdrawFee = 500; // 5% = 500 basis points
    uint256 public constant FEE_DENOMINATOR = 10000;
    uint256 public constant MAX_EMERGENCY_FEE = 2000; // Max 20% fee
    
    uint256 public depositCounter;
    uint256 public totalDeposits;
    uint256 public totalWithdrawn;

    // ============ Structs ============
    struct Deposit {
        address owner;
        uint256 amount;
        uint256 lockEndTime;
        bool withdrawn;
        uint8 lockOptionId;
    }

    // ============ Mappings ============
    mapping(uint256 => Deposit) public deposits;
    mapping(address => uint256[]) public userDeposits;

    // ============ Events ============
    event DepositMade(
        uint256 indexed depositId,
        address indexed owner,
        uint256 amount,
        uint256 lockEndTime,
        uint8 lockOptionId
    );
    event WithdrawalMade(
        uint256 indexed depositId,
        address indexed owner,
        uint256 amount,
        uint256 bonus
    );
    event EmergencyWithdrawal(
        uint256 indexed depositId,
        address indexed owner,
        uint256 amountReturned,
        uint256 feePaid
    );
    event MinimumDepositUpdated(uint256 oldAmount, uint256 newAmount);
    event EmergencyFeeUpdated(uint256 oldFee, uint256 newFee);
    event TreasuryUpdated(address oldTreasury, address newTreasury);
    event LockOptionsUpdated(address oldLockOptions, address newLockOptions);

    // ============ Constructor ============
    constructor(
        address _usdc,
        address _lockOptions,
        address _treasury
    ) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_lockOptions != address(0), "Invalid LockOptions address");
        require(_treasury != address(0), "Invalid Treasury address");
        
        usdc = IERC20(_usdc);
        lockOptions = ILockOptions(_lockOptions);
        treasury = IVaultTreasury(_treasury);
    }

    // ============ Core Functions ============

    /**
     * @notice Deposit USDC with a specific lock option
     * @param amount Amount of USDC to deposit (in 6 decimals)
     * @param lockOptionId The lock option ID (0-3)
     */
    function deposit(uint256 amount, uint8 lockOptionId) external nonReentrant whenNotPaused {
        require(amount >= minimumDeposit, "Below minimum deposit");
        
        ILockOptions.LockOption memory option = lockOptions.getLockOption(lockOptionId);
        require(option.active, "Lock option not active");

        usdc.safeTransferFrom(msg.sender, address(this), amount);

        uint256 depositId = depositCounter++;
        uint256 lockEndTime = block.timestamp + option.duration;

        deposits[depositId] = Deposit({
            owner: msg.sender,
            amount: amount,
            lockEndTime: lockEndTime,
            withdrawn: false,
            lockOptionId: lockOptionId
        });

        userDeposits[msg.sender].push(depositId);
        totalDeposits += amount;

        emit DepositMade(depositId, msg.sender, amount, lockEndTime, lockOptionId);
    }

    /**
     * @notice Withdraw a matured deposit with bonus
     * @param depositId The ID of the deposit to withdraw
     */
    function withdraw(uint256 depositId) external nonReentrant whenNotPaused {
        Deposit storage dep = deposits[depositId];
        
        require(dep.owner == msg.sender, "Not deposit owner");
        require(!dep.withdrawn, "Already withdrawn");
        require(block.timestamp >= dep.lockEndTime, "Lock period not ended");

        dep.withdrawn = true;

        ILockOptions.LockOption memory option = lockOptions.getLockOption(dep.lockOptionId);
        uint256 bonus = (dep.amount * option.bonusRate) / FEE_DENOMINATOR;
        uint256 totalAmount = dep.amount + bonus;

        totalWithdrawn += dep.amount;

        usdc.safeTransfer(msg.sender, totalAmount);

        emit WithdrawalMade(depositId, msg.sender, dep.amount, bonus);
    }

    /**
     * @notice Emergency withdraw before lock ends (with 5% penalty)
     * @param depositId The ID of the deposit to withdraw
     */
    function emergencyWithdraw(uint256 depositId) external nonReentrant whenNotPaused {
        Deposit storage dep = deposits[depositId];
        
        require(dep.owner == msg.sender, "Not deposit owner");
        require(!dep.withdrawn, "Already withdrawn");

        dep.withdrawn = true;

        uint256 fee = (dep.amount * emergencyWithdrawFee) / FEE_DENOMINATOR;
        uint256 amountAfterFee = dep.amount - fee;

        totalWithdrawn += dep.amount;

        // Send fee to treasury
        if (fee > 0) {
            usdc.safeTransfer(address(treasury), fee);
            treasury.receiveFees(fee);
        }

        // Send remaining to user
        usdc.safeTransfer(msg.sender, amountAfterFee);

        emit EmergencyWithdrawal(depositId, msg.sender, amountAfterFee, fee);
    }

    // ============ View Functions ============

    /**
     * @notice Get deposit details
     */
    function getDeposit(uint256 depositId) external view returns (
        address owner,
        uint256 amount,
        uint256 lockEndTime,
        bool withdrawn,
        uint8 lockOptionId
    ) {
        Deposit storage dep = deposits[depositId];
        return (dep.owner, dep.amount, dep.lockEndTime, dep.withdrawn, dep.lockOptionId);
    }

    /**
     * @notice Get all deposit IDs for a user
     */
    function getUserDeposits(address user) external view returns (uint256[] memory) {
        return userDeposits[user];
    }

    /**
     * @notice Get count of user deposits
     */
    function getUserDepositCount(address user) external view returns (uint256) {
        return userDeposits[user].length;
    }

    /**
     * @notice Check if a deposit can be withdrawn
     */
    function canWithdraw(uint256 depositId) external view returns (bool) {
        Deposit storage dep = deposits[depositId];
        return !dep.withdrawn && block.timestamp >= dep.lockEndTime;
    }

    /**
     * @notice Get time remaining for a deposit
     */
    function getTimeRemaining(uint256 depositId) external view returns (uint256) {
        Deposit storage dep = deposits[depositId];
        if (dep.withdrawn || block.timestamp >= dep.lockEndTime) {
            return 0;
        }
        return dep.lockEndTime - block.timestamp;
    }

    /**
     * @notice Get vault statistics
     */
    function getVaultStats() external view returns (
        uint256 _totalDeposits,
        uint256 _totalWithdrawn,
        uint256 _currentBalance,
        uint256 _depositCount
    ) {
        return (
            totalDeposits,
            totalWithdrawn,
            usdc.balanceOf(address(this)),
            depositCounter
        );
    }

    // ============ Admin Functions ============

    /**
     * @notice Update minimum deposit amount
     */
    function setMinimumDeposit(uint256 _minimumDeposit) external onlyOwner {
        require(_minimumDeposit > 0, "Must be > 0");
        uint256 oldAmount = minimumDeposit;
        minimumDeposit = _minimumDeposit;
        emit MinimumDepositUpdated(oldAmount, _minimumDeposit);
    }

    /**
     * @notice Update emergency withdrawal fee
     */
    function setEmergencyWithdrawFee(uint256 _fee) external onlyOwner {
        require(_fee <= MAX_EMERGENCY_FEE, "Fee too high");
        uint256 oldFee = emergencyWithdrawFee;
        emergencyWithdrawFee = _fee;
        emit EmergencyFeeUpdated(oldFee, _fee);
    }

    /**
     * @notice Update treasury address
     */
    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        address oldTreasury = address(treasury);
        treasury = IVaultTreasury(_treasury);
        emit TreasuryUpdated(oldTreasury, _treasury);
    }

    /**
     * @notice Update lock options contract
     */
    function setLockOptions(address _lockOptions) external onlyOwner {
        require(_lockOptions != address(0), "Invalid lock options");
        address oldLockOptions = address(lockOptions);
        lockOptions = ILockOptions(_lockOptions);
        emit LockOptionsUpdated(oldLockOptions, _lockOptions);
    }

    /**
     * @notice Pause the contract
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @notice Unpause the contract
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    /**
     * @notice Emergency token recovery (for accidentally sent tokens)
     * @dev Cannot withdraw deposited USDC beyond dust amounts
     */
    function recoverToken(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        if (token == address(usdc)) {
            // For USDC, only allow recovering dust (excess beyond tracked deposits)
            uint256 expectedBalance = totalDeposits - totalWithdrawn;
            uint256 actualBalance = usdc.balanceOf(address(this));
            require(actualBalance > expectedBalance, "No excess to recover");
            uint256 recoverable = actualBalance - expectedBalance;
            require(amount <= recoverable, "Amount exceeds recoverable");
        }
        IERC20(token).safeTransfer(to, amount);
    }
}
