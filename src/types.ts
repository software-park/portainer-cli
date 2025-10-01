import { Env } from "./env";

export type CommandValues = {
  endpoint: string;
  namespace: string;
};
export type CommandHandler = (
  positionals: string[],
  values: CommandValues,
  env: Env
) => void;
export type Command = {
  command: string;
  description: string;
  validator?: (positionals: string[]) => boolean;
  handler: CommandHandler;
};
