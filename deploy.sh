#!/bin/bash

# Exit on error
set -e

# Build the application
echo "Building the application..."
npm run build

# Create deployment directory
echo "Creating deployment package..."
mkdir -p deployment
cp -r .next deployment/
cp -r public deployment/
cp package.json deployment/
cp package-lock.json deployment/
cp next.config.js deployment/
cp server.js deployment/
cp .env.production deployment/.env

# Create start script with better error handling
echo "Creating start script..."
echo '#!/bin/bash
export NODE_ENV=production
export PORT=3000

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Start the server
echo "Starting Node.js server..."
node server.js 2>&1 | tee server.log' > deployment/start.sh
chmod +x deployment/start.sh

# Create Hostinger specific files
echo "Creating Hostinger configuration..."
echo "nodejs_version=18
PassengerStartupFile server.js
PassengerAppType node
PassengerAppRoot /home/u123456/public_html" > deployment/.htaccess

echo "web: npm start" > deployment/Procfile

# Create a health check file
echo "<?php
\$port = 3000;
\$connection = @fsockopen('127.0.0.1', \$port);
if (is_resource(\$connection)) {
    echo 'Node.js server is running';
    fclose(\$connection);
} else {
    header('HTTP/1.1 503 Service Temporarily Unavailable');
    echo 'Node.js server is down';
}
?>" > deployment/health.php

echo "Deployment package created in ./deployment"
echo "Upload the contents of the deployment folder to your Hostinger public_html directory"
echo "Website will be available at: http://darkslategrey-boar-893404.hostingersite.com"
echo "Health check will be available at: http://darkslategrey-boar-893404.hostingersite.com/health.php" 