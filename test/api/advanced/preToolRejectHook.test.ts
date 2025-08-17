import { describe, expect, it } from 'vitest';
import { preToolRejectHook, type PreToolRejectHookConfig } from '@/api/advanced/preToolRejectHook.js';
import { type PreToolUseHookInput } from '@/resource/HookInput.js';
import { type PreToolUseHookOutput } from '@/resource/HookOutput.js';

describe('preToolRejectHook', () => {
  it('should return empty object when no config matches', async () => {
    const config: PreToolRejectHookConfig = {};
    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Read',
      tool_input: { file_path: '/test/file.ts' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({});
  });

  it('should call extra handler when provided', async () => {
    const mockExtra = async (input: PreToolUseHookInput): Promise<PreToolUseHookOutput> => {
      expect(input.tool_name).toBe('Read');
      return { decision: 'block', reason: 'Custom block reason' };
    };

    const config: PreToolRejectHookConfig = {
      extra: mockExtra,
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Read',
      tool_input: { file_path: '/test/file.ts' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({ decision: 'block', reason: 'Custom block reason' });
  });

  it('should process Bash tool with regex config and block matching command', async () => {
    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'regex',
            match: /^rm\s+/,
            preferTool: 'Use Read tool instead of rm command',
          },
        ],
      },
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 'rm -rf /tmp/file.txt' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({
      decision: 'block',
      reason: 'Use Read tool instead of rm command',
    });
  });

  it('should process Bash tool with regex config and allow non-matching command', async () => {
    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'regex',
            match: /^rm\s+/,
            preferTool: 'Use Read tool instead of rm command',
          },
        ],
      },
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 'ls -la' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({});
  });

  it('should process Bash tool with function config and block when function returns reason', async () => {
    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'function',
            handler: (command: string) => {
              if (command.includes('dangerous')) {
                return 'Command contains dangerous operation';
              }
              return undefined;
            },
          },
        ],
      },
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 'dangerous-operation --force' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({
      decision: 'block',
      reason: 'Command contains dangerous operation',
    });
  });

  it('should process Bash tool with function config and allow when function returns undefined', async () => {
    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'function',
            handler: (command: string) => {
              if (command.includes('dangerous')) {
                return 'Command contains dangerous operation';
              }
              return undefined;
            },
          },
        ],
      },
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 'echo hello' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({});
  });

  it('should process multiple preferAnotherTools rules and use first match', async () => {
    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'regex',
            match: /^rm\s+/,
            preferTool: 'First rule matched',
          },
          {
            type: 'regex',
            match: /rm/,
            preferTool: 'Second rule matched',
          },
        ],
      },
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 'rm file.txt' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({
      decision: 'block',
      reason: 'First rule matched',
    });
  });

  it('should return empty object and log error when Bash command is not a string', async () => {
    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'regex',
            match: /rm/,
            preferTool: 'Should not be called',
          },
        ],
      },
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 123 },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({});
  });

  it('should prioritize bash config over extra handler for Bash tool', async () => {
    const mockExtra = async (): Promise<PreToolUseHookOutput> => {
      return { decision: 'block', reason: 'Extra handler called' };
    };

    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'regex',
            match: /ls/,
            preferTool: 'Bash config matched',
          },
        ],
      },
      extra: mockExtra,
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 'ls -la' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({
      decision: 'block',
      reason: 'Bash config matched',
    });
  });

  it('should call extra handler when bash config does not match', async () => {
    const mockExtra = async (input: PreToolUseHookInput): Promise<PreToolUseHookOutput> => {
      expect(input.tool_name).toBe('Bash');
      return { decision: 'block', reason: 'Extra handler fallback' };
    };

    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'regex',
            match: /rm/,
            preferTool: 'Should not match',
          },
        ],
      },
      extra: mockExtra,
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 'echo hello' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({
      decision: 'block',
      reason: 'Extra handler fallback',
    });
  });

  it('should handle mixed regex and function rules', async () => {
    const config: PreToolRejectHookConfig = {
      bash: {
        preferAnotherTools: [
          {
            type: 'regex',
            match: /^cat\s+/,
            preferTool: 'Use Read tool instead of cat',
          },
          {
            type: 'function',
            handler: (command: string) => {
              if (command.includes('--force')) {
                return 'Avoid using --force flag';
              }
              return undefined;
            },
          },
        ],
      },
    };

    const hookInput: PreToolUseHookInput = {
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Bash',
      tool_input: { command: 'rm --force file.txt' },
    };

    const hook = preToolRejectHook(config);
    const result = await hook(hookInput);

    expect(result).toEqual({
      decision: 'block',
      reason: 'Avoid using --force flag',
    });
  });
});
