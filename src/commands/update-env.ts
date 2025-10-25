import { PortainerClient } from "../lib/client";
import { PortainerKubernetesClient } from "../lib/kubernetes-client";
import { Command } from "../types";

export default {
  command: "update-env",
  description: "update-env <stack-id> <key>=<name>  Update stack environment variable",
  validator: (positionals) => positionals.length === 2,
  handler: async (positionals, values, env) => {
    const client = new PortainerClient({
      url: env.portainerURL as string,
      username: env.portainerUsername,
      password: env.portainerPassword,
    });

    const [stackId, keyValue] = positionals;
    const [key, name] = keyValue.split("=");

    const stackInfo = await client.callAPIWithKey("GET", `/api/stacks/${stackId}`);

    if (stackInfo.Type !== 2) {
      throw new Error("This command only supports docker compose stacks (Type 2)");
    }


    const stackEnvs: { "name": string, "value": string }[] = stackInfo.Env || [];
    const stackFile = await client.callAPIWithKey(
      "GET",
      `/api/stacks/${stackId}/file`
    );
    const stackFileContent = stackFile.StackFileContent;

    if (!stackEnvs.find((stackEnv) => stackEnv.name === key)) {
      throw new Error(`Environment variable with key "${key}" not found in stack ${stackId}`);
    }

    const response = await client.callAPIWithKey(
      "PUT",
      `/api/stacks/${stackId}?endpointId=${stackInfo.EndpointId}`,
      {
        "id": 18,
        "StackFileContent": stackFileContent,
        "Env": stackEnvs.map((stackEnv) => {
          if (stackEnv.name === key) {
            return {
              "name": key,
              "value": name,
            };
          }

          return stackEnv;
        }),
        "Prune": false,
        "PullImage": false
      }
    );

    console.log(`Updated environment variable "${key}" to "${name}" in stack ${stackId}`);
    console.log("Response:", JSON.stringify(response, null, 2));
  },
} satisfies Command;
