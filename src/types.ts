import { Env } from "./env";

export type CommandHandler = (
  positionals: string[],
  values: Record<string, string | boolean | (string | boolean)[] | undefined>,
  env: Env
) => void;
export type Command = {
  command: string;
  describe: string;
  handler: CommandHandler;
};
