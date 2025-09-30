import PortainerClient from "../lib/client";

export class PortainerKubernetesClient {
  constructor(private client: PortainerClient) { }

  async updateDeploymentImage(
    {
      imageName,
      endpointId = 1,
      namespace = "default",
      deploymentName,
    }: {
      endpointId?: number;
      namespace?: string;
      deploymentName: string;
      imageName: string;
    }
  ) {
    const response = await this.client.callAPIWithKey(
      "PATCH",
      `/api/endpoints/${endpointId}/kubernetes/apis/apps/v1/namespaces/${namespace}/deployments/${deploymentName}`,
      [
        {
          op: "replace",
          path: "/spec/template/spec/containers/0/image",
          value: imageName,
        },
      ],
      {
        "Content-Type": "application/json-patch+json",
      },
    );

    console.log(`Deployment response:`, response);
  }
}
