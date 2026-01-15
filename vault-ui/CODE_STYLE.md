# Code Style Guide

## Overview

This document outlines coding standards and best practices for the Timelock Vault project.

## General Principles

1. **Clarity over Cleverness:** Write code that is easy to understand
2. **Consistency:** Follow established patterns
3. **Simplicity:** Keep it simple, avoid over-engineering
4. **Documentation:** Comment complex logic
5. **Type Safety:** Leverage TypeScript fully

## File Organization

```
src/
├── components/     # Reusable UI components
├── pages/          # Page-level components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
├── config/         # Configuration files
├── services/       # API and external services
├── assets/         # Static assets
└── __tests__/      # Test files
```

## Naming Conventions

### Files
```typescript
// Components: PascalCase
Button.tsx
VaultDashboard.tsx

// Hooks: camelCase with 'use' prefix
useWallet.ts
useDeposits.ts

// Utils: camelCase
formatters.ts
validation.ts

// Types: camelCase
vault.ts
components.ts

// Test files: match source file + .test
Button.test.tsx
formatters.test.ts
```

### Variables and Functions
```typescript
// Variables: camelCase
const userAddress = '0x...';
const depositAmount = 100;

// Constants: UPPER_SNAKE_CASE
const MAX_DEPOSIT = 10000;
const API_ENDPOINT = 'https://api.example.com';

// Functions: camelCase (verb-noun pattern)
function calculateRewards() { }
function getUserDeposits() { }

// Boolean variables: is/has/can prefix
const isConnected = true;
const hasDeposits = false;
const canWithdraw = true;

// Event handlers: handle prefix
const handleClick = () => { };
const handleSubmit = () => { };
```

### Components
```typescript
// PascalCase
export function Button({ children }: ButtonProps) {
  return <button>{children}</button>;
}

// Props interface: ComponentProps
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}
```

## TypeScript

### Type Definitions
```typescript
// Use interfaces for objects
interface User {
  address: string;
  deposits: Deposit[];
}

// Use type for unions, intersections, primitives
type Status = 'pending' | 'confirmed' | 'failed';
type ID = string | number;

// Prefer type inference
const count = 5; // inferred as number
const name = 'John'; // inferred as string

// Explicit types when needed
const deposits: Deposit[] = [];
```

### Avoid `any`
```typescript
// ❌ Bad
function processData(data: any) {
  return data.value;
}

// ✅ Good
interface Data {
  value: string;
}

function processData(data: Data) {
  return data.value;
}
```

## React Best Practices

### Component Structure
```typescript
// 1. Imports
import { useState, useEffect } from 'react';
import { Button } from './Button';
import './Component.css';

// 2. Types
interface ComponentProps {
  title: string;
  onSubmit: () => void;
}

// 3. Component
export function Component({ title, onSubmit }: ComponentProps) {
  // 3.1 Hooks
  const [state, setState] = useState('');
  
  // 3.2 Derived state
  const isValid = state.length > 0;
  
  // 3.3 Effects
  useEffect(() => {
    // effect logic
  }, []);
  
  // 3.4 Event handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState(e.target.value);
  };
  
  // 3.5 Render
  return (
    <div>
      <h1>{title}</h1>
      <input value={state} onChange={handleChange} />
      <Button onClick={onSubmit} disabled={!isValid}>
        Submit
      </Button>
    </div>
  );
}
```

### Hooks
```typescript
// ✅ Good - Custom hooks start with 'use'
function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  // hook logic
  return { address, setAddress };
}

// ✅ Good - Extract complex logic to custom hooks
function useDeposits(address: string) {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDeposits(address).then(setDeposits).finally(() => setLoading(false));
  }, [address]);
  
  return { deposits, loading };
}
```

### Props
```typescript
// ✅ Good - Destructure props
function Button({ children, variant = 'primary', onClick }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{children}</button>;
}

// ❌ Bad - Using props object
function Button(props: ButtonProps) {
  return <button className={props.variant} onClick={props.onClick}>{props.children}</button>;
}
```

## CSS

### Class Naming (BEM-inspired)
```css
/* Block */
.button { }

/* Element */
.button__icon { }
.button__text { }

/* Modifier */
.button--primary { }
.button--disabled { }

/* State */
.button.is-loading { }
.button.is-active { }
```

### CSS Variables
```css
:root {
  /* Colors */
  --color-primary: #0066cc;
  --color-success: #28a745;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
  
  /* Typography */
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  
  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}
```

## Comments

### When to Comment
```typescript
// ✅ Good - Explain WHY, not WHAT
// Using exponential backoff to handle rate limiting
await retryWithBackoff(apiCall);

// ✅ Good - Document complex algorithms
/**
 * Calculates APY using compound interest formula
 * APY = (1 + r/n)^(n*t) - 1
 * where r = interest rate, n = compounding frequency, t = time
 */
function calculateAPY(rate: number, periods: number): number {
  return Math.pow(1 + rate / periods, periods) - 1;
}

// ❌ Bad - Stating the obvious
// Increment counter
counter++;

// Set loading to true
setLoading(true);
```

## Error Handling

```typescript
// ✅ Good - Specific error handling
try {
  await depositToVault(amount);
} catch (error) {
  if (error instanceof InsufficientFundsError) {
    showError('Insufficient funds for deposit');
  } else if (error instanceof ContractError) {
    showError('Smart contract error. Please try again.');
  } else {
    showError('An unexpected error occurred');
    logger.error('Deposit failed', error);
  }
}

// ❌ Bad - Silent failures
try {
  await depositToVault(amount);
} catch {
  // error ignored
}
```

## Testing

```typescript
// Descriptive test names
describe('calculateAPY', () => {
  it('should return correct APY for 30-day lock', () => {
    expect(calculateAPY(30)).toBe(5.0);
  });
  
  it('should return correct APY for 365-day lock', () => {
    expect(calculateAPY(365)).toBe(15.0);
  });
});

// Test edge cases
it('should handle zero amount', () => {
  expect(calculateRewards(0, 30)).toBe(0);
});

it('should handle invalid duration', () => {
  expect(() => calculateRewards(100, -1)).toThrow();
});
```

## Git Commit Messages

```bash
# Format: <type>: <description>

# Types:
feat: Add deposit history chart
fix: Fix calculation error in APY formula
docs: Update API documentation
style: Format code with Prettier
refactor: Simplify wallet connection logic
test: Add tests for vault utilities
chore: Update dependencies

# Good commit messages
feat: Add pagination to deposit list
fix: Resolve MetaMask connection issue on iOS
docs: Add deployment guide for production

# Bad commit messages
Update files
Fix bug
Changes
```

## Code Review Checklist

- [ ] Code follows style guide
- [ ] TypeScript types are properly defined
- [ ] No `any` types without justification
- [ ] Functions have single responsibility
- [ ] Tests are included
- [ ] Edge cases handled
- [ ] Error handling present
- [ ] Comments explain complex logic
- [ ] No console.logs in production code
- [ ] Accessibility considered
- [ ] Performance implications reviewed

## Resources

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
