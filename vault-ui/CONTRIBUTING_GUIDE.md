/**
 * Contribution Guidelines for Timelock Vault UI
 */

# Contributing to Timelock Vault UI

Thank you for your interest in contributing to the Timelock Vault UI project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing](#testing)

## Code of Conduct

We expect all contributors to follow our code of conduct:

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Prioritize the community and project over personal interests

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/timelock-based.git
   cd timelock-based/vault-ui
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/AdekunleBamz/timelock-based.git
   ```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Configure the necessary environment variables

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

## Making Changes

1. **Create a new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Write clear, concise code
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation as needed

3. **Test your changes**:
   - Run the test suite
   - Test manually in the browser
   - Check for TypeScript errors
   - Verify responsive design

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add deposit calculator component
fix: resolve wallet connection issue
docs: update README with new instructions
```

## Submitting Changes

1. **Push your branch** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request**:
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill out the PR template with:
     - Description of changes
     - Related issue numbers
     - Screenshots (if applicable)
     - Testing steps

3. **Respond to feedback**:
   - Address review comments
   - Make requested changes
   - Push updates to your branch

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type unless absolutely necessary
- Export types that may be reused

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use proper prop typing

### Styling

- Use CSS modules or scoped styles
- Follow BEM naming convention
- Use CSS variables for theming
- Ensure responsive design

### File Organization

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
├── services/       # API and service layers
├── types/          # TypeScript type definitions
├── constants/      # Application constants
└── styles/         # Global styles
```

### Code Quality

- **Naming**: Use descriptive, camelCase names
- **Functions**: Keep functions small and single-purpose
- **Comments**: Explain "why", not "what"
- **Imports**: Group and sort imports logically
- **Error Handling**: Always handle errors gracefully

## Testing

### Unit Tests

- Write tests for utility functions
- Test custom hooks
- Aim for high coverage

### Component Tests

- Test component rendering
- Test user interactions
- Test edge cases

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

## Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows the project style guide
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Changes are described in PR description
- [ ] Screenshots added (if UI changes)
- [ ] Responsive design tested
- [ ] Browser compatibility checked

## Getting Help

If you need help:

- Check existing issues and PRs
- Read the documentation
- Ask questions in issues or discussions
- Reach out to maintainers

## Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in the project README

Thank you for contributing to Timelock Vault UI! 🚀
