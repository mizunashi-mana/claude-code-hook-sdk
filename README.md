# A 3rd-party SDK for claude-code Hooks

[![CI](https://github.com/mizunashi-mana/claude-code-hook-sdk/actions/workflows/test.yml/badge.svg)](https://github.com/mizunashi-mana/claude-code-hook-sdk/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/@mizunashi_mana%2Fclaude-code-hook-sdk.svg)](https://www.npmjs.com/package/@mizunashi_mana/claude-code-hook-sdk)
[![npm downloads](https://img.shields.io/npm/dm/@mizunashi_mana/claude-code-hook-sdk.svg)](https://www.npmjs.com/package/@mizunashi_mana/claude-code-hook-sdk)
[![License](https://img.shields.io/npm/l/@mizunashi_mana/claude-code-hook-sdk.svg)](https://github.com/mizunashi-mana/claude-code-hook-sdk/blob/main/LICENSE)

A TypeScript SDK to write claude-code hooks easily with type safety, dependency injection, and comprehensive testing support.

## Quick Start

### Installation

```bash
npm install -D @mizunashi_mana/claude-code-hook-sdk tsx
```

### Basic Usage

Create a simple hook that logs all tool usage:

```typescript
import { runHook } from '@mizunashi_mana/claude-code-hook-sdk';

void runHook({
  preToolUseHandler: async (input) => {
    console.error(`Tool: ${input.tool_name}`);
    return {};
  },
});
```

See [examples](example/).

### Running Your Hook

Edit `.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "npx tsx your-hook.ts"
          }
        ]
      },
    ]
  }
}
```

## Reference

See also:

* Claude Code Official Reference: https://docs.anthropic.com/en/docs/claude-code/hooks

## License Notice

This repository is offered under your choice of the following licenses:

- **Apache License, Version 2.0**  
  You may use, modify, and distribute this repository under the terms of the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

- **Mozilla Public License, Version 2.0**  
  You may use, modify, and distribute this repository under the terms of the [Mozilla Public License 2.0](https://www.mozilla.org/MPL/2.0/).

**Note:** By contributing to or using this repository, you agree to comply with the full text of the license you select.

See [LICENSE](./LICENSE) also.
