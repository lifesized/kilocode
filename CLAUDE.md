# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Essential Development Commands

```bash
# Install dependencies
pnpm install

# Run the extension in development mode (F5 in VSCode or)
# This opens a new VSCode window with Kilo Code loaded
# Extension auto-reloads when core code changes in development mode

# Build production VSIX
pnpm build          # Equivalent to pnpm vsix

# Testing
pnpm test           # Run all tests across monorepo
pnpm check-types    # TypeScript type checking
pnpm lint           # ESLint across all packages

# Clean build artifacts
pnpm clean

# Install built extension
code --install-extension "$(ls -1v bin/kilo-code-*.vsix | tail -n1)"
```

### Package-Specific Commands

```bash
# Run single package tests
cd packages/cloud && pnpm test
cd webview-ui && pnpm test

# E2E testing
pnpm playwright     # Playwright E2E tests
cd apps/vscode-e2e && pnpm test:run  # VSCode extension E2E tests

# Frontend development
cd webview-ui && pnpm dev    # React webview development server
```

## Architecture Overview

### Monorepo Structure

- **pnpm workspace** with Turbo for task orchestration
- **`src/`** - Main VS Code extension (TypeScript)
- **`webview-ui/`** - React-based chat interface (React + Tailwind + Vite)
- **`packages/`** - Shared libraries (`@roo-code/*` packages)
- **`apps/`** - Applications (E2E tests, Storybook, web apps)

### Core Extension Architecture (`src/`)

- **`core/`** - Core functionality and AI agent logic
    - **`tools/`** - LLM tool implementations (file operations, search, commands)
    - **`prompts/`** - System prompts, modes, and instruction management
    - **`task/`** - Task management and persistence
    - **`webview/`** - Extension-webview communication
- **`api/`** - AI provider integrations (Anthropic, OpenAI, Bedrock, etc.)
- **`services/`** - Extension services (browser, MCP servers, Git, etc.)
- **`integrations/`** - VSCode integrations (editor, terminal, notifications)

### Key Shared Packages

- **`@roo-code/types`** - TypeScript definitions used across all packages
- **`@roo-code/cloud`** - Authentication and cloud service integration
- **`@roo-code/telemetry`** - Usage analytics and telemetry
- **`@roo-code/evals`** - AI model evaluation framework

### AI Agent Tool System

The extension implements an LLM-powered coding agent with tools defined in `src/core/tools/`:

- File operations: `readFileTool`, `writeToFileTool`, `listFilesTool`
- Code operations: `searchAndReplaceTool`, `applyDiffTool`, `insertContentTool`
- System operations: `executeCommandTool`, `browserActionTool`
- Agent operations: `attemptCompletionTool`, `askFollowupQuestionTool`, `newTaskTool`

### Mode System

Custom modes defined in `src/core/prompts/` allow different AI agent behaviors:

- Architect mode - Planning and design
- Code mode - Implementation
- Debugger mode - Error resolution
- Custom user-defined modes

### MCP (Model Context Protocol) Integration

- **MCP Hub** in `src/services/mcp/` manages external MCP servers
- Extends agent capabilities through community MCP servers
- Tool marketplace for easy server discovery and installation

## Testing Framework

### Test Organization

- **Vitest** for unit/integration tests across all packages
- **Playwright** for E2E browser testing (`apps/playwright-e2e/`)
- **Mocha + @vscode/test-electron** for VSCode extension E2E tests
- **nock** for HTTP mocking in tests

### Test Patterns

- Tests located in `**/__tests__/` directories and `*.spec.ts` files
- VSCode API mocked via path aliases pointing to `__mocks__/vscode.js`
- Network isolation enforced in test setup with nock
- Type generation must complete before tests run

### Key Test Commands

```bash
# All tests (requires types to be built first)
pnpm test

# Individual test suites
cd src && pnpm test                    # Core extension tests
cd webview-ui && pnpm test           # React component tests
cd apps/playwright-e2e && pnpm test  # E2E tests
```

## Development Guidelines

### Kilocode Change Marking

This project is a fork of Roo Code with regular upstream merges. Mark all Kilo-specific changes:

```typescript
// Single line changes
let kiloFeature = true // kilocode_change

// Multi-line changes
// kilocode_change start
function kiloSpecificFunction() {
	// implementation
}
// kilocode_change end

// New files (at top of file)
// kilocode_change - new file
```

### Code Organization

- Core AI agent logic in `src/core/`
- AI provider adapters in `src/api/providers/`
- VSCode-specific integrations in `src/integrations/`
- Shared utilities in workspace packages under `packages/`
- UI components in `webview-ui/src/components/`

### Hot Reloading

- **Development mode**: Core extension changes trigger automatic reload
- **Production builds**: Must manually stop/restart debugger after core changes
- **Webview changes**: Always hot reload without restart

### Build System

- **ESBuild** for extension bundling (`src/esbuild.mjs`)
- **Vite** for webview UI bundling
- **Turbo** for monorepo task coordination and caching
- **TypeScript** compilation across all packages

### Key Files to Understand

- `src/extension.ts` - Extension entry point and activation
- `src/core/webview/ClineProvider.ts` - Main webview provider and message handler
- `src/core/task/Task.ts` - Core task management and AI agent coordination
- `src/api/providers/` - AI model provider implementations
- `webview-ui/src/App.tsx` - Main React chat interface

## Common Development Patterns

### Adding New AI Tools

1. Create tool implementation in `src/core/tools/`
2. Add tool to prompts in `src/core/prompts/tools/`
3. Register tool in tool index
4. Add tests in `src/core/tools/__tests__/`

### Adding New AI Providers

1. Implement provider in `src/api/providers/`
2. Add provider configuration types
3. Add transform logic in `src/api/transform/`
4. Register provider in provider index
5. Add comprehensive tests

### Modifying the UI

1. Update React components in `webview-ui/src/components/`
2. Add new message types in shared types package
3. Update webview message handler in `src/core/webview/`
4. Test in Storybook (`apps/storybook/`)

## Important Environment Requirements

- **Node.js**: 20.19.2 (specified in .nvmrc)
- **pnpm**: 10.8.1+ for workspace management
- **VSCode**: 1.84.0+ for extension development
- **Required VSCode extension**: ESBuild Problem Matchers for proper error display

## Committ rules

1. Never commit without explicit permission
2. Never commit without a description
3. Never commit to remote, keep everything local.
4. Develop all work on a branch, never on main.
5. Never add Claude Code as a co-author to any commits OR saying that this commit is NOT with claude code as a co-author.
