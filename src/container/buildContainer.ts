import { Container } from 'inversify';
import { Tags } from '@/container/Tags.js';
import { HookHandlerService } from '@/service/HookHandlerService.js';
import { type LoggerService, ConsoleLoggerService } from '@/service/LoggerService.js';

export function buildContainer(): Container {
  const container = new Container();

  container.bind<LoggerService>(Tags.LoggerService).to(ConsoleLoggerService).inSingletonScope();
  container.bind<HookHandlerService>(Tags.HookHandlerService).to(HookHandlerService).inSingletonScope();

  return container;
}
