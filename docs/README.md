# 📚 Global Price Pulse - Documentation

Welcome to the Global Price Pulse documentation. This directory contains all technical documentation for the project.

## 📖 Documentation Index

### **Core Documentation**
- **[README.md](../README.md)** - Main project overview and setup
- **[BACKEND.md](./BACKEND.md)** - Backend system architecture and API documentation
- **[ENGAGEMENT-SYSTEM.md](./ENGAGEMENT-SYSTEM.md)** - User engagement system documentation
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Deployment guide and validation
- **[STRATEGIC-PLAN.md](./STRATEGIC-PLAN.md)** - Strategic system architecture and planning

### **Development Guides**
- **[STRUCTURE_ANALYSIS.md](../STRUCTURE_ANALYSIS.md)** - Codebase structure analysis and cleanup
- **[LOCAL_TESTING.md](../LOCAL_TESTING.md)** - Local development and testing guide
- **[PAGES_SUMMARY.md](../PAGES_SUMMARY.md)** - Frontend pages and components summary

## 🏗️ System Architecture

### **Backend Components**
```
backend/
├── crawlers/           # Web crawling system
│   ├── base-crawler.js        # Base crawler with common functionality
│   ├── amazon-crawler.js      # Amazon-specific crawler
│   └── manual-trigger-crawler.js # Manual trigger system
├── intelligence/       # Knowledge graph system
│   └── knowledge-graph.js     # Obsidian-inspired knowledge graph
├── engagement/         # User engagement system
│   └── user-engagement-system.js # Palantir-inspired engagement
├── scripts/           # Utility scripts
│   ├── deployment-validator.js   # Deployment validation
│   ├── check-deployment.js       # Deployment checker
│   └── test-engagement-system.js # System testing
├── utils/             # Shared utilities
│   ├── logger.js              # Unified logging system
│   └── error-handler.js       # Error handling utilities
└── logs/              # Application logs
```

### **Frontend Components**
```
src/
├── components/         # React components
├── pages/             # Application pages
├── utils/             # Frontend utilities
└── App.js             # Main application component
```

## 🚀 Quick Start

### **1. Environment Setup**
```bash
# Install dependencies
npm install
cd backend && npm install

# Set up environment variables
cp env.example .env
# Edit .env with your configuration
```

### **2. Start Development**
```bash
# Start frontend
npm start

# Start backend (in another terminal)
cd backend
npm run dev

# Run deployment check
npm run check-deployment
```

### **3. Testing**
```bash
# Test backend systems
cd backend
npm test

# Test engagement system
node scripts/test-engagement-system.js

# Test crawler
node scripts/test-crawler.js
```

## 🔧 Development Workflow

### **Code Organization**
- **Backend**: Node.js with Redis, Winston logging, modular architecture
- **Frontend**: React with Tailwind CSS, component-based architecture
- **Documentation**: Markdown files organized by system component

### **Quality Assurance**
- **Deployment Validation**: Comprehensive pre-deployment checks
- **Error Handling**: Unified error handling across all systems
- **Logging**: Structured logging with Winston
- **Testing**: Automated testing for all major components

### **Best Practices**
- **Modular Design**: Separate concerns, reusable components
- **Error Handling**: Comprehensive error catching and logging
- **Documentation**: Inline comments and detailed documentation
- **Testing**: Automated tests for all critical functionality

## 📊 System Features

### **Core Capabilities**
- ✅ **Manual Trigger Crawling**: User-initiated and admin-initiated crawling
- ✅ **Knowledge Graph**: Obsidian-inspired data relationships
- ✅ **User Engagement**: Palantir-inspired engagement system
- ✅ **Deployment Validation**: Comprehensive deployment checks
- ✅ **Error Handling**: Unified error management
- ✅ **Logging**: Structured logging system

### **Advanced Features**
- ✅ **Virtuous Loops**: User engagement → Data collection → Improved recommendations
- ✅ **Compounding Moats**: Data moat, network effects, intelligence moat
- ✅ **Gamification**: Badges, levels, points system
- ✅ **Personalization**: User-specific recommendations and insights

## 🔍 Troubleshooting

### **Common Issues**
1. **Redis Connection Failed**: Install and start Redis server
2. **Missing Dependencies**: Run `npm install` in both root and backend directories
3. **Environment Variables**: Ensure `.env` file is properly configured
4. **Port Conflicts**: Check if ports 3000 (frontend) and 6379 (Redis) are available

### **Getting Help**
1. Check the logs: `tail -f backend/logs/*.log`
2. Run deployment validation: `cd backend && npm run check-deployment`
3. Review error messages in the console
4. Check system resources and network connectivity

## 📈 Performance Metrics

### **System Benchmarks**
- **Response Time**: < 1000ms for API calls
- **Memory Usage**: < 500MB for backend processes
- **Redis Latency**: < 50ms for database operations
- **Concurrent Connections**: Support for 100+ simultaneous users

### **Success Indicators**
- ✅ All deployment validation checks pass
- ✅ Services start without errors
- ✅ Health checks return 200 OK
- ✅ Logs show no critical errors
- ✅ Performance metrics within limits

## 🔒 Security Considerations

### **Data Protection**
- Environment variables for sensitive configuration
- Input validation on all user inputs
- Rate limiting to prevent abuse
- Secure logging without sensitive data exposure

### **Compliance**
- GDPR-compliant data handling
- Ethical web crawling practices
- Respect for robots.txt and rate limits
- Transparent data usage policies

---

## 📝 Contributing

When contributing to this project:

1. **Follow the established structure** - Use existing patterns and conventions
2. **Update documentation** - Keep documentation current with code changes
3. **Add tests** - Include tests for new functionality
4. **Use the unified utilities** - Leverage the shared logging and error handling
5. **Run validation** - Ensure deployment validation passes before committing

---

*This documentation is maintained alongside the codebase. For the most up-to-date information, check the individual documentation files.* 