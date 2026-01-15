# Frequently Asked Questions (FAQ)

## General Questions

### What is Timelock Vault?

Timelock Vault is a DeFi application that allows users to deposit USDC and earn yields by locking funds for specific periods. The longer you lock, the higher the APY (Annual Percentage Yield).

### Is my money safe?

- Smart contracts are designed with security best practices
- Contracts have been audited (or will be before mainnet launch)
- Your funds are always in your control
- No admin keys or backdoors

### What blockchain does it run on?

Currently, Timelock Vault runs on **Base**, an Ethereum Layer 2 network that offers low fees and fast transactions.

## Getting Started

### How do I connect my wallet?

1. Click "Connect Wallet" button
2. Select MetaMask (or supported wallet)
3. Approve the connection request
4. Ensure you're on Base network

### What wallets are supported?

- MetaMask (recommended)
- Coinbase Wallet
- WalletConnect compatible wallets
- Rainbow Wallet
- Any wallet supporting Base network

### I don't have a wallet. How do I get one?

1. Install [MetaMask](https://metamask.io)
2. Create a new wallet
3. **IMPORTANT:** Securely backup your seed phrase
4. Add Base network to MetaMask

## Deposits & Withdrawals

### What is the minimum deposit?

The minimum deposit is **1 USDC**.

### What is the maximum deposit?

The maximum deposit is **1,000,000 USDC** per transaction.

### How do lock durations work?

You choose how long to lock your funds:
- **1 Month:** 5% APY
- **3 Months:** 7% APY
- **6 Months:** 10% APY
- **1 Year:** 15% APY

### Can I withdraw early?

No, funds are locked until the unlock time. This is enforced by the smart contract. Plan your lock duration carefully.

### When can I withdraw?

You can withdraw anytime after your lock period ends. There's no deadline - your funds remain yours forever.

### How do I withdraw?

1. Go to "My Deposits"
2. Find unlocked deposits (green indicator)
3. Click "Withdraw"
4. Confirm transaction in wallet

## Rewards & APY

### How are rewards calculated?

Rewards = Principal × APY × (Lock Duration / 365 days)

Example: 1000 USDC for 90 days at 7% APY
= 1000 × 0.07 × (90/365) = 17.26 USDC

### When do I receive rewards?

Rewards are calculated at deposit time and paid out when you withdraw.

### Are rewards auto-compounded?

No, rewards are paid as a single amount at withdrawal. You can manually reinvest if desired.

### Does APY change?

APY tiers are fixed in the smart contract for each lock duration tier.

## Fees & Costs

### Are there deposit fees?

No deposit fees. You only pay:
- Gas fees (network transaction costs)
- USDC approval transaction (one-time per wallet)

### Are there withdrawal fees?

No withdrawal fees. You only pay gas fees for the transaction.

### Why do I need to approve USDC first?

This is standard for ERC-20 tokens. You're giving the vault contract permission to transfer USDC on your behalf.

### How much are gas fees?

Gas fees vary based on network activity. On Base, they're typically:
- Approval: ~$0.01-0.05
- Deposit: ~$0.02-0.10
- Withdrawal: ~$0.02-0.10

## Security & Safety

### Is the smart contract audited?

[Details about audit status - update based on actual status]

### Can the team access my funds?

No. The smart contract has no admin functions to access user funds.

### What if the website goes down?

You can still interact with the smart contract directly using a block explorer (Basescan) or other interfaces.

### How do I verify the smart contract?

Contract addresses:
- Vault: [Address on Basescan]
- Router: [Address on Basescan]

All contracts are verified and open source on Basescan.

## Technical Issues

### MetaMask not connecting?

1. Refresh the page
2. Check MetaMask is unlocked
3. Try disconnecting and reconnecting
4. Clear browser cache
5. Try different browser

### Wrong network error?

1. Open MetaMask
2. Switch to Base network
3. If Base isn't listed, add it manually:
   - Chain ID: 8453
   - RPC: https://mainnet.base.org
   - Symbol: ETH
   - Explorer: https://basescan.org

### Transaction failed?

Common causes:
1. **Insufficient gas:** Add more ETH to wallet
2. **Slippage:** Transaction conditions changed
3. **Amount too high:** Check your USDC balance
4. **Not approved:** Run approval transaction first

### Transaction stuck?

1. Check transaction on Basescan
2. If pending, wait (usually < 1 minute on Base)
3. Can speed up in MetaMask if needed
4. Never send another transaction while one is pending

## Account & Data

### Do I need to create an account?

No! Timelock Vault is fully non-custodial. Just connect your wallet.

### Where is my data stored?

- Deposit data is on-chain (blockchain)
- No personal data is collected
- UI preferences stored locally in browser

### Can I use multiple wallets?

Yes, each wallet address is independent. Connect different wallets to manage multiple accounts.

### How do I see my transaction history?

1. Go to "History" page in the app
2. Or view on Basescan using your wallet address

## Support

### I have another question

- Check [Documentation](./README.md)
- Ask in [GitHub Discussions](https://github.com/yourusername/timelock-based/discussions)
- Join our [Discord](https://discord.gg/yourserver)
- Follow on [Twitter](https://twitter.com/yourhandle)

### I found a bug

Please report it on [GitHub Issues](https://github.com/yourusername/timelock-based/issues) with:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser and wallet info

### Can I contribute?

Yes! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

**Disclaimer:** Cryptocurrency investments carry risk. Never invest more than you can afford to lose. This FAQ is for informational purposes only and does not constitute financial advice.
