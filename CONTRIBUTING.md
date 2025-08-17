# Contributing to claude-code-hook-sdk

Thank you for your interest in contributing to the claude-code-hook-sdk! This guide will help you get started with development.

## Development Setup

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- Git

### Getting Started

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/mizunashi-mana/claude-code-hook-sdk.git
   cd claude-code-hook-sdk
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the project:
   ```bash
   npm run build
   ```

## Development Workflow

### Code Structure

- `src/` - Main source code
  - `api/` - Core API functions
    - `advanced/` - Advanced hook utilities
    - `util/` - Utility functions
  - `resource/` - Resource handlers and interfaces
  - `service/` - Service layer with dependency injection
- `test/` - Test files
- `example/` - Example hooks for reference
- `eslint/` - ESLint configurations

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run lint:eslint` - Run ESLint on all files
- `npm run lint:tsc` - Check TypeScript types
- `npm test` - Run tests with Vitest

### Testing

We use Vitest for testing. Write tests for all new features and bug fixes:

```bash
npm test
```

For coverage reports:
```bash
npm test -- --coverage
```

### Code Style

This project uses ESLint for code formatting and linting. Before submitting a PR:

1. Run ESLint to fix formatting issues:
   ```bash
   npm run lint:eslint
   ```

2. Ensure TypeScript types are correct:
   ```bash
   npm run lint:tsc
   ```

## Creating a Pull Request

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them with clear, descriptive messages:
   ```bash
   git commit -m "feat: add new hook handler for X"
   ```

3. Write or update tests for your changes

4. Ensure all tests pass and linting is clean:
   ```bash
   npm test
   npm run lint:eslint
   npm run lint:tsc
   ```

5. Push your branch and create a pull request

### Commit Message Guidelines

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

## Working with Examples

When adding new features, consider adding an example in the `example/` directory to demonstrate usage:

1. Create a new TypeScript file in `example/`
2. Implement a simple hook showcasing the feature
3. Add comments explaining the usage

## Dependency Injection

This SDK uses InversifyJS for dependency injection. When adding new services:

1. Define interfaces in the appropriate resource files
2. Implement services in the `service/` directory
3. Register bindings properly in the container

## Architecture Guidelines

- Keep the API surface minimal and intuitive
- Maintain backward compatibility when possible
- Use TypeScript's type system for compile-time safety
- Follow SOLID principles in service design
- Write self-documenting code with clear naming

## Questions or Issues?

- Check existing issues before creating a new one
- Provide minimal reproduction examples for bugs
- Be respectful and constructive in discussions

## License

By contributing, you agree that your contributions will be licensed under the same dual license as the project (Apache-2.0 OR MPL-2.0).
