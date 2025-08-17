import { describe, expect, it } from 'vitest';
import { parseHookInput } from '@/api/parseHookInput.js';
import { assertStrictEqual } from '@~test/util/assert.js';

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

    assertStrictEqual(result.type, 'error');
    expect(result.message).toContain('JSON');
  });

  it('should return error for invalid schema', () => {
    const input = JSON.stringify({
      hook_event_name: 'InvalidEvent',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
    });

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'error');
    expect(result.message).toContain('Invalid JSON schema');
  });

  it('should parse valid PostToolUse hook input', () => {
    const input = JSON.stringify({
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/file.ts' },
      tool_response: { success: true },
    });

    const result = parseHookInput(input);

    expect(result).toEqual({
      type: 'success',
      data: {
        hook_event_name: 'PostToolUse',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        tool_name: 'Write',
        tool_input: { file_path: '/test/file.ts' },
        tool_response: { success: true },
      },
    });
  });

  it('should parse valid Notification hook input', () => {
    const input = JSON.stringify({
      hook_event_name: 'Notification',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      message: 'Test notification message',
    });

    const result = parseHookInput(input);

    expect(result).toEqual({
      type: 'success',
      data: {
        hook_event_name: 'Notification',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        message: 'Test notification message',
      },
    });
  });

  it('should parse valid Stop hook input', () => {
    const input = JSON.stringify({
      hook_event_name: 'Stop',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      stop_hook_active: true,
    });

    const result = parseHookInput(input);

    expect(result).toEqual({
      type: 'success',
      data: {
        hook_event_name: 'Stop',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        stop_hook_active: true,
      },
    });
  });

  it('should parse valid SubagentStop hook input', () => {
    const input = JSON.stringify({
      hook_event_name: 'SubagentStop',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      stop_hook_active: false,
    });

    const result = parseHookInput(input);

    expect(result).toEqual({
      type: 'success',
      data: {
        hook_event_name: 'SubagentStop',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        stop_hook_active: false,
      },
    });
  });

  it('should parse valid UserPromptSubmit hook input', () => {
    const input = JSON.stringify({
      hook_event_name: 'UserPromptSubmit',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      prompt: 'What is the weather today?',
    });

    const result = parseHookInput(input);

    expect(result).toEqual({
      type: 'success',
      data: {
        hook_event_name: 'UserPromptSubmit',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        prompt: 'What is the weather today?',
      },
    });
  });

  it('should parse valid PreCompact hook input', () => {
    const input = JSON.stringify({
      hook_event_name: 'PreCompact',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      trigger: 'automatic',
      custom_instructions: 'Keep important details',
    });

    const result = parseHookInput(input);

    expect(result).toEqual({
      type: 'success',
      data: {
        hook_event_name: 'PreCompact',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        trigger: 'automatic',
        custom_instructions: 'Keep important details',
      },
    });
  });

  it('should return error for malformed JSON', () => {
    const input = '{"invalid": json}';

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'error');
    expect(result.message).toBe('JSON parsing error: Invalid JSON format');
  });

  it('should return error for empty string', () => {
    const input = '';

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'error');
    expect(result.message).toBe('JSON parsing error: Invalid JSON format');
  });

  it('should return error for missing required fields', () => {
    const input = JSON.stringify({
      hook_event_name: 'PreToolUse',
      session_id: 'test-session',
      // missing transcript_path, tool_name, tool_input
    });

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'error');
    expect(result.message).toContain('Invalid JSON schema');
  });

  it('should return error for wrong field types', () => {
    const input = JSON.stringify({
      hook_event_name: 'Notification',
      session_id: 123, // should be string
      transcript_path: '/tmp/test',
      message: 'test',
    });

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'error');
    expect(result.message).toContain('Invalid JSON schema');
  });

  it('should return error for null input', () => {
    const input = 'null';

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'error');
    expect(result.message).toContain('Invalid JSON schema');
  });

  it('should return error for array input', () => {
    const input = JSON.stringify([
      {
        hook_event_name: 'PreToolUse',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        tool_name: 'test-tool',
        tool_input: {},
      },
    ]);

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'error');
    expect(result.message).toContain('Invalid JSON schema');
  });

  it('should return error for primitive input', () => {
    const input = '"just a string"';

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'error');
    expect(result.message).toContain('Invalid JSON schema');
  });

  it('should handle complex tool_input and tool_response objects', () => {
    const input = JSON.stringify({
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'MultiEdit',
      tool_input: {
        file_path: '/test/file.ts',
        edits: [
          { old_string: 'old', new_string: 'new' },
          { old_string: 'another', new_string: 'replacement' },
        ],
      },
      tool_response: {
        success: true,
        filePath: '/test/file.ts',
        structuredPatch: [
          {
            oldStart: 1,
            oldLines: 1,
            newStart: 1,
            newLines: 1,
            lines: ['-old', '+new'],
          },
        ],
      },
    });

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'success');
    assertStrictEqual(result.data.hook_event_name, 'PostToolUse');
    expect(result.data.tool_name).toBe('MultiEdit');
    expect(result.data.tool_input).toEqual({
      file_path: '/test/file.ts',
      edits: [
        { old_string: 'old', new_string: 'new' },
        { old_string: 'another', new_string: 'replacement' },
      ],
    });
  });

  it('should handle extra unknown fields gracefully', () => {
    const input = JSON.stringify({
      hook_event_name: 'Notification',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      message: 'test message',
      extra_field: 'should be ignored',
      another_extra: 123,
    });

    const result = parseHookInput(input);

    assertStrictEqual(result.type, 'success');
    expect(result.data).toEqual({
      hook_event_name: 'Notification',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      message: 'test message',
    });
  });
});
