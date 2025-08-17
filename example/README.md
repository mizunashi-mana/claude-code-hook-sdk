# Examples

This directory contains example hooks for **@mizunashi_mana/claude-code-hook-sdk**.

## 📋 Available Hooks at a Glance

| Hook Type | Example | Use Case |
|-----------|---------|----------|
| **Monitoring** | `logging-hook.ts` | Track what Claude does |
| **Transformation** | `format-on-post-tool.ts` | Auto-format modified files |
| **Validation** | `reject-jest-and-prefer-vitest.ts` | Block specific tool usage |

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
**Uses:** `postToolUpdateFileHook` utility

Automatically formats code after Claude makes changes, ensuring consistent code style.

**What it does:**
- Runs after file modifications (Write, Edit, MultiEdit tools)
- Checks if files need to be staged in git
- Executes pre-commit hooks on modified files
- Uses the `postToolUpdateFileHook` helper for structured file change handling

**Key features:**
- Access to file path, added lines, and deleted lines
- Skips formatting for import-only changes
- Automatically stages untracked files for git

**Perfect for:**
- Teams with strict formatting standards
- Projects using pre-commit hooks
- Maintaining clean git diffs

---

### 3. `reject-jest-and-prefer-vitest.ts` 🚫
**Type:** Validation Hook  
**Uses:** `preToolRejectHook` utility

Prevents the use of Jest testing framework and suggests using Vitest instead.

**What it does:**
- Intercepts Bash commands before execution
- Uses regex patterns to detect jest usage
- Blocks the command with a helpful message
- Leverages the `preToolRejectHook` helper for easy configuration

**Configuration options:**
- **regex patterns**: Match commands by regular expression
- **function handlers**: Custom logic for complex matching
- **custom messages**: Provide helpful alternatives

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
           "matcher": "*",
           "hooks": [
             {
               "type": "command",
               "command": "npx tsx reject-jest-and-prefer-vitest.ts"
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
               "command": "npx tsx format-on-post-tool.ts"
             }
           ]
         }
       ]
     }
   }
   ```
4. **Customize** the hook for your specific requirements

💡 **See a real example:** Check out this project's [.claude/settings.json](../.claude/settings.json) to see how we use these hooks!

## 🛠️ Advanced Hook Utilities

This SDK provides powerful utilities to simplify hook creation:

### `preToolRejectHook`
A utility for creating hooks that validate and potentially block tool usage:
- Configure regex patterns or custom functions
- Provide helpful alternative suggestions
- Particularly useful for Bash command validation

### `postToolUpdateFileHook`
A utility for processing file changes after modifications:
- Access structured information about file changes
- Get lists of added and deleted lines
- Perfect for running formatters, linters, or other processors

### `execFileAsync`
A promisified version of Node.js's `execFile`:
- Run external commands safely
- Capture stdout and stderr
- Use in combination with other utilities

## 📖 Learn More

- 📚 [Official Claude Code Hooks Documentation](https://docs.anthropic.com/en/docs/claude-code/hooks)
- 🔧 [Main Project Documentation](../README.md)
