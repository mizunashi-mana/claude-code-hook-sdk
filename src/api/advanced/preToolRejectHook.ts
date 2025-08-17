import { type PreToolUseHookInput } from '@/resource/HookInput.js';
import { type PreToolUseHookOutput } from '@/resource/HookOutput.js';

export type PreToolRejectHookConfig = {
  bash?: PreToolRejectHookBashConfig;
  extra?: (input: PreToolUseHookInput) => Promise<PreToolUseHookOutput>;
};

export type PreToolRejectHookBashConfig = {
  preferAnotherTools: Array<{
    type: 'regex';
    match: RegExp;
    preferTool: string;
  } | {
    type: 'function';
    handler: (command: string) => string | undefined;
  }>;
};

export function preToolRejectHook(config: PreToolRejectHookConfig): (input: PreToolUseHookInput) => Promise<PreToolUseHookOutput> {
  return async (input: PreToolUseHookInput) => {
    if (input.tool_name === 'Bash' && config.bash !== undefined) {
      const result = await bashHook(config.bash, input);
      if (result !== undefined) {
        return result;
      }
    }

    if (config.extra !== undefined) {
      return await config.extra(input);
    }

    return {};
  };
}

async function bashHook(config: PreToolRejectHookBashConfig, input: PreToolUseHookInput): Promise<PreToolUseHookOutput | undefined> {
  if (typeof input.tool_input.command !== 'string') {
    console.error('Expected command to be a string.');
    return {};
  }

  for (const preferAnotherTool of config.preferAnotherTools) {
    switch (preferAnotherTool.type) {
      case 'regex':
        if (preferAnotherTool.match.test(input.tool_input.command)) {
          console.error(`Block ${input.tool_input.command}: ${preferAnotherTool.preferTool}`);
          return {
            decision: 'block',
            reason: preferAnotherTool.preferTool,
          };
        }
        break;
      case 'function': {
        const result = preferAnotherTool.handler(input.tool_input.command);
        if (result !== undefined) {
          console.error(`Block ${input.tool_input.command}: ${result}`);
          return {
            decision: 'block',
            reason: result,
          };
        }
        break;
      }
    }
  }

  return undefined;
}
