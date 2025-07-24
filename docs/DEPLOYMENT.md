# 🚀 Global Price Pulse - Deployment Check Guide

## Quick Start

### 1. Run Deployment Check
```bash
cd backend
npm run check-deployment
```

### 2. If Issues Found
```bash
# Install dependencies
npm install

# Start Redis (if not running)
brew services start redis  # macOS
sudo systemctl start redis  # Ubuntu

# Run check again
npm run check-deployment
```

---

## 🔍 What the Deployment Check Validates

### **Environment Checks**
- ✅ Node.js version (requires 16+)
- ✅ NPM version
- ✅ Redis connection
- ✅ Environment variables
- ✅ File permissions
- ✅ Disk space
- ✅ Memory availability

### **Dependencies Checks**
- ✅ Redis package
- ✅ Winston logging
- ✅ Axios HTTP client
- ✅ Puppeteer browser automation
- ✅ Cheerio HTML parsing
- ✅ Bull job queue
- ✅ Package.json validity
- ✅ Node modules installation

### **Connectivity Checks**
- ✅ Redis connectivity
- ✅ External API access
- ✅ Database connections
- ✅ Network latency
- ✅ DNS resolution

### **Functionality Checks**
- ✅ Manual trigger crawler
- ✅ Knowledge graph system
- ✅ User engagement system
- ✅ Data processing pipeline
- ✅ Error handling
- ✅ Logging system

### **Performance Checks**
- ✅ Response time
- ✅ Memory usage
- ✅ CPU performance
- ✅ Concurrent connections
- ✅ Data processing speed

### **Security Checks**
- ✅ Environment variable security
- ✅ API key protection
- ✅ Data encryption capabilities
- ✅ Input validation
- ✅ Rate limiting (planned)
- ✅ CORS configuration (planned)

---

## 📊 Understanding Results

### **Overall Status**
- **PASSED** (90%+ success rate): Ready for deployment
- **WARNING** (70-89% success rate): Review warnings before deployment
- **FAILED** (<70% success rate): Fix critical issues before deployment

### **Priority Levels**
- **Critical (Priority 3)**: Must fix before deployment
- **High (Priority 2)**: Should fix before deployment
- **Low (Priority 1)**: Nice to fix

---

## 🔧 Common Issues & Solutions

### **Redis Connection Failed**
```bash
# Install Redis
brew install redis  # macOS
sudo apt-get install redis-server  # Ubuntu

# Start Redis
brew services start redis  # macOS
sudo systemctl start redis  # Ubuntu

# Test connection
redis-cli ping
```

### **Node.js Version Too Old**
```bash
# Install Node.js 16+
# Using nvm (recommended)
nvm install 16
nvm use 16

# Or download from nodejs.org
```

### **Missing Dependencies**
```bash
# Install all dependencies
npm install

# If specific package missing
npm install redis winston axios puppeteer cheerio bull
```

### **Environment Variables Missing**
```bash
# Create .env file
cp .env.example .env

# Edit .env file with your values
nano .env
```

### **File Permissions Issues**
```bash
# Fix permissions
chmod 755 scripts/
chmod 644 package.json
chmod 644 .env
```

---

## 🛠️ Manual Validation Steps

### **1. Environment Setup**
```bash
# Check Node.js version
node --version  # Should be 16+

# Check NPM version
npm --version

# Check Redis
redis-cli ping  # Should return PONG
```

### **2. Dependencies Check**
```bash
# Install dependencies
npm install

# Check if packages are available
node -e "console.log('Redis:', require('redis') ? 'OK' : 'FAIL')"
node -e "console.log('Winston:', require('winston') ? 'OK' : 'FAIL')"
node -e "console.log('Axios:', require('axios') ? 'OK' : 'FAIL')"
```

### **3. Configuration Check**
```bash
# Check .env file exists
ls -la .env

# Check environment variables
node -e "console.log('REDIS_URL:', process.env.REDIS_URL || 'NOT SET')"
node -e "console.log('LOG_LEVEL:', process.env.LOG_LEVEL || 'NOT SET')"
```

### **4. System Test**
```bash
# Test the full system
npm run test

# Test individual components
node scripts/test-crawler.js
node scripts/test-engagement-system.js
```

---

## 📋 Pre-Deployment Checklist

### **Environment**
- [ ] Node.js 16+ installed
- [ ] Redis server running
- [ ] .env file configured
- [ ] Sufficient disk space
- [ ] Sufficient memory

### **Dependencies**
- [ ] All packages installed
- [ ] No version conflicts
- [ ] Package.json valid
- [ ] Node modules present

### **Configuration**
- [ ] Environment variables set
- [ ] API keys configured (if needed)
- [ ] Database connections working
- [ ] Logging configured

### **Functionality**
- [ ] Crawler system working
- [ ] Knowledge graph initialized
- [ ] Engagement system ready
- [ ] Error handling tested

### **Performance**
- [ ] Response times acceptable
- [ ] Memory usage reasonable
- [ ] Concurrent connections tested
- [ ] Data processing efficient

### **Security**
- [ ] Sensitive data protected
- [ ] Input validation working
- [ ] API keys secured
- [ ] Encryption available

---

## 🚀 Deployment Commands

### **Development**
```bash
npm run dev
```

### **Production**
```bash
npm run build
npm start
```

### **Testing**
```bash
npm test
npm run check-deployment
```

---

## 📊 Monitoring After Deployment

### **Health Checks**
```bash
# Check if services are running
curl http://localhost:3000/health

# Check Redis
redis-cli ping

# Check logs
tail -f logs/app.log
```

### **Performance Monitoring**
```bash
# Monitor memory usage
top -p $(pgrep node)

# Monitor Redis
redis-cli info memory

# Monitor disk usage
df -h
```

---

## 🆘 Troubleshooting

### **Common Error Messages**

#### **"Redis connection failed"**
```bash
# Check if Redis is running
ps aux | grep redis

# Start Redis if not running
brew services start redis  # macOS
sudo systemctl start redis  # Ubuntu
```

#### **"Module not found"**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

#### **"Permission denied"**
```bash
# Fix file permissions
chmod 755 scripts/
chmod 644 .env
```

#### **"Environment variables missing"**
```bash
# Create .env file
cp .env.example .env
# Edit .env with your values
```

### **Getting Help**
1. Check the logs: `tail -f logs/app.log`
2. Run validation: `npm run check-deployment`
3. Check system resources: `htop` or `top`
4. Verify network: `ping google.com`

---

## 📈 Success Metrics

### **Deployment Success Indicators**
- ✅ All validation checks pass
- ✅ Services start without errors
- ✅ Health checks return 200 OK
- ✅ Logs show no critical errors
- ✅ Performance metrics within limits

### **Performance Benchmarks**
- Response time: < 1000ms
- Memory usage: < 500MB
- CPU usage: < 80%
- Redis latency: < 50ms
- Concurrent connections: > 100

---

*This deployment check ensures your Global Price Pulse system is ready for production deployment with all components working correctly.* 