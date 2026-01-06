# 🔒 Timelock Savings Vault

A decentralized savings vault on **Base Mainnet** that helps users build financial discipline by locking USDC for a set period.

![Base](https://img.shields.io/badge/Base-Mainnet-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-purple)
![React](https://img.shields.io/badge/React-19-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)

## 🌟 Features

- **Flexible Lock Periods**: 3, 7, 14, or 30 days
- **Low Minimum**: Start with just 0.1 USDC
- **Emergency Withdrawal**: 10% penalty for early unlock
- **Base Network**: Low gas fees, fast transactions
- **Modern UI**: Built with React 19 + TypeScript

## 📜 Smart Contracts

All contracts are deployed and verified on Base Mainnet:

| Contract | Address | Version |
|----------|---------|---------|
| TimelockVault | `0x84D6355Bde20f93ac259EF2E852D1d55132231B9` | V3 |
| VaultTreasury | `0x23f9E461d6Be928d5F2B7d25229396E854310aF3` | V3 |
| VaultRouter | `0xe6573bafd46701Fe98D7E62961D90200A56312eB` | V2 |
| LockOptions | `0xF5001102F458595129695a6536Db7c69065209CF` | V2 |
| USDC | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | - |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MetaMask or compatible wallet
- Base Mainnet ETH for gas

### Installation

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/timelock-based.git
cd timelock-based/vault-ui

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
timelock-based/
├── vault-ui/               # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # React hooks (useWallet, useVault)
│   │   ├── abi/            # Contract ABIs
│   │   └── config/         # Contract addresses
│   └── contracts/          # Solidity source (reference)
└── contracts-v2/           # V2/V3 contracts
```

## 💡 How It Works

1. **Connect Wallet**: Connect your MetaMask to Base Mainnet
2. **Approve USDC**: One-time approval for the vault
3. **Make Deposit**: Choose amount and lock duration
4. **Wait**: Your funds are locked until the unlock time
5. **Withdraw**: Get your full deposit back after unlock

### Emergency Withdrawal

If you need funds before unlock:
- 10% penalty is applied
- 90% returned to your wallet
- 10% goes to treasury

## 🔐 Security

- Contracts verified on BaseScan
- No admin withdrawal of user funds
- Immutable lock periods
- Transparent penalty system

## 📱 Screenshots

Coming soon...

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📞 Contact

- GitHub: [@AdekunleBamz](https://github.com/AdekunleBamz)
