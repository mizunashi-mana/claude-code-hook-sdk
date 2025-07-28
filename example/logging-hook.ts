import fs from 'node:fs/promises';
import path from 'node:path';
import { runHook } from '@mizunashi-mana/claude-code-hook-sdk';

const LOG_FILE = path.resolve(__dirname, '../claude-hook.log');

void runHook({
  preToolUseHandler: async (input) => {
    await fs.appendFile(LOG_FILE, `${JSON.stringify(input)}\n`);
    return {};
  },
  postToolUseHandler: async (input) => {
    await fs.appendFile(LOG_FILE, `${JSON.stringify(input)}\n`);
    return {};
  },
  notificationHandler: async (input) => {
    await fs.appendFile(LOG_FILE, `${JSON.stringify(input)}\n`);
    return {};
  },
  stopHandler: async (input) => {
    await fs.appendFile(LOG_FILE, `${JSON.stringify(input)}\n`);
    return {};
  },
  subagentStopHandler: async (input) => {
    await fs.appendFile(LOG_FILE, `${JSON.stringify(input)}\n`);
    return {};
  },
  userPromptSubmitHandler: async (input) => {
    await fs.appendFile(LOG_FILE, `${JSON.stringify(input)}\n`);
    return {};
  },
  preCompactHandler: async (input) => {
    await fs.appendFile(LOG_FILE, `${JSON.stringify(input)}\n`);
    return {};
  },
});
