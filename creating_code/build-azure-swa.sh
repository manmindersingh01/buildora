#!/bin/bash
set -e

echo "🚀 Starting Azure SWA build process..."
echo "📋 Build ID: $BUILD_ID"
echo "📥 Downloading source from: $SOURCE_ZIP_URL"

# Download and extract
wget -O source.zip "$SOURCE_ZIP_URL"
unzip -q source.zip -d ./temp
if [ $(ls ./temp | wc -l) -eq 1 ] && [ -d "./temp/$(ls ./temp)" ]; then
  mv ./temp/$(ls ./temp)/* ./
  mv ./temp/$(ls ./temp)/.* ./ 2>/dev/null || true
else
  mv ./temp/* ./
  mv ./temp/.* ./ 2>/dev/null || true
fi
rm -rf ./temp source.zip

# Build
echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npx vite build --base="./"

# Find build directory
if [ -d "./dist" ]; then
  BUILD_DIR="./dist"
elif [ -d "./build" ]; then
  BUILD_DIR="./build"
else
  echo "❌ No build output found"
  exit 1
fi

echo "✅ Build output found in: $BUILD_DIR"

# Add SWA config
cat > "$BUILD_DIR/staticwebapp.config.json" << EOF
{
  "navigationFallback": {
    "rewrite": "/index.html"
  }
}
EOF

# Deploy using npx (ensures latest version)
echo "🌐 Deploying to Azure Static Web Apps..."
cd "$BUILD_DIR"

# This is the key - use npx with full package name
npx -y @azure/static-web-apps-cli@latest deploy \
  . \
  --deployment-token "$SWA_DEPLOYMENT_TOKEN" \
  --verbose \
  --no-use-keychain

cd ..

# Create ZIP for download
ZIP_NAME="build_${BUILD_ID}.zip"
cd "$BUILD_DIR" && zip -r "../$ZIP_NAME" . && cd ..

# Upload ZIP
az storage blob upload \
  --file "$ZIP_NAME" \
  --container-name "build-outputs" \
  --name "${BUILD_ID}/${ZIP_NAME}" \
  --connection-string "$STORAGE_CONNECTION_STRING" \
  --overwrite

echo "🎉 Deployment completed!"
echo "🌐 URL: https://${SWA_DEFAULT_HOSTNAME}"
echo "📥 Download: https://${STORAGE_ACCOUNT_NAME}.blob.core.windows.net/build-outputs/${BUILD_ID}/${ZIP_NAME}"