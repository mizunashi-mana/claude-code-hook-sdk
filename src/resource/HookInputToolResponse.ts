import * as z from 'zod';
import { type ToolResponse } from '@/resource/HookInput.js';

export type StructuredPatch = Array<{
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: string[];
}>;

export const StructuredPatchSchema = z.array(
  z.object({
    oldStart: z.number(),
    oldLines: z.number(),
    newStart: z.number(),
    newLines: z.number(),
    lines: z.array(z.string()),
  }),
);

export function parseStructuredPatch(toolResponse: ToolResponse): StructuredPatch {
  return StructuredPatchSchema.parse(toolResponse.structuredPatch);
}
