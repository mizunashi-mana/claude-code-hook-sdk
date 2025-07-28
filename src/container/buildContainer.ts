import { Container } from 'inversify';
import { Tags } from '@/container/Tags';
import { HookHandlerService } from '@/service/HookHandlerService';
import { type LoggerService, ConsoleLoggerService } from '@/service/LoggerService';

export function buildContainer(): Container {
  const container = new Container();

  container.bind<LoggerService>(Tags.LoggerService).to(ConsoleLoggerService).inSingletonScope();
  container.bind<HookHandlerService>(Tags.HookHandlerService).to(HookHandlerService).inSingletonScope();

  return container;
}
