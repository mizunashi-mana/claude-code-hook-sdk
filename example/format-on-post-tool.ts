import * as fs from 'node:fs/promises';
import { runHook, HookInputToolResponse, execFileAsync } from '@mizunashi_mana/claude-code-hook-sdk';

void runHook({
  async postToolUseHandler(input) {
    if (!['Write', 'Update', 'Edit', 'MultiEdit'].includes(input.tool_name)) {
      console.error(`Unexpected tool name: ${input.tool_name}`);
      return {};
    }

    const structuredPatch = HookInputToolResponse.parseStructuredPatch(input.tool_response);

    const filePath = input.tool_response.filePath;
    if (typeof filePath !== 'string') {
      console.error('Expected filePath to be a string.');
      return {};
    }

    if (validateStructuredPatch(structuredPatch)) {
      console.error('Structured patch contains lines that are not import statements.');
      return {};
    }

    await fs.access(filePath);

    const { stdout: lsFilesOutput } = await execFileAsync('git', ['ls-files', '--', filePath]);
    if (lsFilesOutput === '') {
      await execFileAsync('git', ['add', '--intent-to-add', filePath]);
    }

    await execFileAsync('pre-commit', ['run', '--files', filePath]);

    return {};
  },
});

function validateStructuredPatch(structuredPatch: HookInputToolResponse.StructuredPatch): boolean {
  const patchLines = structuredPatch.flatMap(patch => patch.lines);

  return patchLines.some((line) => {
    return line.startsWith('+') && !line.startsWith('+import ');
  });
}
