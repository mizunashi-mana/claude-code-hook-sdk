import { type PostToolUseHookInput } from '@/resource/HookInput.js';
import { parseStructuredPatch } from '@/resource/HookInputToolResponse.js';
import { type PostToolUseHookOutput } from '@/resource/HookOutput.js';

export type PostToolUpdateFileHookInput = {
  rawInput: PostToolUseHookInput;
  type: 'create' | 'update';
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

    const filePath = input.tool_response.filePath;
    if (typeof filePath !== 'string') {
      console.error('Expected filePath to be a string.');
      return {};
    }

    const { type, linesAddition, linesDeletion } = extractLines(input);

    return await handler({
      rawInput: input,
      type,
      filePath,
      linesAddition,
      linesDeletion,
    });
  };
}

function extractLines(input: PostToolUseHookInput): {
  type: 'create' | 'update';
  linesAddition: string[];
  linesDeletion: string[];
} {
  const content = typeof input.tool_response.content === 'string' ? input.tool_response.content : '';

  if (input.tool_response.type === 'create') {
    return {
      type: 'create',
      linesAddition: content === '' ? [] : content.split(/\r?\n/),
      linesDeletion: [],
    };
  }

  const structuredPatch = parseStructuredPatch(input.tool_response);

  const lines = structuredPatch.flatMap(patch => patch.lines);
  const linesAddition = lines.filter(line => line.startsWith('+')).map(line => line.slice(1));
  const linesDeletion = lines.filter(line => line.startsWith('-')).map(line => line.slice(1));

  return {
    type: 'update',
    linesAddition,
    linesDeletion,
  };
}
