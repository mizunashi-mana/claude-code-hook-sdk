import { buildContainer } from '@/container/buildContainer.js';
import { Tags } from '@/container/Tags.js';
import { type HookHandler } from '@/resource/HookHandler.js';
import { type HookOutput } from '@/resource/HookOutput.js';
import { type HookHandlerService } from '@/service/HookHandlerService.js';

export async function runHookCaller(hook: HookHandler, props: { input: string }): Promise<{ output: HookOutput | undefined; exitCode: 'success' | 'failure' | 'block' }> {
  const container = buildContainer();
  const hookHandlerService = container.get<HookHandlerService>(Tags.HookHandlerService);

  return await hookHandlerService.handleHook(hook, { input: props.input });
}
