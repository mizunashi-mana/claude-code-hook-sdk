import { buildContainer } from '@/container/buildContainer';
import { Tags } from '@/container/Tags';
import { type HookHandler } from '@/resource/HookHandler';
import { type HookOutput } from '@/resource/HookOutput';
import { type HookHandlerService } from '@/service/HookHandlerService';

export async function runHookCaller(hook: HookHandler, props: { input: string }): Promise<{ output: HookOutput | undefined; exitCode: 'success' | 'failure' | 'block' }> {
  const container = buildContainer();
  const hookHandlerService = container.get<HookHandlerService>(Tags.HookHandlerService);

  return await hookHandlerService.handleHook(hook, { input: props.input });
}
