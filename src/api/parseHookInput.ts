import * as z from 'zod';
import { type HookInput, HookInputSchema } from '@/resource/HookInput';

export type ParseResult = {
  type: 'success';
  data: HookInput;
} | {
  type: 'error';
  message: string;
};

export function parseHookInput(input: string): ParseResult {
  let inputJson: unknown;
  try {
    inputJson = JSON.parse(input);
  } catch (_error) {
    return {
      type: 'error',
      message: 'JSON parsing error: Invalid JSON format',
    };
  }

  let validInput: HookInput;
  try {
    validInput = HookInputSchema.parse(inputJson);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        type: 'error',
        message: `Invalid JSON schema: ${error.errors[0]?.message}`,
      };
    }

    throw error;
  }

  return {
    type: 'success',
    data: validInput,
  };
}
