import { describe, expect, it } from 'vitest';
import { execFileAsync } from '@/api/execFileAsync.js';

describe('execFileAsync', () => {
  it('should execute a command successfully and return stdout', async () => {
    const result = await execFileAsync('echo', ['hello world']);

    expect(result.stdout).toBe('hello world\n');
    expect(result.stderr).toBe('');
  });

  it('should handle commands with multiple arguments', async () => {
    const result = await execFileAsync('echo', ['arg1', 'arg2', 'arg3']);

    expect(result.stdout).toBe('arg1 arg2 arg3\n');
    expect(result.stderr).toBe('');
  });

  it('should capture stderr output', async () => {
    const result = await execFileAsync('sh', ['-c', 'echo "error message" >&2']);

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('error message\n');
  });

  it('should handle both stdout and stderr', async () => {
    const result = await execFileAsync('sh', ['-c', 'echo "stdout message" && echo "stderr message" >&2']);

    expect(result.stdout).toBe('stdout message\n');
    expect(result.stderr).toBe('stderr message\n');
  });

  it('should reject when command fails', async () => {
    await expect(execFileAsync('false', [])).rejects.toThrow();
  });

  it('should reject when command does not exist', async () => {
    await expect(execFileAsync('nonexistent_command_12345', [])).rejects.toThrow();
  });

  it('should handle empty arguments array', async () => {
    const result = await execFileAsync('true', []);

    expect(result.stdout).toBe('');
    expect(result.stderr).toBe('');
  });

  it('should handle special characters in arguments', async () => {
    const specialChars = 'hello "world" $TEST `ls`';
    const result = await execFileAsync('echo', [specialChars]);

    expect(result.stdout).toBe(specialChars + '\n');
    expect(result.stderr).toBe('');
  });

  it('should execute ls command', async () => {
    const result = await execFileAsync('ls', ['-a', '.']);

    expect(result.stdout).toBeTruthy();
    expect(result.stdout).toContain('.');
    expect(result.stdout).toContain('..');
  });

  it('should handle multiline output', async () => {
    const result = await execFileAsync('sh', ['-c', 'echo "line1" && echo "line2" && echo "line3"']);

    expect(result.stdout).toBe('line1\nline2\nline3\n');
    expect(result.stderr).toBe('');
  });

  it('should preserve exit code in error', async () => {
    try {
      await execFileAsync('sh', ['-c', 'exit 42']);
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      if (error instanceof Error) {
        expect(error.message).toContain('42');
      }
    }
  });

  it('should handle large output', async () => {
    const largeString = 'x'.repeat(10000);
    const result = await execFileAsync('echo', [largeString]);

    expect(result.stdout).toBe(largeString + '\n');
    expect(result.stderr).toBe('');
  });
});
