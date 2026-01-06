# V3 Contracts Deployment Guide

## Overview
Deploy 4 contracts in order on Base Mainnet using Remix IDE.

**Network:** Base Mainnet (Chain ID: 8453)  
**USDC Address:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

---

## Step 1: Deploy LockOptions V3

### Contract File: `1_LockOptions_V3.sol`

1. Open Remix IDE: https://remix.ethereum.org
2. Create new file: `1_LockOptions_V3.sol`
3. Paste the contract code
4. Compile with Solidity 0.8.20
5. Select "Injected Provider - MetaMask"
6. Ensure you're on Base Mainnet
7. Deploy with NO constructor arguments
8. **Save the deployed address:** `_________________`

---

## Step 2: Deploy VaultTreasury V3

### Contract File: `2_VaultTreasury_V3.sol`

1. Create new file: `2_VaultTreasury_V3.sol`
2. Paste the contract code
3. Compile with Solidity 0.8.20
4. Deploy with NO constructor arguments
5. **Save the deployed address:** `_________________`

---

## Step 3: Deploy TimelockVault V3

### Contract File: `3_TimelockVault_V3.sol`

1. Create new file: `3_TimelockVault_V3.sol`
2. Paste the contract code
3. Compile with Solidity 0.8.20
4. Deploy with constructor arguments:
   - `_usdc`: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
   - `_lockOptions`: (LockOptions V3 address from Step 1)
   - `_treasury`: (VaultTreasury V3 address from Step 2)
5. **Save the deployed address:** `_________________`

---

## Step 4: Deploy VaultRouter V3

### Contract File: `4_VaultRouter_V3.sol`

1. Create new file: `4_VaultRouter_V3.sol`
2. Paste the contract code
3. Compile with Solidity 0.8.20
4. Deploy with constructor arguments:
   - `_usdc`: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
   - `_vault`: (TimelockVault V3 address from Step 3)
   - `_lockOptions`: (LockOptions V3 address from Step 1)
5. **Save the deployed address:** `_________________`

---

## Verification Checklist

After deployment, verify each contract:

### LockOptions V3
- [ ] Call `VERSION()` → Should return "3.0.0"
- [ ] Call `getLockOptionsCount()` → Should return 4
- [ ] Call `getLockOption(0)` → Should show 3 days (259200 seconds)

### VaultTreasury V3
- [ ] Call `VERSION()` → Should return "3.0.0"
- [ ] Call `owner()` → Should return your wallet address

### TimelockVault V3
- [ ] Call `VERSION()` → Should return "3.0.0"
- [ ] Call `minimumDeposit()` → Should return 110000 (0.11 USDC)
- [ ] Call `emergencyWithdrawFee()` → Should return 500 (5%)
- [ ] Call `lockOptions()` → Should return LockOptions V3 address
- [ ] Call `treasury()` → Should return VaultTreasury V3 address

### VaultRouter V3
- [ ] Call `VERSION()` → Should return "3.0.0"
- [ ] Call `vault()` → Should return TimelockVault V3 address
- [ ] Call `lockOptions()` → Should return LockOptions V3 address

---

## Test Deposit (Optional)

1. Approve USDC: Call `approve()` on USDC contract
   - `spender`: TimelockVault V3 address
   - `amount`: 110000 (0.11 USDC)

2. Make deposit: Call `deposit()` on TimelockVault V3
   - `amount`: 110000
   - `lockOptionId`: 0 (3 days)

3. Verify: Call `getDeposit(0)` → Should show your deposit

---

## Contract Addresses Summary

Fill in after deployment:

| Contract | Address |
|----------|---------|
| LockOptions V3 | |
| VaultTreasury V3 | |
| TimelockVault V3 | |
| VaultRouter V3 | |

---

## Lock Options Reference

| ID | Duration | Bonus |
|----|----------|-------|
| 0 | 3 days | 0% |
| 1 | 7 days | 0% |
| 2 | 14 days | 0% |
| 3 | 30 days | 0% |
