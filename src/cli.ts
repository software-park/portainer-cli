import { parseArgs, ParseArgsOptionsConfig } from "node:util";
import * as commandMap from "./commands";
import { Command } from "./types";
import env from "./env";

const options: ParseArgsOptionsConfig = {
  namespace: {
    type: 'string',
    short: 'n',
    default: 'default',
  },
  endpoint: {
    type: 'string',
    short: 'e',
    default: '1',
  },
  help: { type: 'boolean', short: 'h', default: false },
};

const help = `
Usage: portainer [options] <command> [args...]

Options:
  -n, --namespace   Namespace to use (default: default)
  -e, --endpoint    Endpoint ID to use (default: 1)

Environment Variables:
  PORTAINER_URL         Portainer URL (e.g., http://localhost:9000)
  PORTAINER_USERNAME    Portainer username
  PORTAINER_PASSWORD    Portainer password

Commands:
  update-image <deployment-name> <image>  Update deployment image
`


const commands: Command[] = Object.values(commandMap);

const {
  values,
  positionals,
} = parseArgs({ options, allowPositionals: true });

if (values.help || positionals.length === 0) {
  console.log(help);
} else if (env.portainerURL === undefined || env.portainerUsername === undefined || env.portainerPassword === undefined) {
  console.error("Error: PORTAINER_URL, PORTAINER_USERNAME, and PORTAINER_PASSWORD environment variables must be set.");
  console.log(help);
  process.exit(1);
} else {
  const [command, ...others] = positionals;
  const findCommand = commands.find(c => c.command === command);

  if (findCommand) {
    findCommand.handler(others, values, env);
  } else {
    console.log(help);
  }
}