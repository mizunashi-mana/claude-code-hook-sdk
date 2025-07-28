# Examples

This directory contains example hooks for **@mizunashi_mana/claude-code-hook-sdk**.

## 📋 Available Hooks at a Glance

| Hook Type | Example | Use Case |
|-----------|---------|----------|
| **Monitoring** | `logging-hook.ts` | Track what Claude does |
| **Transformation** | `format-on-post-tool.ts` | Modify Claude's output |
| **Validation** | `reject-jest-and-prefer-vitest.ts` | Prevent unwanted actions |

## 📚 What are Hooks?

Hooks are custom scripts that run at specific points during Claude Code's execution. They allow you to:
- 🛡️ Validate and reject certain actions
- 📝 Log and monitor Claude's activities
- 🔧 Transform or format code automatically
- ⚡ Enforce project-specific rules and standards

## 🎨 Detailed Examples

### 1. `logging-hook.ts` 📊
**Type:** Monitoring Hook

A simple hook that logs all Claude Code activities to help you understand what actions are being performed.

**What it does:**
- Logs every tool call (file reads, writes, edits, etc.)
- Records timestamps and parameters
- Helps debug and audit Claude's actions

**Perfect for:**
- Understanding Claude's workflow
- Debugging integration issues
- Creating audit trails

---

### 2. `format-on-post-tool.ts` ✨
**Type:** Post-processing Hook

Automatically formats code after Claude makes changes, ensuring consistent code style.

**What it does:**
- Runs after file modifications
- Applies your project's formatting rules
- Maintains code consistency

**Perfect for:**
- Teams with strict formatting standards
- Projects using tools like Prettier, ESLint, etc.
- Maintaining clean git diffs

---

### 3. `reject-jest-and-prefer-vitest.ts` 🚫
**Type:** Validation Hook

Prevents the use of Jest testing framework and suggests using Vitest instead.

**What it does:**
- Intercepts file writes and edits
- Checks for Jest-related imports or configurations
- Blocks the action and suggests Vitest alternatives

**Perfect for:**
- Enforcing technology choices
- Migrating from one tool to another
- Preventing accidental usage of deprecated tools

## 🚀 Quick Start

1. **Choose a hook** that fits your needs
2. **Copy it** to your project
3. **Configure Claude Code** to use the hook in `.claude/settings.json`:
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Bash",
           "hooks": [
             {
               "type": "command",
               "command": "npm run reject-jest-and-prefer-vitest"
             }
           ]
         }
       ],
       "PostToolUse": [
         {
           "matcher": "Write|Edit|MultiEdit",
           "hooks": [
             {
               "type": "command",
               "command": "npm run format-on-post-tool"
             }
           ]
         }
       ]
     }
   }
   ```
4. **Customize** the hook for your specific requirements

💡 **See a real example:** Check out this project's [.claude/settings.json](../.claude/settings.json) to see how we use these hooks!

## 📖 Learn More

- 📚 [Official Claude Code Hooks Documentation](https://docs.anthropic.com/en/docs/claude-code/hooks)
- 🔧 [Main Project Documentation](../README.md)
