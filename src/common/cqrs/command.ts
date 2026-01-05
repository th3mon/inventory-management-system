export type Command = { type: string };
// TODO: Try to fix problem with any
// biome-ignore lint: suspicious/noExplicitAny
export type CommandResult = any;

export interface CommandHandler<
  C extends Command = Command,
  R extends CommandResult = CommandResult,
> {
  type: C["type"];
  execute(command: C): Promise<R>;
}
