import { type PostToolUseHookInput } from '@/resource/HookInput.js';
import { parseStructuredPatch } from '@/resource/HookInputToolResponse.js';
import { type StructuredPatch } from '@/resource/HookInputToolResponse.js';
import { type PostToolUseHookOutput } from '@/resource/HookOutput.js';

export type PostToolUpdateFileHookInput = {
  rawInput: PostToolUseHookInput;
  structuredPatch: StructuredPatch;
  filePath: string;
  linesAddition: string[];
  linesDeletion: string[];
};

export function postToolUpdateFileHook(handler: (input: PostToolUpdateFileHookInput) => Promise<PostToolUseHookOutput>): (input: PostToolUseHookInput) => Promise<PostToolUseHookOutput> {
  return async (input) => {
    if (!['Write', 'Update', 'Edit', 'MultiEdit'].includes(input.tool_name)) {
      console.error(`Unexpected tool name: ${input.tool_name}`);
      return {};
    }

    const structuredPatch = parseStructuredPatch(input.tool_response);

    const filePath = input.tool_response.filePath;
    if (typeof filePath !== 'string') {
      console.error('Expected filePath to be a string.');
      return {};
    }

    const lines = structuredPatch.flatMap(patch => patch.lines);
    const linesAddition = lines.filter(line => line.startsWith('+')).map(line => line.slice(2));
    const linesDeletion = lines.filter(line => line.startsWith('-')).map(line => line.slice(2));

    return await handler({
      rawInput: input,
      structuredPatch,
      filePath,
      linesAddition,
      linesDeletion,
    });
  };
}
