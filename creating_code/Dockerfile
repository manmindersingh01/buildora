# Use official Node image
FROM node:18

# Install unzip and wget to handle zip files
RUN apt-get update && apt-get install -y unzip wget && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Accept a URL argument for the zip file
ARG ZIP_URL

# Download the zip file
RUN wget -O app.zip "$ZIP_URL" || (echo "❌ Failed to download ZIP file" && exit 1)

# Extract contents
RUN unzip app.zip -d ./ || (echo "❌ Failed to unzip file" && exit 1)

# Clean up the zip file
RUN rm app.zip

# Install dependencies and build
RUN npm install
RUN npm run build

# CMD only to keep container alive briefly (optional in prod)
CMD ["echo", "Build completed."]