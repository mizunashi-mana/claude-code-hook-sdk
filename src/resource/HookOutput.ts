export const BLOCKING_EXIT_CODE = 2;

export interface BaseHookOutput {
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
}

export interface PreToolUseHookOutput extends BaseHookOutput {
  decision?: 'approve' | 'block';
  reason?: string;
}

export interface PostToolUseHookOutput extends BaseHookOutput {
  decision?: 'block';
  reason?: string;
}

export interface StopHookOutput extends BaseHookOutput {
  decision?: 'block';
  reason?: string;
}

export interface NotificationHookOutput extends BaseHookOutput {
  decision?: undefined;
}

export interface SubagentStopHookOutput extends BaseHookOutput {
  decision?: 'block';
  reason?: string;
}

export type HookOutput
  = | PreToolUseHookOutput
    | PostToolUseHookOutput
    | NotificationHookOutput
    | StopHookOutput
    | SubagentStopHookOutput;
