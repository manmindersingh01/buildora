// This file contains helper functions for Azure deployment

import { BlobServiceClient } from "@azure/storage-blob";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

// Upload files to Azure Blob Storage
export async function uploadToAzureBlob(
  connectionString: string,
  containerName: string,
  blobName: string,
  data: Buffer
): Promise<string> {
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(data, data.length);
  return blockBlobClient.url;
}

// Trigger Azure Container App Job to build the project
export async function triggerAzureContainerJob(
  sourceZipUrl: string,
  buildId: string,
  config: {
    resourceGroup: string;
    containerAppEnv: string;
    acrName: string;
    storageConnectionString: string;
    storageAccountName: string;
  }
): Promise<string> {
  const jobName = `build-${buildId.substring(0, 8)}`;
  const imageTag = process.env.DOCKER_IMAGE_TAG || "latest";

  // Create a one-time job with SWA deployment token
  await execPromise(`az containerapp job create \
    --name ${jobName} \
    --resource-group ${config.resourceGroup} \
    --environment ${config.containerAppEnv} \
 --image ${config.acrName}.azurecr.io/react-builder:${imageTag} \
    --cpu 2.0 --memory 4.0Gi \
    --trigger-type Manual \
    --registry-server ${config.acrName}.azurecr.io \
    --registry-username ${process.env.ACR_USERNAME} \
    --registry-password ${process.env.ACR_PASSWORD} \
    --env-vars \
      SOURCE_ZIP_URL="${sourceZipUrl}" \
      BUILD_ID="${buildId}" \
      STORAGE_CONNECTION_STRING="${config.storageConnectionString}" \
      STORAGE_ACCOUNT_NAME="${config.storageAccountName}" \
      SWA_DEPLOYMENT_TOKEN="${process.env.AZURE_SWA_DEPLOYMENT_TOKEN}" \
      SWA_DEFAULT_HOSTNAME="${process.env.AZURE_SWA_DEFAULT_HOSTNAME}" \
    --replica-timeout 1800 \
    --parallelism 1 \
    --replica-completion-count 1 \
    --replica-retry-limit 0`);

  // Start the job
  await execPromise(
    `az containerapp job start --name ${jobName} --resource-group ${config.resourceGroup}`
  );

  // Poll for completion
  let attempts = 0;
  while (attempts < 60) {
    await new Promise((resolve) => setTimeout(resolve, 10000));

    const { stdout } = await execPromise(
      `az containerapp job execution list --name ${jobName} --resource-group ${config.resourceGroup} --query "[0].properties.status" -o tsv`
    );

    const status = stdout.trim();
    console.log(`Job status: ${status}`);

    if (status === "Succeeded") {
      // Clean up the job
      await execPromise(
        `az containerapp job delete --name ${jobName} --resource-group ${config.resourceGroup} --yes`
      );

      // Fetch deployment info from blob storage
      const deploymentInfo = await fetchDeploymentInfo(
        config.storageAccountName,
        buildId
      );

      return JSON.stringify({
        previewUrl: `https://reactstore0796.z13.web.core.windows.net/${buildId}/`,
        downloadUrl: `https://reactstore0796.blob.core.windows.net/build-outputs/${buildId}/build_${buildId}.zip`,
      });
    } else if (status === "Failed") {
      throw new Error("Container job failed");
    }

    attempts++;
  }

  throw new Error("Job execution timeout");
}

// Helper function to fetch deployment info
async function fetchDeploymentInfo(
  storageAccountName: string,
  buildId: string
): Promise<any> {
  const url = `https://${storageAccountName}.blob.core.windows.net/build-outputs/${buildId}/deployment-info.json`;
  const response = await fetch(url);
  if (!response.ok) {
    // Fallback URLs if deployment info not found
    return {
      previewUrl: `https://${process.env.AZURE_SWA_DEFAULT_HOSTNAME}`,
      downloadUrl: `https://${storageAccountName}.blob.core.windows.net/build-outputs/${buildId}/build_${buildId}.zip`,
    };
  }
  return response.json();
}
