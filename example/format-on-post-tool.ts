import { execFile } from 'node:child_process';
import * as fs from 'node:fs/promises';
import { runHook } from '@mizunashi_mana/claude-code-hook-sdk';

void runHook({
  async postToolUseHandler(input) {
    if (!['Write', 'Update', 'Edit', 'MultiEdit'].includes(input.tool_name)) {
      console.error(`Unexpected tool name: ${input.tool_name}`);
      return {};
    }

    const structuredPatch = input.tool_response.structuredPatch;
    if (!isStructuredPatch(structuredPatch)) {
      console.error('Expected structuredPatch to be an array.');
      return {};
    }

    const filePath = input.tool_response.filePath;
    if (typeof filePath !== 'string') {
      console.error('Expected filePath to be a string.');
      return {};
    }

    if (validateStructuredPatch(structuredPatch)) {
      console.error('Structured patch contains lines that are not import statements.');
      return {};
    }

    try {
      await fs.access(filePath);
    } catch (_error) {
      console.error(`File does not exist: ${filePath}`);
      return {};
    }

    const { stdout: lsFilesOutput } = await execFileAsync('git', ['ls-files', '--', filePath]);
    if (lsFilesOutput === '') {
      await execFileAsync('git', ['add', '--intent-to-add', filePath]);
    }

    await execFileAsync('pre-commit', ['run', '--files', filePath]);

    return {};
  },
});

function isStructuredPatch(structuredPatch: unknown): structuredPatch is Array<{
  lines?: string[];
}> {
  return Array.isArray(structuredPatch);
}

function validateStructuredPatch(structuredPatch: Array<{
  lines?: string[];
}>): boolean {
  const patchLines = structuredPatch.flatMap(patch => patch.lines ?? []);

  return patchLines.some((line) => {
    return line.startsWith('+') && !line.startsWith('+import ');
  });
}

async function execFileAsync(command: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return await new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error !== null) {
        reject(new Error(error.message));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
