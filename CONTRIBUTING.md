# Contributing to Shnippet

Thank you for your interest in contributing to Shnippet! This document provides guidelines and instructions for contributing.

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/shnippet.git
   cd shnippet
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Branch Strategy

We use the following branch naming conventions:

- `main` - Production-ready code
- `feature/*` - New features (e.g., `feature/add-new-language`)
- `fix/*` - Bug fixes (e.g., `fix/parser-error`)
- `chore/*` - Maintenance tasks (e.g., `chore/update-deps`)
- `docs/*` - Documentation updates (e.g., `docs/update-readme`)

## Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or modifying tests
- `chore:` - Maintenance tasks

Example:
```
feat: add support for Python language
fix: handle empty file edge case
docs: update installation instructions
```

## Pull Request Process

1. Create a new branch from `main` using the appropriate prefix
2. Make your changes
3. Run tests locally:
   ```bash
   npm test
   ```
4. Push your branch and create a Pull Request
5. Ensure all status checks pass:
   - Tests
   - Type checking

## Code Style

- We use TypeScript for type safety
- All tests must pass
- All TypeScript errors must be resolved

## Release Process

Releases are automated through GitHub Actions. When a PR is merged to `main`:

1. The conventional commits workflow will:
   - Update the changelog
   - Update the version number
   - Create a git tag
2. The publish workflow will:
   - Run all tests
   - Build the package
   - Publish to npm

## Questions?

Feel free to open an issue if you have any questions about contributing! 