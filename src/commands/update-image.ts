import { PortainerClient } from "../lib/client";
import { PortainerKubernetesClient } from "../lib/kubernetes-client";
import { Command } from "../types";

export default {
  command: "update-image",
  description: "update-image <deployment-name> <image>  Update deployment image",
  validator: (positionals) => positionals.length === 2,
  handler: async (positionals, values, env) => {
    const client = new PortainerKubernetesClient(
      new PortainerClient({
        url: env.portainerURL as string,
        username: env.portainerUsername,
        password: env.portainerPassword,
      })
    );
    const [deploymentName, imageName] = positionals;

    await client.updateDeploymentImage({
      endpointId: parseInt(values.endpoint, 10),
      namespace: values.namespace,
      deploymentName,
      imageName,
    });
  },
} satisfies Command;
