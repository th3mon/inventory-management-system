import type { Command, CommandHandler } from "./command";

export class CommandBus {
  private handlers = new Map<string, CommandHandler>();

  register<C extends Command, R>(handler: CommandHandler<C, R>) {
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
