# TimelockVault V2 - Deployment Instructions

## Summary of Changes (V1 → V2)

| Feature | V1 | V2 |
|---------|----|----|
| Minimum Deposit | 0.10 USDC | **0.11 USDC** |
| Emergency Withdrawal Fee | 10% | **5%** |
| Pausable | ❌ | ✅ |
| Configurable Min Deposit | ❌ | ✅ |
| Configurable Emergency Fee | ❌ | ✅ |
| Version Tracking | ❌ | ✅ |
| Token Recovery | ❌ | ✅ |

---

## Existing Contracts (DO NOT REDEPLOY)

These contracts from V1 can be reused:

| Contract | Address | Status |
|----------|---------|--------|
| **USDC** | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | Base Mainnet USDC |
| **LockOptions** | `0x0c415dCc6A31F1bF67dF2C7a25e29fbB2449bA3d` | ✅ Keep using |
| **VaultTreasury** | `0x127881a076F7027bB36aE2c25E0571f631EDCB4e` | ✅ Keep using |

---

## Contracts to Deploy

### Step 1: Deploy TimelockVaultV2

1. Open Remix IDE (https://remix.ethereum.org)
2. Create new file: `TimelockVaultV2.sol`
3. Copy the entire contents from `contracts-v2/1_TimelockVault_v2.sol`
4. Compile with Solidity 0.8.19+
5. Connect MetaMask to Base Mainnet
6. Deploy with constructor parameters:
   - `_usdc`: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
   - `_lockOptions`: `0x0c415dCc6A31F1bF67dF2C7a25e29fbB2449bA3d`
   - `_treasury`: `0x127881a076F7027bB36aE2c25E0571f631EDCB4e`

7. **SAVE THE NEW VAULT ADDRESS!**

---

### Step 2: Deploy VaultRouterV2

1. Create new file in Remix: `VaultRouterV2.sol`
2. Copy the entire contents from `contracts-v2/2_VaultRouter_v2.sol`
3. Compile with Solidity 0.8.19+
4. Deploy with constructor parameters:
   - `_usdc`: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
   - `_vault`: `<NEW_VAULT_ADDRESS_FROM_STEP_1>`
   - `_lockOptions`: `0x0c415dCc6A31F1bF67dF2C7a25e29fbB2449bA3d`

5. **SAVE THE NEW ROUTER ADDRESS!**

---

### Step 3: Fund the New Vault with Bonus USDC

The vault needs USDC to pay out bonuses. Transfer some USDC to the new vault address.

Recommended initial funding: **10-50 USDC** (depending on expected deposits)

---

### Step 4: Update Frontend Config

After deployment, update the addresses in:
`/vault-ui/src/config/contracts.ts`

```typescript
export const CONTRACTS = {
  // Base Mainnet
  USDC: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  LOCK_OPTIONS: "0x0c415dCc6A31F1bF67dF2C7a25e29fbB2449bA3d",
  VAULT_TREASURY: "0x127881a076F7027bB36aE2c25E0571f631EDCB4e",
  TIMELOCK_VAULT: "<NEW_VAULT_ADDRESS>",    // UPDATE THIS
  VAULT_ROUTER: "<NEW_ROUTER_ADDRESS>",      // UPDATE THIS
} as const;
```

---

### Step 5: Verify Contracts on Basescan

1. Go to Basescan: https://basescan.org/address/<NEW_VAULT_ADDRESS>#code
2. Click "Verify and Publish"
3. Select:
   - Compiler: 0.8.19
   - Optimization: Yes (200 runs)
   - License: MIT
4. Paste the flattened source code

---

## New Admin Functions Available

### TimelockVaultV2:
- `setMinimumDeposit(uint256)` - Change minimum deposit (in 6 decimals)
- `setEmergencyWithdrawFee(uint256)` - Change fee (in basis points, e.g., 500 = 5%)
- `pause()` - Pause all deposits/withdrawals
- `unpause()` - Resume operations
- `recoverToken(address, address, uint256)` - Recover accidentally sent tokens

### Examples:
```solidity
// Set minimum to 0.50 USDC
vault.setMinimumDeposit(500000);

// Set emergency fee to 3%
vault.setEmergencyWithdrawFee(300);

// Pause in emergency
vault.pause();
```

---

## Post-Deployment Checklist

- [ ] Vault deployed and address saved
- [ ] Router deployed and address saved
- [ ] Vault funded with bonus USDC
- [ ] Frontend config updated
- [ ] Contracts verified on Basescan
- [ ] Test deposit with small amount
- [ ] Test emergency withdrawal
- [ ] Test normal withdrawal (after lock)

---

## Contract Addresses (Deployed)

| Contract | Address |
|----------|---------|
| LockOptionsV2 | `0xF5001102F458595129695a6536Db7c69065209CF` |
| TimelockVaultV2 | `0x372AaC27DBECac5870caC39Fe8aB0c97A7Dc1F9E` |
| VaultRouterV2 | `0xe6573bafd46701Fe98D7E62961D90200A56312eB` |

