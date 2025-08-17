import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseHookInput } from '@/api/parseHookInput.js';
import { type HookHandler } from '@/resource/HookHandler.js';
import { HookHandlerService } from '@/service/HookHandlerService.js';
import { ConsoleLoggerService } from '@/service/LoggerService.js';

vi.mock('@/api/parseHookInput.js');

const mockParseHookInput = vi.mocked(parseHookInput);

describe('HookHandlerService', () => {
  let service: HookHandlerService;
  let mockLoggerService: ConsoleLoggerService;

  beforeEach(() => {
    mockLoggerService = new ConsoleLoggerService();
    vi.spyOn(mockLoggerService, 'debug').mockImplementation(() => {});
    vi.spyOn(mockLoggerService, 'error').mockImplementation(() => {});

    service = new HookHandlerService(mockLoggerService);
    vi.clearAllMocks();
  });

  describe('handleHook', () => {
    it('should return failure when parsing fails', async () => {
      const handler: HookHandler = {};
      mockParseHookInput.mockReturnValue({
        type: 'error',
        message: 'Invalid input',
      });

      const result = await service.handleHook(handler, { input: 'invalid' });

      expect(result).toEqual({
        output: undefined,
        exitCode: 'failure',
      });
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'Invalid input',
      );
    });

    it('should handle PreToolUse hook successfully', async () => {
      const preToolUseHandler = vi.fn().mockResolvedValue({
        continue: true,
      });
      const handler: HookHandler = { preToolUseHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PreToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(preToolUseHandler).toHaveBeenCalledWith({
        hook_event_name: 'PreToolUse',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        tool_name: 'test-tool',
        tool_input: {},
      });
      expect(result).toEqual({
        output: { continue: true },
        exitCode: 'success',
      });
    });

    it('should handle PostToolUse hook successfully', async () => {
      const postToolUseHandler = vi.fn().mockResolvedValue({
        continue: true,
      });
      const handler: HookHandler = { postToolUseHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PostToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
          tool_response: { result: 'success' },
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(postToolUseHandler).toHaveBeenCalledWith({
        hook_event_name: 'PostToolUse',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        tool_name: 'test-tool',
        tool_input: {},
        tool_response: { result: 'success' },
      });
      expect(result).toEqual({
        output: { continue: true },
        exitCode: 'success',
      });
    });

    it('should return block when output.continue is false', async () => {
      const preToolUseHandler = vi.fn().mockResolvedValue({
        continue: false,
      });
      const handler: HookHandler = { preToolUseHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PreToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { continue: false },
        exitCode: 'block',
      });
    });

    it('should return block when output.decision is block', async () => {
      const notificationHandler = vi.fn().mockResolvedValue({
        decision: 'block',
      });
      const handler: HookHandler = { notificationHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'Notification',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          message: 'test notification',
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { decision: 'block' },
        exitCode: 'block',
      });
    });

    it('should return failure when no valid handler is found', async () => {
      const handler: HookHandler = {};

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PreToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: undefined,
        exitCode: 'failure',
      });
      expect(mockLoggerService.error).toHaveBeenCalledWith(
        'No valid handler found for hook input: test input',
      );
    });

    it('should handle SubagentStop hook successfully', async () => {
      const subagentStopHandler = vi.fn().mockResolvedValue({
        continue: true,
      });
      const handler: HookHandler = { subagentStopHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'SubagentStop',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          stop_hook_active: true,
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(subagentStopHandler).toHaveBeenCalledWith({
        hook_event_name: 'SubagentStop',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        stop_hook_active: true,
      });
      expect(result).toEqual({
        output: { continue: true },
        exitCode: 'success',
      });
    });

    it('should handle Stop hook successfully', async () => {
      const stopHandler = vi.fn().mockResolvedValue({
        continue: true,
      });
      const handler: HookHandler = { stopHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'Stop',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          stop_hook_active: true,
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(stopHandler).toHaveBeenCalledWith({
        hook_event_name: 'Stop',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        stop_hook_active: true,
      });
      expect(result).toEqual({
        output: { continue: true },
        exitCode: 'success',
      });
    });

    it('should log debug message for received input', async () => {
      const handler: HookHandler = {};
      mockParseHookInput.mockReturnValue({
        type: 'error',
        message: 'test error',
      });

      await service.handleHook(handler, { input: 'test input' });

      expect(mockLoggerService.debug).toHaveBeenCalledWith(
        'Received hook input: test input',
      );
    });

    it('should handle UserPromptSubmit hook successfully', async () => {
      const userPromptSubmitHandler = vi.fn().mockResolvedValue({
        continue: true,
      });
      const handler: HookHandler = { userPromptSubmitHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'UserPromptSubmit',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          prompt: 'test prompt',
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(userPromptSubmitHandler).toHaveBeenCalledWith({
        hook_event_name: 'UserPromptSubmit',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        prompt: 'test prompt',
      });
      expect(result).toEqual({
        output: { continue: true },
        exitCode: 'success',
      });
    });

    it('should handle PreCompact hook successfully', async () => {
      const preCompactHandler = vi.fn().mockResolvedValue({
        continue: true,
      });
      const handler: HookHandler = { preCompactHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PreCompact',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          trigger: 'test trigger',
          custom_instructions: 'test instructions',
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(preCompactHandler).toHaveBeenCalledWith({
        hook_event_name: 'PreCompact',
        session_id: 'test-session',
        transcript_path: '/tmp/test',
        trigger: 'test trigger',
        custom_instructions: 'test instructions',
      });
      expect(result).toEqual({
        output: { continue: true },
        exitCode: 'success',
      });
    });

    it('should return block when PreToolUse handler returns decision block', async () => {
      const preToolUseHandler = vi.fn().mockResolvedValue({
        decision: 'block',
        reason: 'Tool blocked',
      });
      const handler: HookHandler = { preToolUseHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PreToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { decision: 'block', reason: 'Tool blocked' },
        exitCode: 'block',
      });
    });

    it('should return block when PostToolUse handler returns decision block', async () => {
      const postToolUseHandler = vi.fn().mockResolvedValue({
        decision: 'block',
        reason: 'Response blocked',
      });
      const handler: HookHandler = { postToolUseHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PostToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
          tool_response: {},
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { decision: 'block', reason: 'Response blocked' },
        exitCode: 'block',
      });
    });

    it('should return block when both continue false and decision block are set', async () => {
      const preToolUseHandler = vi.fn().mockResolvedValue({
        continue: false,
        decision: 'block',
        reason: 'Double block',
      });
      const handler: HookHandler = { preToolUseHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PreToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { continue: false, decision: 'block', reason: 'Double block' },
        exitCode: 'block',
      });
    });

    it('should handle Stop hook with decision block', async () => {
      const stopHandler = vi.fn().mockResolvedValue({
        decision: 'block',
        reason: 'Stop blocked',
      });
      const handler: HookHandler = { stopHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'Stop',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          stop_hook_active: false,
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { decision: 'block', reason: 'Stop blocked' },
        exitCode: 'block',
      });
    });

    it('should handle SubagentStop hook with decision block', async () => {
      const subagentStopHandler = vi.fn().mockResolvedValue({
        decision: 'block',
        reason: 'SubagentStop blocked',
      });
      const handler: HookHandler = { subagentStopHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'SubagentStop',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          stop_hook_active: false,
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { decision: 'block', reason: 'SubagentStop blocked' },
        exitCode: 'block',
      });
    });

    it('should handle UserPromptSubmit hook with decision block', async () => {
      const userPromptSubmitHandler = vi.fn().mockResolvedValue({
        decision: 'block',
        reason: 'Prompt blocked',
      });
      const handler: HookHandler = { userPromptSubmitHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'UserPromptSubmit',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          prompt: 'dangerous prompt',
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { decision: 'block', reason: 'Prompt blocked' },
        exitCode: 'block',
      });
    });

    it('should return success when output has no blocking conditions', async () => {
      const preToolUseHandler = vi.fn().mockResolvedValue({
        suppressOutput: true,
        continue: true,
      });
      const handler: HookHandler = { preToolUseHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PreToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: { suppressOutput: true, continue: true },
        exitCode: 'success',
      });
    });

    it('should handle empty HookOutput correctly', async () => {
      const notificationHandler = vi.fn().mockResolvedValue({});
      const handler: HookHandler = { notificationHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'Notification',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          message: 'test notification',
        },
      });

      const result = await service.handleHook(handler, { input: 'test input' });

      expect(result).toEqual({
        output: {},
        exitCode: 'success',
      });
    });

    it('should handle handler that throws an error', async () => {
      const preToolUseHandler = vi.fn().mockRejectedValue(new Error('Handler error'));
      const handler: HookHandler = { preToolUseHandler };

      mockParseHookInput.mockReturnValue({
        type: 'success',
        data: {
          hook_event_name: 'PreToolUse',
          session_id: 'test-session',
          transcript_path: '/tmp/test',
          tool_name: 'test-tool',
          tool_input: {},
        },
      });

      await expect(
        service.handleHook(handler, { input: 'test input' }),
      ).rejects.toThrow('Handler error');
    });
  });
});
