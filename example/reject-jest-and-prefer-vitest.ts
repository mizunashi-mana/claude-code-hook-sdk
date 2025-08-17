import { preToolRejectHook, runHook } from '@mizunashi_mana/claude-code-hook-sdk';

void runHook({
  preToolUseHandler: preToolRejectHook({
    bash: {
      preferAnotherTools: [
        {
          type: 'regex',
          match: /jest/,
          preferTool: 'Use vitest instead',
        },
      ],
    },
  }),
});
