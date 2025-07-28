import { describe, expect, it } from 'vitest';
import { parseHookInput } from '@/api/parseHookInput';

describe('parseHookInput', () => {
  it('should parse valid PreToolUse hook input', () => {
    const input = JSON.stringify({
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'test-tool',
      tool_input: { param: 'value' },
    });

    const result = parseHookInput(input);

    expect(result).toEqual({
      type: 'success',
      data: {
        hook_event_name: 'PreToolUse',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        tool_name: 'test-tool',
        tool_input: { param: 'value' },
      },
    });
  });

  it('should return error for invalid JSON', () => {
    const input = 'invalid json';

    const result = parseHookInput(input);

    expect(result.type).toBe('error');
    if (result.type === 'error') {
      expect(result.message).toContain('JSON');
    }
  });

  it('should return error for invalid schema', () => {
    const input = JSON.stringify({
      hook_event_name: 'InvalidEvent',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
    });

    const result = parseHookInput(input);

    expect(result.type).toBe('error');
  });
});
