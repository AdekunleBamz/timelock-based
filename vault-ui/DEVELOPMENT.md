# Timelock Vault - Development Guide

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or compatible wallet

### Installation
```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── context/        # React context providers
├── pages/          # Page components
├── abi/            # Contract ABIs
├── config/         # Configuration files
└── assets/         # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Key Features

### Components
- **Dashboard** - Main application interface
- **DepositWizard** - Multi-step deposit flow
- **WithdrawalFlow** - Bulk withdrawal management
- **PortfolioOverview** - User portfolio summary
- **RewardsPanel** - Earnings tracking

### Hooks
- **useWallet** - Wallet connection management
- **useVault** - Vault contract interactions
- **useLocalStorage** - Persistent state
- **useDebounce** - Input debouncing

### Utils
- **format** - Number and address formatting
- **time** - Time calculation helpers
- **validation** - Form validation
- **math** - Financial calculations

## Smart Contract Integration

Contracts are deployed on Base mainnet (Chain ID: 8453).

```typescript
import { useVault } from './hooks/useVault';

const { deposit, withdraw, getDeposits } = useVault();
```

## State Management

Using React Context for global state:
- **AppContext** - Application state
- **ToastContext** - Notifications
- **ModalContext** - Modal management
- **ThemeContext** - Theme preferences

## Styling

CSS modules with CSS variables for theming.

```css
color: var(--color-primary);
padding: var(--spacing-4);
border-radius: var(--radius-md);
```

## Testing

Tests use Vitest and React Testing Library.

```bash
npm run test
```

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## License

MIT
