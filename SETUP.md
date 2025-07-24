# Global Price Pulse - Setup Guide

This guide will help you set up and deploy Global Price Pulse, an AI-powered cross-border price comparison app.

## 🏗️ Tech Stack

- **Frontend**: React with Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Cloud Functions)
- **AI**: Custom deal matching algorithm
- **Deployment**: Firebase Hosting
- **Analytics**: Firebase Analytics + Custom tracking

## 📋 Prerequisites

1. **Node.js** (v16 or higher)
2. **npm** or **yarn**
3. **Firebase CLI** (`npm install -g firebase-tools`)
4. **Git** (for version control)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository (if using git)
git clone <your-repo-url>
cd global-price-pulse

# Install dependencies
npm install

# Install Cloud Functions dependencies
cd functions && npm install && cd ..
```

### 2. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Name it "Global Price Pulse"
   - Enable Google Analytics (optional)

2. **Enable Services**:
   - **Firestore Database**: Create database in production mode
   - **Authentication**: Enable Email/Password and Anonymous
   - **Hosting**: Enable web hosting
   - **Functions**: Enable Cloud Functions

3. **Get Configuration**:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Click "Add app" > Web app
   - Copy the config object

### 3. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit .env with your Firebase config
nano .env
```

Update `.env` with your Firebase configuration:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4. Initialize Firebase

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select the following:
# - Firestore: Configure security rules
# - Functions: Configure a Cloud Functions directory
# - Hosting: Configure files for Firebase Hosting
# - Emulators: Set up local emulators
```

### 5. Deploy

```bash
# Use the deployment script
./deploy.sh

# Or deploy manually
npm run build
firebase deploy
```

## 🔧 Development

### Local Development

```bash
# Start development server
npm start

# Start Firebase emulators
firebase emulators:start

# Run tests
npm test
```

### Project Structure

```
global-price-pulse/
├── src/
│   ├── components/     # React components
│   │   ├── Quiz.js     # Quiz interface
│   │   └── Dashboard.js # Deal display
│   ├── utils/          # Utility functions
│   ├── App.js          # Main app component
│   └── firebase.js     # Firebase configuration
├── functions/          # Cloud Functions
│   └── index.js        # Backend logic
├── public/             # Static assets
└── firebase.json       # Firebase configuration
```

## 🎯 Features

### Core Features
- **1-Minute Quiz**: 5-step process to capture preferences
- **AI Deal Matching**: Intelligent algorithm for personalized deals
- **Cross-Border Shopping**: Global market coverage
- **Affiliate Integration**: Revenue from deal clicks
- **Real-time Updates**: Live deal matching and notifications

### Monetization
- **Affiliate Commissions**: $1-$10 per sale
- **Subscription Plans**: $5/month freemium model
- **Target Revenue**: $500-$2,500/month within 1-2 months

### Anti-Spaghetti Coding
- **Modular Design**: Separate functions for different tasks
- **Error Handling**: Comprehensive try-catch blocks
- **Testing**: Firebase emulator and Jest
- **Documentation**: Inline comments and clear structure

## 📊 Analytics & Tracking

### Events Tracked
- Quiz completions
- Deal clicks
- Share actions
- Subscription interest
- Error tracking

### Business Intelligence
- User preferences analysis
- Deal performance metrics
- Revenue attribution
- Conversion optimization

## 🌍 South Korea Strategy

### Inbound Marketing
- SEO optimization for "best global deals 2025"
- Content marketing on landing page
- Reddit presence (r/Frugal, r/TravelHacks)

### Outbound Marketing
- LinkedIn outreach to business groups
- Email campaigns to international contacts
- Professional network leveraging

## 🔒 Security & Compliance

### GDPR Compliance
- User consent management
- Data anonymization
- Right to be forgotten
- Privacy policy integration

### Security Measures
- Firebase Authentication
- Firestore security rules
- HTTPS enforcement
- Input validation

## 🚀 Deployment Checklist

- [ ] Firebase project created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Local testing completed
- [ ] Firebase emulators tested
- [ ] Production build successful
- [ ] Deployment successful
- [ ] Domain configured (optional)
- [ ] Analytics enabled
- [ ] Error monitoring setup

## 📈 Performance Optimization

### Frontend
- React optimization
- Tailwind CSS purging
- Image optimization
- Lazy loading

### Backend
- Cloud Functions optimization
- Firestore indexing
- Caching strategies
- CDN utilization

## 🛠️ Troubleshooting

### Common Issues

1. **Firebase Connection Error**:
   - Check environment variables
   - Verify Firebase project settings
   - Ensure proper authentication

2. **Build Failures**:
   - Clear node_modules and reinstall
   - Check for syntax errors
   - Verify all dependencies

3. **Deployment Issues**:
   - Check Firebase CLI login
   - Verify project permissions
   - Review deployment logs

### Support

For issues and questions:
- Check Firebase documentation
- Review error logs in Firebase console
- Test with Firebase emulators

## 📝 License

MIT License - see LICENSE file for details.

---

**Global Price Pulse** - AI-powered cross-border price comparison for smart shoppers worldwide. 