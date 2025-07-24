#!/bin/bash

# Global Price Pulse Deployment Script
# Anti-Spaghetti: Automated deployment process

echo "🚀 Starting Global Price Pulse deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Please copy env.example to .env and configure your Firebase settings."
    echo "cp env.example .env"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install functions dependencies
echo "📦 Installing Cloud Functions dependencies..."
cd functions && npm install && cd ..

# Build the React app
echo "🔨 Building React app..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please check for errors."
    exit 1
fi

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live at: https://your-project-id.web.app"
    echo "📊 Firebase Console: https://console.firebase.google.com"
else
    echo "❌ Deployment failed. Please check Firebase console for errors."
    exit 1
fi

echo "🎉 Global Price Pulse is now live!" 