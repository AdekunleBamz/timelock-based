// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title TimelockVault V2
 * @notice A vault for time-locked USDC deposits with configurable lock periods and bonus rates
 * @dev Version 2.0 - Improved with pausable, configurable minimum deposit, and reduced emergency fee
 * 
 * CHANGES FROM V1:
 * - Minimum deposit: 0.11 USDC (was 0.10 USDC)
 * - Emergency withdrawal fee: 5% (was 10%)
 * - Added Pausable functionality
 * - Added configurable minimum deposit
 * - Added version tracking
 * - Added events for configuration changes
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

contract TimelockVaultV2 is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // ============ Constants ============
    string public constant VERSION = "2.0.0";
    
    // ============ State Variables ============
    IERC20 public immutable usdc;
    ILockOptions public lockOptions;
    IVaultTreasury public treasury;
    
    uint256 public minimumDeposit = 110000; // 0.11 USDC (6 decimals) - UPDATED
    uint256 public emergencyWithdrawFee = 500; // 5% = 500 basis points - REDUCED FROM 10%
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
     * @param lockOptionId The lock option ID (0-5 typically)
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

    function getDeposit(uint256 depositId) external view returns (
        address owner,
        uint256 amount,
        uint256 lockEndTime,
        bool withdrawn,
        uint8 lockOptionId
    ) {
        Deposit memory dep = deposits[depositId];
        return (dep.owner, dep.amount, dep.lockEndTime, dep.withdrawn, dep.lockOptionId);
    }

    function getUserDeposits(address user) external view returns (uint256[] memory) {
        return userDeposits[user];
    }

    function getActiveDepositsCount(address user) external view returns (uint256 count) {
        uint256[] memory ids = userDeposits[user];
        for (uint256 i = 0; i < ids.length; i++) {
            if (!deposits[ids[i]].withdrawn) {
                count++;
            }
        }
    }

    function getTotalLocked() external view returns (uint256) {
        return totalDeposits - totalWithdrawn;
    }

    function getContractBalance() external view returns (uint256) {
        return usdc.balanceOf(address(this));
    }

    // ============ Admin Functions ============

    /**
     * @notice Update minimum deposit amount
     * @param newMinimum New minimum deposit in USDC (6 decimals)
     */
    function setMinimumDeposit(uint256 newMinimum) external onlyOwner {
        require(newMinimum > 0, "Minimum must be > 0");
        uint256 oldMinimum = minimumDeposit;
        minimumDeposit = newMinimum;
        emit MinimumDepositUpdated(oldMinimum, newMinimum);
    }

    /**
     * @notice Update emergency withdrawal fee (in basis points)
     * @param newFee New fee in basis points (e.g., 500 = 5%)
     */
    function setEmergencyWithdrawFee(uint256 newFee) external onlyOwner {
        require(newFee <= MAX_EMERGENCY_FEE, "Fee too high");
        uint256 oldFee = emergencyWithdrawFee;
        emergencyWithdrawFee = newFee;
        emit EmergencyFeeUpdated(oldFee, newFee);
    }

    function setTreasury(address _treasury) external onlyOwner {
        require(_treasury != address(0), "Invalid treasury");
        address oldTreasury = address(treasury);
        treasury = IVaultTreasury(_treasury);
        emit TreasuryUpdated(oldTreasury, _treasury);
    }

    function setLockOptions(address _lockOptions) external onlyOwner {
        require(_lockOptions != address(0), "Invalid lock options");
        address oldLockOptions = address(lockOptions);
        lockOptions = ILockOptions(_lockOptions);
        emit LockOptionsUpdated(oldLockOptions, _lockOptions);
    }

    /**
     * @notice Pause all deposits and withdrawals (emergency use)
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
     * @dev Cannot recover USDC that is locked in deposits
     */
    function recoverToken(address token, address to, uint256 amount) external onlyOwner {
        require(to != address(0), "Invalid recipient");
        if (token == address(usdc)) {
            uint256 locked = totalDeposits - totalWithdrawn;
            uint256 available = usdc.balanceOf(address(this)) - locked;
            require(amount <= available, "Cannot recover locked USDC");
        }
        IERC20(token).safeTransfer(to, amount);
    }
}
