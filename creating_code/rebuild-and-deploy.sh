#!/bin/bash
set -e

# Source environment variables
source .env

echo "🔨 Building Docker image for linux/amd64..."
docker buildx build --platform linux/amd64 -f Dockerfile.api -t ${AZURE_ACR_NAME}.azurecr.io/react-api:latest . --push

echo "✅ Image built and pushed successfully"

echo "🚀 Deploying to Azure Container Apps..."
az containerapp create \
  --name react-builder-api \
  --resource-group $AZURE_RESOURCE_GROUP \
  --environment $AZURE_CONTAINER_APP_ENV \
  --image ${AZURE_ACR_NAME}.azurecr.io/react-api:latest \
  --target-port 3000 \
  --ingress 'external' \
  --min-replicas 1 \
  --max-replicas 3 \
  --registry-server ${AZURE_ACR_NAME}.azurecr.io \
  --registry-username $ACR_USERNAME \
  --registry-password $ACR_PASSWORD \
  --env-vars \
    AZURE_STORAGE_CONNECTION_STRING="$AZURE_STORAGE_CONNECTION_STRING" \
    AZURE_STORAGE_ACCOUNT_NAME="$AZURE_STORAGE_ACCOUNT_NAME" \
    AZURE_ACR_NAME="$AZURE_ACR_NAME" \
    AZURE_CONTAINER_APP_ENV="$AZURE_CONTAINER_APP_ENV" \
    AZURE_RESOURCE_GROUP="$AZURE_RESOURCE_GROUP" \
    ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" \
    DATABASE_URL="$DATABASE_URL" \
    SUPABASE_URL="$SUPABASE_URL" \
    SUPABASE_SERVICE_ROLE_KEY="$SUPABASE_SERVICE_ROLE_KEY"

# Get the API URL
API_URL=$(az containerapp show \
  --name react-builder-api \
  --resource-group $AZURE_RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "✅ API deployed at: https://$API_URL"