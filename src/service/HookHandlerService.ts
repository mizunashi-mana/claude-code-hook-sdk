import { inject, injectable } from 'inversify';
import { parseHookInput } from '@/api/parseHookInput';
import { Tags } from '@/container/Tags';
import { type HookHandler } from '@/resource/HookHandler';
import { isKnownHookInput } from '@/resource/HookInput';
import { HookOutput } from '@/resource/HookOutput';
import { LoggerService } from '@/service/LoggerService';

@injectable()
export class HookHandlerService {
  constructor(@inject(Tags.LoggerService) private readonly loggerService: LoggerService) {}

  public async handleHook(handler: HookHandler, props: {
    input: string;
  }): Promise<{
    output: HookOutput | undefined;
    exitCode: 'success' | 'failure' | 'block';
  }> {
    const { input: inputRaw } = props;

    this.loggerService.debug(`Received hook input: ${inputRaw}`);

    const parseResult = parseHookInput(inputRaw);
    if (parseResult.type === 'error') {
      this.loggerService.error(`Failed to parse hook input: ${parseResult.message}`);
      return {
        output: undefined,
        exitCode: 'failure',
      };
    }

    const input = parseResult.data;

    let output: HookOutput;
    if (handler.preToolUseHandler !== undefined && isKnownHookInput(input, 'PreToolUse')) {
      output = await handler.preToolUseHandler(input);
    } else if (handler.postToolUseHandler !== undefined && isKnownHookInput(input, 'PostToolUse')) {
      output = await handler.postToolUseHandler(input);
    } else if (handler.notificationHandler !== undefined && isKnownHookInput(input, 'Notification')) {
      output = await handler.notificationHandler(input);
    } else if (handler.subagentStopHandler !== undefined && isKnownHookInput(input, 'SubagentStop')) {
      output = await handler.subagentStopHandler(input);
    } else if (handler.stopHandler !== undefined && isKnownHookInput(input, 'Stop')) {
      output = await handler.stopHandler(input);
    } else if (handler.userPromptSubmitHandler !== undefined && isKnownHookInput(input, 'UserPromptSubmit')) {
      output = await handler.userPromptSubmitHandler(input);
    } else if (handler.preCompactHandler !== undefined && isKnownHookInput(input, 'PreCompact')) {
      output = await handler.preCompactHandler(input);
    } else {
      this.loggerService.error(`No valid handler found for hook input: ${inputRaw}`);
      return {
        output: undefined,
        exitCode: 'failure',
      };
    }

    if (output.continue === false || output.decision === 'block') {
      return {
        output,
        exitCode: 'block',
      };
    }

    return {
      output,
      exitCode: 'success',
    };
  }
}
