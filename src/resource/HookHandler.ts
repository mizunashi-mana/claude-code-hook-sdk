import { type PreCompactHookInput, type UserPromptSubmitHookInput, type NotificationHookInput, type PostToolUseHookInput, type PreToolUseHookInput, type StopHookInput, type SubagentStopHookInput } from '@/resource/HookInput.js';
import { type PreToolUseHookOutput, type PostToolUseHookOutput, type NotificationHookOutput, type SubagentStopHookOutput, type StopHookOutput, type PreCompactHookOutput, type UserPromptSubmitHookOutput } from '@/resource/HookOutput.js';

export type HookHandler = {
  preToolUseHandler?: (input: PreToolUseHookInput) => Promise<PreToolUseHookOutput>;
  postToolUseHandler?: (input: PostToolUseHookInput) => Promise<PostToolUseHookOutput>;
  notificationHandler?: (input: NotificationHookInput) => Promise<NotificationHookOutput>;
  subagentStopHandler?: (input: SubagentStopHookInput) => Promise<SubagentStopHookOutput>;
  stopHandler?: (input: StopHookInput) => Promise<StopHookOutput>;
  userPromptSubmitHandler?: (input: UserPromptSubmitHookInput) => Promise<UserPromptSubmitHookOutput>;
  preCompactHandler?: (input: PreCompactHookInput) => Promise<PreCompactHookOutput>;
};
