import { execFile } from 'node:child_process';

export async function execFileAsync(command: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
  return await new Promise((resolve, reject) => {
    execFile(command, args, (error, stdout, stderr) => {
      if (error !== null) {
        reject(new Error(error.message));
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}
