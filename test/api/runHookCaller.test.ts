import { describe, expect, it } from 'vitest';
import { runHookCaller } from '@/api/runHookCaller';
import { type HookHandler } from '@/resource/HookHandler';

describe('runHookCaller', () => {
  it('should handle valid PreToolUse JSON input successfully', async () => {
    const preToolUseHandler = async () => ({
      continue: true,
    });

    const handler: HookHandler = { preToolUseHandler };

    const validJsonInput = JSON.stringify({
      hook_event_name: 'PreToolUse',
      session_id: 'test-session-123',
      transcript_path: '/tmp/transcript.json',
      tool_name: 'test-tool',
      tool_input: { param1: 'value1', param2: 42 },
    });

    const result = await runHookCaller(handler, { input: validJsonInput });

    expect(result).toEqual({
      output: { continue: true },
      exitCode: 'success',
    });
  });

  it('should handle valid PostToolUse JSON input successfully', async () => {
    const postToolUseHandler = async () => ({
      continue: true,
    });

    const handler: HookHandler = { postToolUseHandler };

    const validJsonInput = JSON.stringify({
      hook_event_name: 'PostToolUse',
      session_id: 'test-session-456',
      transcript_path: '/tmp/transcript.json',
      tool_name: 'another-tool',
      tool_input: { query: 'test' },
      tool_response: { result: 'success', data: [1, 2, 3] },
    });

    const result = await runHookCaller(handler, { input: validJsonInput });

    expect(result).toEqual({
      output: { continue: true },
      exitCode: 'success',
    });
  });

  it('should handle valid Notification JSON input successfully', async () => {
    const notificationHandler = async () => ({
      continue: true,
    });

    const handler: HookHandler = { notificationHandler };

    const validJsonInput = JSON.stringify({
      hook_event_name: 'Notification',
      session_id: 'test-session-789',
      transcript_path: '/tmp/transcript.json',
      message: 'This is a test notification message',
    });

    const result = await runHookCaller(handler, { input: validJsonInput });

    expect(result).toEqual({
      output: { continue: true },
      exitCode: 'success',
    });
  });
});
