import * as z from 'zod';

export interface BaseHookInput {
  session_id: string;
  transcript_path: string;
  hook_event_name: string;
}

const BaseHookInputSchema = z.object({
  session_id: z.string(),
  transcript_path: z.string(),
  hook_event_name: z.string(),
});

export type ToolInput = Record<string, unknown>;

export type ToolResponse = Record<string, unknown>;

export interface PreToolUseHookInput extends BaseHookInput {
  hook_event_name: 'PreToolUse';
  tool_name: string;
  tool_input: ToolInput;
}

export const PreToolUseHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal('PreToolUse'),
  tool_name: z.string(),
  tool_input: z.record(z.string(), z.unknown()),
});

export interface PostToolUseHookInput extends BaseHookInput {
  hook_event_name: 'PostToolUse';
  tool_name: string;
  tool_input: ToolInput;
  tool_response: ToolResponse;
}

export const PostToolUseHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal('PostToolUse'),
  tool_name: z.string(),
  tool_input: z.record(z.string(), z.unknown()),
  tool_response: z.record(z.string(), z.unknown()),
});

export interface NotificationHookInput extends BaseHookInput {
  hook_event_name: 'Notification';
  message: string;
}

export const NotificationHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal('Notification'),
  message: z.string(),
});

export interface StopHookInput extends BaseHookInput {
  hook_event_name: 'Stop';
  stop_hook_active: boolean;
}

export const StopHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal('Stop'),
  stop_hook_active: z.boolean(),
});

export interface SubagentStopHookInput extends BaseHookInput {
  hook_event_name: 'SubagentStop';
  stop_hook_active: boolean;
}

export const SubagentStopHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal('SubagentStop'),
  stop_hook_active: z.boolean(),
});

export interface UserPromptSubmitHookInput extends BaseHookInput {
  hook_event_name: 'UserPromptSubmit';
  prompt: string;
}

export const UserPromptSubmitHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal('UserPromptSubmit'),
  prompt: z.string(),
});

export interface PreCompactHookInput extends BaseHookInput {
  hook_event_name: 'PreCompact';
  trigger: string;
  custom_instructions: string;
}

export const PreCompactHookInputSchema = BaseHookInputSchema.extend({
  hook_event_name: z.literal('PreCompact'),
  trigger: z.string(),
  custom_instructions: z.string(),
});

export const HookInputSchema = z.discriminatedUnion('hook_event_name', [
  PreToolUseHookInputSchema,
  PostToolUseHookInputSchema,
  NotificationHookInputSchema,
  StopHookInputSchema,
  SubagentStopHookInputSchema,
  UserPromptSubmitHookInputSchema,
  PreCompactHookInputSchema,
]);

export type HookInputMap = {
  PreToolUse: PreToolUseHookInput;
  PostToolUse: PostToolUseHookInput;
  Notification: NotificationHookInput;
  Stop: StopHookInput;
  SubagentStop: SubagentStopHookInput;
  UserPromptSubmit: UserPromptSubmitHookInput;
  PreCompact: PreCompactHookInput;
};

export type HookInput = HookInputMap[keyof HookInputMap];

export function isKnownHookInput<HookEventName extends keyof HookInputMap>(input: HookInput, hookEventName: HookEventName): input is HookInputMap[HookEventName] {
  return input.hook_event_name === hookEventName;
}
