export declare function uploadToAzureBlob(connectionString: string, containerName: string, blobName: string, data: Buffer): Promise<string>;
export declare function triggerAzureContainerJob(sourceZipUrl: string, buildId: string, config: {
    resourceGroup: string;
    containerAppEnv: string;
    acrName: string;
    storageConnectionString: string;
    storageAccountName: string;
}): Promise<string>;
export declare function deployToSWA(zipUrl: string, buildId: string): Promise<{
    previewUrl: string;
    downloadUrl: string;
}>;
