#!/bin/bash
set -e

echo "🚀 Starting Azure SWA build process..."
echo "📋 Build ID: $BUILD_ID"
echo "📥 Downloading source from: $SOURCE_ZIP_URL"

# Download and extract the source code
wget -O source.zip "$SOURCE_ZIP_URL"
unzip -q source.zip -d ./temp

# Handle nested folders from zip
if [ $(ls ./temp | wc -l) -eq 1 ] && [ -d "./temp/$(ls ./temp)" ]; then
  mv ./temp/$(ls ./temp)/* ./
  mv ./temp/$(ls ./temp)/.* ./ 2>/dev/null || true
else
  mv ./temp/* ./
  mv ./temp/.* ./ 2>/dev/null || true
fi
rm -rf ./temp source.zip

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project with RELATIVE paths (important!)
echo "🔨 Building project with relative paths..."
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

echo "✅ Build output found in: $BUILD_DIR"

# Create staticwebapp.config.json for SWA configuration
cat > "$BUILD_DIR/staticwebapp.config.json" << EOF
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/assets/*", "/*.{css,js,ico,png,jpg,jpeg,gif,svg,json}"]
  },
  "mimeTypes": {
    ".json": "application/json",
    ".js": "application/javascript",
    ".mjs": "application/javascript"
  }
}
EOF

# Create unique environment name
DEPLOYMENT_NAME="build-${BUILD_ID:0:8}"

# Deploy to Static Web Apps
echo "🌐 Deploying to Azure Static Web Apps..."
echo "📍 Environment: $DEPLOYMENT_NAME"

# Deploy using SWA CLI - IMPORTANT: use app-location as build directory
swa deploy \
  --app-location "$BUILD_DIR" \
  --deployment-token "$SWA_DEPLOYMENT_TOKEN" \
  --env "$DEPLOYMENT_NAME" \
  --no-use-keychain \
  --verbose

# Get the preview URL
PREVIEW_URL="https://${DEPLOYMENT_NAME}--${SWA_DEFAULT_HOSTNAME}"

echo "✅ Deployed to: $PREVIEW_URL"

# Create ZIP for download
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

echo "🎉 Build and deployment completed!"
echo "🌐 Preview URL: $PREVIEW_URL"
echo "📥 Download URL: https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/build-outputs/${BUILD_ID}/${ZIP_NAME}"