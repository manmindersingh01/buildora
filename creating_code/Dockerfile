# Use official Node image
FROM node:18

# Install unzip and wget
RUN apt-get update && apt-get install -y unzip wget && rm -rf /var/lib/apt/lists/*

WORKDIR /app

ARG ZIP_URL

# Download the zip file
RUN wget -O app.zip "$ZIP_URL" || (echo "❌ Failed to download ZIP file" && exit 1)

# Unzip and flatten: move all files from the first folder (if any) to /app
RUN unzip app.zip -d ./temp && \
    if [ $(ls ./temp | wc -l) -eq 1 ] && [ -d "./temp/$(ls ./temp)" ]; then \
      mv ./temp/$(ls ./temp)/* ./; \
      mv ./temp/$(ls ./temp)/.* ./ 2>/dev/null || true; \
    else \
      mv ./temp/* ./; \
      mv ./temp/.* ./ 2>/dev/null || true; \
    fi && \
    rm -rf ./temp && rm -f app.zip

# Debug: List contents after extraction
RUN echo "📁 After extraction:" && ls -la

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Debug: List contents after build
RUN echo "📁 After build:" && ls -la && \
    if [ -d "dist" ]; then echo "✅ dist/:" && ls -la dist; fi && \
    if [ -d "build" ]; then echo "✅ build/:" && ls -la build; fi

# Create a script to handle the copy operation
RUN echo '#!/bin/bash\n\
set -e\n\
echo "🔄 Starting copy operation..."\n\
mkdir -p /output\n\
\n\
# Clear output directory first\n\
rm -rf /output/* /output/.[!.]* /output/..?* 2>/dev/null || true\n\
\n\
if [ -d "./dist" ] && [ "$(ls -A ./dist 2>/dev/null)" ]; then\n\
    echo "✅ Found dist directory, copying contents..."\n\
    cp -r ./dist/. /output/\n\
    echo "📁 Copied from dist/ to /output/"\n\
elif [ -d "./build" ] && [ "$(ls -A ./build 2>/dev/null)" ]; then\n\
    echo "✅ Found build directory, copying contents..."\n\
    cp -r ./build/. /output/\n\
    echo "📁 Copied from build/ to /output/"\n\
else\n\
    echo "❌ No build output found in dist/ or build/"\n\
    echo "📁 Current directory contents:"\n\
    ls -la\n\
    exit 1\n\
fi\n\
\n\
echo "📁 Final output directory contents:"\n\
ls -la /output/\n\
echo "🎉 Copy operation completed successfully!"' > /copy-build.sh

RUN chmod +x /copy-build.sh

CMD ["/copy-build.sh"]