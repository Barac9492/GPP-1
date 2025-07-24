#!/bin/bash

echo "🚀 Setting up GPP Agent..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Claude API Configuration
CLAUDE_API_KEY=your_claude_api_key_here

# Notification Configuration (Optional)
SLACK_WEBHOOK_URL=your_slack_webhook_url_here
ADMIN_EMAIL=ethancho12@gmail.com

# Gmail Configuration for Email Notifications (Optional)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password

# Firebase Configuration (uses same as main app)
REACT_APP_FIREBASE_API_KEY=AIzaSyBNaX6-RiIHTp1003NREKfYX2AnH_BmAOI
REACT_APP_FIREBASE_AUTH_DOMAIN=globalpp-1.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=globalpp-1
REACT_APP_FIREBASE_STORAGE_BUCKET=globalpp-1.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=900286647865
REACT_APP_FIREBASE_APP_ID=1:900286647865:web:e2b706131518b05f9407e8
REACT_APP_FIREBASE_MEASUREMENT_ID=G-N3LDQ5DD3D
EOF
    echo "✅ Created .env file. Please update it with your actual API keys."
else
    echo "✅ .env file already exists."
fi

# Check if Chrome is installed
if ! command -v google-chrome &> /dev/null && ! command -v chromium-browser &> /dev/null; then
    echo "⚠️  Chrome/Chromium not found. Puppeteer will download its own version."
else
    echo "✅ Chrome/Chromium found."
fi

# Make run script executable
chmod +x run.ts

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Run: npm start"
echo "3. Or run: npx ts-node run.ts"
echo ""
echo "To get a Claude API key:"
echo "1. Go to https://console.anthropic.com/"
echo "2. Create an account and get your API key"
echo "3. Add it to the .env file"
echo ""
echo "Optional: Set up Slack webhook for notifications"
echo "1. Go to https://api.slack.com/apps"
echo "2. Create a new app and add webhook URL to .env" 