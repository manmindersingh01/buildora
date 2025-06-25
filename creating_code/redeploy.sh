#!/bin/bash
source .env
docker buildx build --platform linux/amd64 -f Dockerfile.api -t ${AZURE_ACR_NAME}.azurecr.io/react-api:latest . --push
az containerapp update \
  --name react-builder-api \
  --resource-group $AZURE_RESOURCE_GROUP \
  --image ${AZURE_ACR_NAME}.azurecr.io/react-api:latest