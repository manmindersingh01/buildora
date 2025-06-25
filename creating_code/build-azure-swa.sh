#!/bin/bash
set -e

echo "🚀 Starting Azure SWA build process..."
echo "📥 Downloading source from: $SOURCE_ZIP_URL"

# Download and extract the source code
wget -O source.zip "$SOURCE_ZIP_URL"
unzip source.zip -d ./temp

# Handle nested folders from zip
if [ $(ls ./temp | wc -l) -eq 1 ] && [ -d "./temp/$(ls ./temp)" ]; then
  mv ./temp/$(ls ./temp)/* ./
else
  mv ./temp/* ./
fi
rm -rf ./temp source.zip

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npx vite build --base="./"

# Find build output folder
if [ -d "./dist" ]; then
  BUILD_DIR="./dist"
elif [ -d "./build" ]; then
  BUILD_DIR="./build"
else
  echo "❌ No build output found"
  exit 1
fi

# Create deployment name (environments in SWA)
DEPLOYMENT_NAME="build-${BUILD_ID:0:8}"

# Deploy to Static Web Apps with unique environment
echo "🌐 Deploying to Azure Static Web Apps..."
echo "📍 Environment: $DEPLOYMENT_NAME"

# Deploy using SWA CLI
swa deploy \
  --app-location "$BUILD_DIR" \
  --deployment-token "$SWA_DEPLOYMENT_TOKEN" \
  --env "$DEPLOYMENT_NAME" \
  --no-use-keychain

# Get the preview URL
PREVIEW_URL="https://${SWA_DEFAULT_HOSTNAME}"
if [ "$DEPLOYMENT_NAME" != "production" ]; then
  # Non-production environments get a unique URL
  PREVIEW_URL="https://${DEPLOYMENT_NAME}--${SWA_DEFAULT_HOSTNAME}"
fi

echo "✅ Deployed to: $PREVIEW_URL"

# Also create and upload ZIP for download
ZIP_NAME="build_${BUILD_ID}.zip"
echo "📦 Creating ZIP for download..."
cd "$BUILD_DIR" && zip -r "../$ZIP_NAME" . && cd ..

# Upload ZIP to blob storage
echo "☁️ Uploading ZIP to Azure Blob Storage..."
az storage blob upload \
  --file "$ZIP_NAME" \
  --container-name "build-outputs" \
  --name "${BUILD_ID}/${ZIP_NAME}" \
  --connection-string "$STORAGE_CONNECTION_STRING" \
  --overwrite

# Save deployment info
echo "{\"previewUrl\":\"$PREVIEW_URL\",\"downloadUrl\":\"https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/build-outputs/${BUILD_ID}/${ZIP_NAME}\"}" > deployment-info.json

# Upload deployment info
az storage blob upload \
  --file "deployment-info.json" \
  --container-name "build-outputs" \
  --name "${BUILD_ID}/deployment-info.json" \
  --connection-string "$STORAGE_CONNECTION_STRING" \
  --overwrite

echo "🎉 Build and deployment completed!"