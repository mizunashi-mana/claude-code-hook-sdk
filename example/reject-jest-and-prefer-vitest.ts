import { runHook } from '@mizunashi_mana/claude-code-hook-sdk';

void runHook({
  async preToolUseHandler(input) {
    if (input.tool_name !== 'Bash') {
      console.error(`Unexpected tool name: ${input.tool_name}`);
      return {};
    }

    if (typeof input.tool_input.command !== 'string') {
      console.error('Expected command to be a string.');
      return {};
    }

    if (!input.tool_input.command.startsWith('jest')) {
      console.error('Command does not start with "jest".');
      return {};
    }

    return {
      decision: 'block',
      reason: 'Use vitest instead',
    };
  },
});
