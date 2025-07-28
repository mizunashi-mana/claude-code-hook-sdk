import { runHookCaller } from '@/api/runHookCaller';
import { type HookHandler } from '@/resource/HookHandler';

export async function runHook(handler: HookHandler): Promise<void> {
  let input = '';
  process.stdin.setEncoding('utf8');
  for await (const chunk of process.stdin) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access -- Original type definition problem
    input += chunk.toString();
  }

  const result = await runHookCaller(handler, { input });

  if (result.output !== undefined) {
    process.stdout.write(JSON.stringify(result.output) + '\n');
  }

  let exitCode: number;
  if (result.exitCode === 'block') {
    exitCode = 2;
  } else if (result.exitCode === 'failure') {
    exitCode = 1;
  } else {
    exitCode = 0;
  }

  // eslint-disable-next-line n/no-process-exit -- Allowed in CLI tools
  process.exit(exitCode);
}
