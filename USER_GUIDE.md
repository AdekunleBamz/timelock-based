# User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Making a Deposit](#making-a-deposit)
3. [Managing Deposits](#managing-deposits)
4. [Withdrawing Funds](#withdrawing-funds)
5. [Understanding APY](#understanding-apy)
6. [Tips & Best Practices](#tips--best-practices)

## Getting Started

### Prerequisites
- A Web3 wallet (MetaMask recommended)
- ETH for gas fees on Base network
- USDC to deposit

### Step 1: Install MetaMask
1. Visit [metamask.io](https://metamask.io)
2. Click "Download"
3. Install browser extension
4. Create new wallet or import existing
5. **IMPORTANT:** Backup your seed phrase securely

### Step 2: Add Base Network
1. Open MetaMask
2. Click network dropdown
3. Select "Add Network"
4. Enter Base details:
   ```
   Network Name: Base
   RPC URL: https://mainnet.base.org
   Chain ID: 8453
   Currency Symbol: ETH
   Block Explorer: https://basescan.org
   ```
5. Click "Save"

### Step 3: Get USDC
You'll need USDC on Base network:
- Bridge from Ethereum using [Base Bridge](https://bridge.base.org)
- Buy directly on Base (Coinbase, Uniswap)
- Transfer from exchange that supports Base

### Step 4: Connect Wallet
1. Visit Timelock Vault application
2. Click "Connect Wallet"
3. Select MetaMask
4. Approve connection
5. Confirm you're on Base network

## Making a Deposit

### Step-by-Step Guide

1. **Navigate to Deposit Page**
   - Click "Deposit" in navigation

2. **Enter Amount**
   - Type USDC amount (minimum 1 USDC)
   - Click "Max" to deposit full balance

3. **Choose Lock Duration**
   - Select from preset options:
     * 1 Month (5% APY)
     * 3 Months (7% APY)
     * 6 Months (10% APY)
     * 1 Year (15% APY)
   - Or enter custom duration

4. **Review Details**
   - Check deposit amount
   - Verify lock duration
   - Review estimated rewards
   - Note unlock date

5. **Approve USDC** (First Time Only)
   - Click "Approve USDC"
   - Confirm in MetaMask
   - Wait for confirmation
   - Gas cost: ~$0.01-0.05

6. **Confirm Deposit**
   - Click "Deposit"
   - Review transaction in MetaMask
   - Confirm transaction
   - Gas cost: ~$0.02-0.10
   - Wait for confirmation (usually < 1 minute)

7. **Success!**
   - Deposit confirmed
   - View in "My Deposits"
   - Transaction hash provided

### Deposit Calculation Example
```
Deposit: 1,000 USDC
Duration: 90 days (3 months)
APY: 7%

Rewards = 1,000 × 0.07 × (90/365)
       = 17.26 USDC

Total at withdrawal: 1,017.26 USDC
```

## Managing Deposits

### Viewing Your Deposits

Go to "My Deposits" to see:
- Active deposits
- Lock duration remaining
- Expected rewards
- Unlock dates
- Deposit status

### Deposit Status Indicators
- 🔒 **Locked:** Still locked
- 🔓 **Unlocked:** Ready to withdraw
- ⏳ **Pending:** Transaction confirming
- ✅ **Withdrawn:** Already withdrawn

### Understanding Time Remaining

The app shows:
- Days until unlock
- Hours and minutes for <24 hours
- Countdown timer
- Exact unlock timestamp

## Withdrawing Funds

### When Can I Withdraw?

Withdraw anytime after lock period ends:
- No penalty for waiting
- No deadline - your funds stay yours
- Rewards included automatically

### Withdrawal Process

1. **Check Eligibility**
   - Go to "My Deposits"
   - Find deposits with 🔓 icon

2. **Initiate Withdrawal**
   - Click "Withdraw" button
   - Review withdrawal details:
     * Original deposit
     * Earned rewards
     * Total amount

3. **Confirm Transaction**
   - Click "Confirm Withdrawal"
   - Approve in MetaMask
   - Gas cost: ~$0.02-0.10
   - Wait for confirmation

4. **Receive Funds**
   - USDC + rewards sent to wallet
   - Check transaction on Basescan
   - Balance updates in wallet

### Bulk Withdrawal

Multiple unlocked deposits?
1. Select deposits to withdraw
2. Click "Withdraw All Selected"
3. Confirm single transaction
4. Saves on gas fees!

## Understanding APY

### What is APY?

APY (Annual Percentage Yield) is the yearly return rate on your deposit.

### APY Tiers

| Duration | APY | Example (1000 USDC) |
|----------|-----|---------------------|
| 1 Month  | 5%  | 4.11 USDC          |
| 3 Months | 7%  | 17.26 USDC         |
| 6 Months | 10% | 49.32 USDC         |
| 1 Year   | 15% | 150.00 USDC        |

### Why Different APYs?

Longer locks = Higher APY because:
- More predictable liquidity
- Capital efficiency for protocol
- Incentive for commitment

### APY vs APR

- **APY:** Includes compounding (if applicable)
- **APR:** Simple interest rate
- Timelock Vault shows APY

## Tips & Best Practices

### ⚠️ Important Warnings

1. **No Early Withdrawal**
   - Funds are locked until unlock time
   - Smart contract enforced - no exceptions
   - Choose duration carefully

2. **Only Invest What You Can Lock**
   - Don't lock emergency funds
   - Consider your liquidity needs
   - Plan ahead

3. **Smart Contract Risk**
   - While audited, smart contracts have risks
   - Never invest more than you can afford to lose
   - Do your own research

### 💡 Pro Tips

1. **Diversify Lock Durations**
   ```
   Instead of: 10,000 USDC for 1 year
   
   Consider:
   - 3,000 USDC for 1 month (early liquidity)
   - 3,000 USDC for 3 months (medium term)
   - 4,000 USDC for 1 year (max APY)
   ```

2. **Ladder Your Deposits**
   - Stagger unlock dates
   - Regular liquidity access
   - Reinvest matured deposits

3. **Check Gas Prices**
   - Base fees are low but vary
   - Check before large transactions
   - No need to rush - fees stable

4. **Keep Some ETH**
   - Need ETH for gas on Base
   - Keep ~0.01 ETH minimum
   - Can't withdraw without gas!

5. **Enable Notifications**
   - Get alerts before unlock
   - Plan reinvestment strategy
   - Never miss opportunities

### 📊 Maximizing Returns

**Strategy 1: Max Lock**
- Lock 1 year for 15% APY
- Best for funds you won't need
- Highest rewards

**Strategy 2: Balanced**
- Split between 3mo, 6mo, 1yr
- Balanced risk/reward
- Regular unlock schedule

**Strategy 3: Short Term**
- 1-3 month locks
- Quick liquidity
- Lower but consistent returns

### 🔐 Security Checklist

- [ ] Secure seed phrase backup
- [ ] Verify contract address
- [ ] Use hardware wallet (optional)
- [ ] Double-check amounts
- [ ] Confirm network is Base
- [ ] Test with small amount first
- [ ] Never share private keys
- [ ] Bookmark official site

## Troubleshooting

### Common Issues

**"Insufficient funds" error**
- Check USDC balance
- Ensure enough ETH for gas

**Transaction pending forever**
- Rare on Base (usually < 1 min)
- Check Basescan for status
- May need to speed up

**Can't withdraw**
- Check unlock time passed
- Ensure on Base network
- Verify enough ETH for gas

For more issues, see [TROUBLESHOOTING.md](vault-ui/TROUBLESHOOTING.md)

## Need Help?

- 📚 [FAQ](FAQ.md)
- 💬 [Discord Community](https://discord.gg/yourserver)
- 🐦 [Twitter Support](https://twitter.com/yourhandle)
- 🐛 [Report Bugs](https://github.com/yourusername/timelock-based/issues)

---

**Happy Earning! 🚀**
