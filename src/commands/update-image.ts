import { PortainerClient } from "../lib/client";
import { PortainerKubernetesClient } from "../lib/kubernetes-client";
import { Command } from "../types";

export default {
  command: 'update-image',
  describe: 'Update deployment image',
  handler: async (positionals, values, env) => {
    const client = new PortainerKubernetesClient(
      new PortainerClient({
        url: env.portainerURL as string,
        username: env.portainerUsername,
        password: env.portainerPassword,
      })
    );
    const [deploymentName, imageName] = positionals;

    client.updateDeploymentImage({
      endpointId: parseInt(values.endpoint as string, 10),
      namespace: values.namespace as string,
      deploymentName,
      imageName,
    })
  }
} satisfies Command