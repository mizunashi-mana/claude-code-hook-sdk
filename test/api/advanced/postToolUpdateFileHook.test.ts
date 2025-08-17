import { describe, expect, it } from 'vitest';
import { postToolUpdateFileHook, type PostToolUpdateFileHookInput } from '@/api/advanced/postToolUpdateFileHook.js';
import { type PostToolUseHookInput } from '@/resource/HookInput.js';
import { type PostToolUseHookOutput } from '@/resource/HookOutput.js';

describe('postToolUpdateFileHook', () => {
  it('should call handler with correct input for Write tool', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.rawInput.tool_name).toBe('Write');
      expect(input.filePath).toBe('/test/file.ts');
      expect(input.type).toBe('update');
      expect(input.linesAddition).toEqual(['const x = 1;', 'const y = 2;']);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/file.ts', content: 'const x = 1;\nconst y = 2;' },
      tool_response: {
        filePath: '/test/file.ts',
        structuredPatch: [
          {
            oldStart: 1,
            oldLines: 0,
            newStart: 1,
            newLines: 2,
            lines: ['+const x = 1;', '+const y = 2;'],
          },
        ],
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    const result = await wrappedHandler(hookInput);

    expect(result).toEqual({});
  });

  it('should call handler with correct input for Edit tool', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.rawInput.tool_name).toBe('Edit');
      expect(input.filePath).toBe('/test/file.ts');
      expect(input.type).toBe('update');
      expect(input.linesAddition).toEqual(['const x = 2;']);
      expect(input.linesDeletion).toEqual(['const x = 1;']);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Edit',
      tool_input: { file_path: '/test/file.ts', old_string: 'const x = 1;', new_string: 'const x = 2;' },
      tool_response: {
        filePath: '/test/file.ts',
        structuredPatch: [
          {
            oldStart: 1,
            oldLines: 1,
            newStart: 1,
            newLines: 1,
            lines: ['-const x = 1;', '+const x = 2;'],
          },
        ],
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    const result = await wrappedHandler(hookInput);

    expect(result).toEqual({});
  });

  it('should call handler with correct input for Update tool', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.rawInput.tool_name).toBe('Update');
      expect(input.filePath).toBe('/test/file.ts');
      expect(input.type).toBe('update');
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Update',
      tool_input: { file_path: '/test/file.ts' },
      tool_response: {
        filePath: '/test/file.ts',
        structuredPatch: [],
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should call handler with correct input for MultiEdit tool', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.rawInput.tool_name).toBe('MultiEdit');
      expect(input.filePath).toBe('/test/file.ts');
      expect(input.type).toBe('update');
      expect(input.linesAddition).toEqual(['const b = 2;', 'const d = 4;']);
      expect(input.linesDeletion).toEqual(['const a = 1;', 'const c = 3;']);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'MultiEdit',
      tool_input: { file_path: '/test/file.ts', edits: [] },
      tool_response: {
        filePath: '/test/file.ts',
        structuredPatch: [
          {
            oldStart: 1,
            oldLines: 2,
            newStart: 1,
            newLines: 2,
            lines: ['-const a = 1;', '-const c = 3;', '+const b = 2;', '+const d = 4;'],
          },
        ],
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should return empty object and log error for unexpected tool name', async () => {
    const mockHandler = async () => {
      throw new Error('Should not be called');
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Read',
      tool_input: { file_path: '/test/file.ts' },
      tool_response: {},
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    const result = await wrappedHandler(hookInput);

    expect(result).toEqual({});
  });

  it('should return empty object and log error when filePath is not a string', async () => {
    const mockHandler = async () => {
      throw new Error('Should not be called');
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/file.ts' },
      tool_response: {
        filePath: 123,
        structuredPatch: [],
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    const result = await wrappedHandler(hookInput);

    expect(result).toEqual({});
  });

  it('should handle complex structured patches with multiple hunks', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('update');
      expect(input.linesAddition).toEqual(['new line 1', 'new line 2', 'new line 3']);
      expect(input.linesDeletion).toEqual(['old line 1', 'old line 2']);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Edit',
      tool_input: {},
      tool_response: {
        filePath: '/test/file.ts',
        structuredPatch: [
          {
            oldStart: 1,
            oldLines: 1,
            newStart: 1,
            newLines: 2,
            lines: ['-old line 1', '+new line 1', '+new line 2'],
          },
          {
            oldStart: 5,
            oldLines: 1,
            newStart: 6,
            newLines: 1,
            lines: ['-old line 2', '+new line 3'],
          },
        ],
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should handle empty structured patches', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('update');
      expect(input.linesAddition).toEqual([]);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: {},
      tool_response: {
        filePath: '/test/file.ts',
        structuredPatch: [],
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should correctly parse lines with leading + and - characters', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('update');
      expect(input.linesAddition).toEqual(['   console.log("hello");', '   return true;']);
      expect(input.linesDeletion).toEqual(['   console.log("goodbye");', '   return false;']);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Edit',
      tool_input: {},
      tool_response: {
        filePath: '/test/file.ts',
        structuredPatch: [
          {
            oldStart: 1,
            oldLines: 2,
            newStart: 1,
            newLines: 2,
            lines: [
              '-   console.log("goodbye");',
              '-   return false;',
              '+   console.log("hello");',
              '+   return true;',
            ],
          },
        ],
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should handle file creation with content from tool response', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.rawInput.tool_name).toBe('Write');
      expect(input.filePath).toBe('/test/newfile.ts');
      expect(input.type).toBe('create');
      expect(input.linesAddition).toEqual(['const hello = "world";', 'console.log(hello);']);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/newfile.ts' },
      tool_response: {
        filePath: '/test/newfile.ts',
        type: 'create',
        content: 'const hello = "world";\nconsole.log(hello);',
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    const result = await wrappedHandler(hookInput);

    expect(result).toEqual({});
  });

  it('should handle file creation with empty content', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('create');
      expect(input.linesAddition).toEqual([]);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/empty.ts' },
      tool_response: {
        filePath: '/test/empty.ts',
        type: 'create',
        content: '',
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should handle file creation with single line content', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('create');
      expect(input.linesAddition).toEqual(['export default {};']);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/single.ts' },
      tool_response: {
        filePath: '/test/single.ts',
        type: 'create',
        content: 'export default {};',
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should handle file creation with CRLF line endings', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('create');
      expect(input.linesAddition).toEqual(['line 1', 'line 2', 'line 3']);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/crlf.ts' },
      tool_response: {
        filePath: '/test/crlf.ts',
        type: 'create',
        content: 'line 1\r\nline 2\r\nline 3',
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should handle missing content field in create type as empty', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('create');
      expect(input.linesAddition).toEqual([]);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/nocontent.ts' },
      tool_response: {
        filePath: '/test/nocontent.ts',
        type: 'create',
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should handle non-string content field in create type as empty', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('create');
      expect(input.linesAddition).toEqual([]);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/badcontent.ts' },
      tool_response: {
        filePath: '/test/badcontent.ts',
        type: 'create',
        content: 123,
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should handle null content field in create type as empty', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('create');
      expect(input.linesAddition).toEqual([]);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Write',
      tool_input: { file_path: '/test/nullcontent.ts' },
      tool_response: {
        filePath: '/test/nullcontent.ts',
        type: 'create',
        content: null,
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);
    await wrappedHandler(hookInput);
  });

  it('should handle parseStructuredPatch errors gracefully', async () => {
    const mockHandler = async (input: PostToolUpdateFileHookInput): Promise<PostToolUseHookOutput> => {
      expect(input.type).toBe('update');
      expect(input.linesAddition).toEqual([]);
      expect(input.linesDeletion).toEqual([]);
      return {};
    };

    const hookInput: PostToolUseHookInput = {
      hook_event_name: 'PostToolUse',
      session_id: 'test-session',
      transcript_path: '/tmp/test',
      tool_name: 'Edit',
      tool_input: {},
      tool_response: {
        filePath: '/test/file.ts',
        structuredPatch: 'invalid',
      },
    };

    const wrappedHandler = postToolUpdateFileHook(mockHandler);

    // This should throw an error from parseStructuredPatch
    await expect(wrappedHandler(hookInput)).rejects.toThrow();
  });
});
