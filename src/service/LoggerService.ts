import { injectable } from 'inversify';

export interface LoggerService {
  error: (messageOrError: string | Error) => void;
  debug: (object: unknown) => void;
}

@injectable()
export class ConsoleLoggerService implements LoggerService {
  error(messageOrError: string | Error): void {
    // eslint-disable-next-line no-console -- Allowed console in ConsoleLoggerService
    console.error(messageOrError);
  }

  debug(_object: unknown): void {
    // Trash debug messages
  }
}
