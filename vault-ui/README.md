# Timelock Vault UI

A modern, feature-rich React frontend for the Timelock Savings Vault on Base blockchain.

![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Base](https://img.shields.io/badge/Network-Base-0052FF)

## Features

### Core Functionality
- 🔒 **Secure Deposits** - Lock USDC for flexible durations (7-365 days)
- 💰 **Competitive APY** - Earn up to 15% APY on locked deposits
- 📊 **Portfolio Management** - Track all deposits and earnings in one place
- ⚡ **Quick Actions** - Fast deposit and withdrawal flows
- 📈 **Analytics Dashboard** - Comprehensive performance metrics

### User Experience
- ⏱️ **Countdown Timers** - Visual countdown to unlock times
- 🔔 **Toast Notifications** - Real-time transaction feedback
- 📱 **Mobile Responsive** - Optimized for all devices
- 🌙 **Dark Mode** - Auto-detect system preference
- ♿ **Accessible** - WCAG 2.1 compliant components

### Advanced Features
- 🧮 **APY Calculator** - Project potential earnings
- 📜 **Transaction History** - Complete activity log with filtering
- 🎯 **Risk Indicators** - Visual risk assessment
- ⛽ **Gas Estimation** - Preview transaction costs
- 📊 **Performance Charts** - Historical value tracking

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── abi/              # Contract ABIs
├── components/       # React components
│   ├── Countdown     # Real-time countdown timer
│   ├── DepositForm   # USDC deposit form
│   ├── DepositsList  # Active deposits view
│   ├── Header        # App header with wallet
│   ├── ProgressBar   # Lock progress indicator
│   ├── Skeleton      # Loading state components
│   ├── StatsCard     # Statistics display
│   ├── Toast         # Notification system
│   ├── TokenBalances # Wallet balances
│   ├── TransactionHistory # Activity feed
│   └── VaultStats    # Global vault stats
├── config/           # Contract addresses & config
├── hooks/            # Custom React hooks
│   ├── useWallet     # Wallet connection
│   └── useVault      # Vault interactions
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## Smart Contracts

Contracts are deployed and verified on Base Mainnet. See `src/config/contracts.ts` for addresses.

## How It Works

1. **Connect Wallet** - Connect your MetaMask or compatible wallet
2. **Switch to Base** - Ensure you're on Base Mainnet
3. **Deposit USDC** - Enter amount and select lock duration
4. **Wait for Unlock** - Track progress with countdown timer
5. **Withdraw** - Claim your USDC after lock period ends

### Emergency Withdrawal

If you need funds before the lock period ends, you can use emergency withdrawal with a **10% penalty**. The penalty goes to the vault treasury.

## Tech Stack

- **React 19** - Latest React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast development and builds
- **Ethers.js 6** - Blockchain interactions
- **CSS Modules** - Scoped component styles

## Environment

The app connects to Base Mainnet by default. No environment variables required - all configuration is in `src/config/contracts.ts`.

## License

MIT
