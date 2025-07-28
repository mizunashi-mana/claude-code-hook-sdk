import { beforeEach, describe, expect, it, vi } from 'vitest';
import { parseHookInput } from '@/api/parseHookInput';
import { type HookHandler } from '@/resource/HookHandler';
import { HookHandlerService } from '@/service/HookHandlerService';
import { ConsoleLoggerService } from '@/service/LoggerService';

vi.mock('@/api/parseHookInput');

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
        'Failed to parse hook input: Invalid input',
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
  });
});
