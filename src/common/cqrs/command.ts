export type Command = { type: string };

export interface CommandHandler<C extends Command> {
  type: C["type"];
  execute(command: C): Promise<void>;
}
