import { Command, CommandHandler } from "./command";

export class CommandBus {
  private handlers = new Map<string, CommandHandler<any, any>>();

  register(handler: CommandHandler<any, any>) {
    this.handlers.set(handler.type, handler);
  }

  async execute<C extends Command, R>(command: C): Promise<R> {
    const handler = this.handlers.get(command.type);

    if (!handler) {
      throw new Error(`No command handler for: ${command.type}`);
    }

    return handler.execute(command);
  }
}
