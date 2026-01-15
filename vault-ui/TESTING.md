# Testing Guide

## Overview

This guide covers testing practices and setup for the Timelock Vault application.

## Test Stack

- **Test Runner:** Vitest
- **Testing Library:** @testing-library/react
- **Mocking:** Vitest mocks
- **Coverage:** Vitest coverage reports

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- addresses.test.ts
```

## Test Structure

### Unit Tests

Located in `src/__tests__/` directory.

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../utils/myFunction';

describe('MyFunction', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';

describe('Button', () => {
  it('renders button text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### Integration Tests

Test interactions between multiple components and services.

```typescript
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../App';

describe('Deposit Flow', () => {
  it('allows user to make a deposit', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test deposit flow
    await user.type(screen.getByLabelText('Amount'), '100');
    await user.click(screen.getByText('Deposit'));
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

## Mocking

### Mock Web3 Provider

```typescript
import { vi } from 'vitest';

vi.mock('ethers', () => ({
  BrowserProvider: vi.fn(() => ({
    getSigner: vi.fn(() => ({
      getAddress: vi.fn(() => '0x123...'),
    })),
  })),
}));
```

### Mock API Calls

```typescript
import { vi } from 'vitest';

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'mocked' }),
  })
);
```

## Best Practices

1. **Arrange, Act, Assert:** Structure tests clearly
2. **Test Behavior:** Focus on what users see and do
3. **Avoid Implementation Details:** Test the interface, not internals
4. **Use Descriptive Names:** Test names should explain what they test
5. **Keep Tests Isolated:** Each test should be independent
6. **Mock External Dependencies:** Control test environment

## Coverage Goals

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

## Continuous Integration

Tests run automatically on:
- Pull requests
- Commits to main branch
- Before deployment

## Debugging Tests

```bash
# Run tests in debug mode
npm run test:debug

# Use browser devtools
npm run test:ui
```

## Common Issues

### Tests Timeout
Increase timeout in test configuration:
```typescript
it('async test', async () => {
  // test code
}, { timeout: 10000 });
```

### Mock Not Working
Ensure mocks are set up before imports:
```typescript
vi.mock('../module', () => ({
  // mock implementation
}));

import { Component } from '../Component';
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
