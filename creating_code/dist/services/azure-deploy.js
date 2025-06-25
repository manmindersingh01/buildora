"use strict";
// This file contains helper functions for Azure deployment
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToAzureBlob = uploadToAzureBlob;
exports.triggerAzureContainerJob = triggerAzureContainerJob;
const storage_blob_1 = require("@azure/storage-blob");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
// Upload files to Azure Blob Storage
function uploadToAzureBlob(connectionString, containerName, blobName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const blobServiceClient = storage_blob_1.BlobServiceClient.fromConnectionString(connectionString);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        yield blockBlobClient.upload(data, data.length);
        return blockBlobClient.url;
    });
}
// Trigger Azure Container App Job to build the project
function triggerAzureContainerJob(sourceZipUrl, buildId, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const jobName = `build-${buildId.substring(0, 8)}`;
        // Create job with SWA deployment
        yield execPromise(`az containerapp job create \
    --name ${jobName} \
    --resource-group ${config.resourceGroup} \
    --environment ${config.containerAppEnv} \
    --image ${config.acrName}.azurecr.io/react-builder-swa:v2 \
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
        // Start and monitor job (same as before)
        yield execPromise(`az containerapp job start --name ${jobName} --resource-group ${config.resourceGroup}`);
        // Poll for completion
        let attempts = 0;
        while (attempts < 60) {
            yield new Promise((resolve) => setTimeout(resolve, 10000));
            const { stdout } = yield execPromise(`az containerapp job execution list --name ${jobName} --resource-group ${config.resourceGroup} --query "[0].properties.status" -o tsv`);
            const status = stdout.trim();
            console.log(`Job status: ${status}`);
            if (status === "Succeeded") {
                yield execPromise(`az containerapp job delete --name ${jobName} --resource-group ${config.resourceGroup} --yes`);
                // Return SWA URLs
                const envName = `build-${buildId.substring(0, 8)}`;
                const previewUrl = `https://${envName}--${process.env.AZURE_SWA_DEFAULT_HOSTNAME}`;
                const downloadUrl = `https://${config.storageAccountName}.blob.core.windows.net/build-outputs/${buildId}/build_${buildId}.zip`;
                return JSON.stringify({
                    previewUrl,
                    downloadUrl,
                });
            }
            else if (status === "Failed") {
                throw new Error("Container job failed");
            }
            attempts++;
        }
        throw new Error("Job execution timeout");
    });
}
// Helper function to fetch deployment info
function fetchDeploymentInfo(storageAccountName, buildId) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://${storageAccountName}.blob.core.windows.net/build-outputs/${buildId}/deployment-info.json`;
        const response = yield fetch(url);
        if (!response.ok) {
            // Fallback URLs if deployment info not found
            return {
                previewUrl: `https://${process.env.AZURE_SWA_DEFAULT_HOSTNAME}`,
                downloadUrl: `https://${storageAccountName}.blob.core.windows.net/build-outputs/${buildId}/build_${buildId}.zip`,
            };
        }
        return response.json();
    });
}
//# sourceMappingURL=azure-deploy.js.map