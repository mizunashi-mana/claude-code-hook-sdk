import * as fs from 'node:fs/promises';
import { runHook, execFileAsync, postToolUpdateFileHook } from '@mizunashi_mana/claude-code-hook-sdk';

void runHook({
  postToolUseHandler: postToolUpdateFileHook(async (input) => {
    if (input.linesAddition.every(line => line.startsWith('import'))) {
      return {};
    }

    await fs.access(input.filePath);

    const { stdout: lsFilesOutput } = await execFileAsync('git', ['ls-files', '--', input.filePath]);
    if (lsFilesOutput === '') {
      await execFileAsync('git', ['add', '--intent-to-add', input.filePath]);
    }

    await execFileAsync('pre-commit', ['run', '--files', input.filePath]);

    return {};
  }),
});
