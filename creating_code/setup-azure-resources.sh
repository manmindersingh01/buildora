#!/bin/bash

# This script creates all Azure resources needed for the project

# Set variables
RESOURCE_GROUP="react-builder-rg"
LOCATION="eastus"
UNIQUE_ID=$(date +%s | tail -c 5)
ACR_NAME="reactacr${UNIQUE_ID}"
STORAGE_ACCOUNT="reactstore${UNIQUE_ID}"
CONTAINER_APP_ENV="react-env-${UNIQUE_ID}"

echo "🚀 Creating Azure resources..."

# Create resource group
az group create --name $RESOURCE_GROUP --location $LOCATION

# Create Azure Container Registry (for storing Docker images)
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic \
  --admin-enabled true

# Create Storage Account (for storing zips and static websites)
az storage account create \
  --name $STORAGE_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --allow-blob-public-access true

# Enable static website hosting
az storage blob service-properties update \
  --account-name $STORAGE_ACCOUNT \
  --static-website \
  --index-document index.html

# Create container for source zip
az storage container create \
  --name "source-zips" \
  --account-name $STORAGE_ACCOUNT \
  --public-access blob

# Create container for build outputs
az storage container create \
  --name "build-outputs" \
  --account-name $STORAGE_ACCOUNT \
  --public-access blob

# Create Container Apps Environment
az containerapp env create \
  --name $CONTAINER_APP_ENV \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION

# Get all configuration values
AZURE_STORAGE_CONNECTION_STRING=$(az storage account show-connection-string -n $STORAGE_ACCOUNT -g $RESOURCE_GROUP --query connectionString -o tsv)
AZURE_SUBSCRIPTION_ID=$(az account show --query id -o tsv)
ACR_USERNAME=$(az acr credential show --name $ACR_NAME --query username -o tsv)
ACR_PASSWORD=$(az acr credential show --name $ACR_NAME --query 'passwords[0].value' -o tsv)




echo "🌐 Creating Azure Static Web App..."
az staticwebapp create \
  --name "react-builder-swa-${UNIQUE_ID}" \
  --resource-group $RESOURCE_GROUP \
  --location "centralus" \
  --sku Standard

# Get the deployment token
SWA_DEPLOYMENT_TOKEN=$(az staticwebapp secrets list \
  --name "react-builder-swa-${UNIQUE_ID}" \
  --resource-group $RESOURCE_GROUP \
  --query "properties.apiKey" -o tsv)

# Get the default hostname
SWA_DEFAULT_HOSTNAME=$(az staticwebapp show \
  --name "react-builder-swa-${UNIQUE_ID}" \
  --resource-group $RESOURCE_GROUP \
  --query "defaultHostname" -o tsv)


# Create .env file
cat > .env << EOF
# Azure Configuration
AZURE_STORAGE_CONNECTION_STRING="$AZURE_STORAGE_CONNECTION_STRING"
AZURE_STORAGE_ACCOUNT_NAME="$STORAGE_ACCOUNT"
AZURE_ACR_NAME="$ACR_NAME"
AZURE_CONTAINER_APP_ENV="$CONTAINER_APP_ENV"
AZURE_RESOURCE_GROUP="$RESOURCE_GROUP"
AZURE_SUBSCRIPTION_ID="$AZURE_SUBSCRIPTION_ID"
ACR_USERNAME="$ACR_USERNAME"
ACR_PASSWORD="$ACR_PASSWORD"

# Add your existing environment variables
DATABASE_URL=""
ANTHROPIC_API_KEY=""
SUPABASE_URL=""
SUPABASE_SERVICE_ROLE_KEY=""
EOF

# Static Web App Configuration
AZURE_SWA_NAME="react-builder-swa-${UNIQUE_ID}"
AZURE_SWA_DEPLOYMENT_TOKEN="$SWA_DEPLOYMENT_TOKEN"
AZURE_SWA_DEFAULT_HOSTNAME="$SWA_DEFAULT_HOSTNAME"
EOF

echo "✅ Static Web App created!"
echo "🌐 Default URL: https://$SWA_DEFAULT_HOSTNAME"

echo "✅ Resources created!"
echo "📝 Please edit .env file to add your API keys"
echo "ACR Name: $ACR_NAME"
echo "Storage Account: $STORAGE_ACCOUNT"