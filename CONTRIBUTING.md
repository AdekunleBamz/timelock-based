# Contributing to Timelock Vault

First off, thank you for considering contributing to Timelock Vault! It's people like you that make this project better.

## Code of Conduct

By participating in this project, you agree to:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When you create a bug report, include:

- **Clear title and description**
- **Steps to reproduce**
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment details** (browser, OS, Node version)

**Example:**
```
Title: Deposit transaction fails on mobile Safari

Description:
When attempting to deposit USDC using MetaMask mobile browser, the transaction
fails with "insufficient funds" error despite having adequate balance.

Steps to Reproduce:
1. Open app in MetaMask mobile browser on iOS
2. Connect wallet
3. Enter deposit amount (e.g., 100 USDC)
4. Click "Deposit"
5. Approve transaction in MetaMask

Expected: Transaction succeeds
Actual: Error message "Insufficient funds"

Environment:
- Browser: MetaMask Mobile 7.10.0
- OS: iOS 17.1
- Network: Base Mainnet
- Balance: 500 USDC
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use clear title** describing the enhancement
- **Provide detailed description** of the proposed feature
- **Explain why this enhancement would be useful**
- **List any alternatives** you've considered

### Pull Requests

1. **Fork the repository**
2. **Create a branch** from `main`
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes**
   - Follow the [Code Style Guide](CODE_STYLE.md)
   - Add tests for new features
   - Update documentation

4. **Commit your changes**
```bash
git commit -m "feat: add amazing feature"
```

5. **Push to your fork**
```bash
git push origin feature/amazing-feature
```

6. **Open a Pull Request**

## Development Setup

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

### Setup Steps

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/timelock-based.git
cd timelock-based/vault-ui

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code
npm run format
```

## Project Structure

```
vault-ui/
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/          # Page components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── config/         # Configuration
│   ├── services/       # API services
│   └── __tests__/      # Test files
├── public/             # Static assets
└── docs/              # Documentation
```

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types (avoid `any`)
- Use interfaces for objects

### React
- Use functional components with hooks
- Follow React best practices
- Keep components small and focused

### Testing
- Write tests for new features
- Maintain test coverage > 80%
- Test edge cases

### Git Commits

Follow conventional commits:
```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

## Review Process

1. **Automated checks** must pass:
   - Linting
   - Type checking
   - Tests
   - Build

2. **Code review** by maintainers:
   - Code quality
   - Test coverage
   - Documentation
   - Performance

3. **Approval and merge**

## Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Documentation updates
- `good first issue`: Good for newcomers
- `help wanted`: Need community help
- `priority: high`: High priority
- `priority: low`: Low priority

## Community

- **GitHub Discussions:** Ask questions, share ideas
- **Discord:** Real-time chat (link in README)
- **Twitter:** Follow for updates

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## Questions?

Feel free to ask in:
- GitHub Discussions
- Discord community
- Create an issue

## Thank You!

Your contributions help make Timelock Vault better for everyone. We appreciate your time and effort!
