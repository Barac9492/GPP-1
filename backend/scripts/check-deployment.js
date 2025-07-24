#!/usr/bin/env node

const DeploymentValidator = require('./deployment-validator');
const fs = require('fs');
const path = require('path');

async function checkDeployment() {
  console.log('🔍 Global Price Pulse - Deployment Check');
  console.log('=' .repeat(50));
  
  // Check if we're in the right directory
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error('❌ Error: Please run this script from the backend directory');
    console.error('   Current directory:', process.cwd());
    console.error('   Expected package.json at:', packageJsonPath);
    process.exit(1);
  }
  
  // Check if .env file exists
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    console.log('⚠️  Warning: No .env file found. Creating example .env file...');
    
    const exampleEnv = `# Global Price Pulse Environment Variables
# Copy this file to .env and update with your values

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info

# Crawler Configuration
CRAWLER_DELAY=1000
MAX_RETRIES=3

# API Keys (optional - will use public APIs if not set)
# AMAZON_API_KEY=your_amazon_api_key_here
# EBAY_API_KEY=your_ebay_api_key_here

# Database Configuration (optional - using Redis by default)
# DATABASE_URL=your_database_url_here

# Security
# JWT_SECRET=your_jwt_secret_here
# ENCRYPTION_KEY=your_encryption_key_here
`;
    
    fs.writeFileSync(envPath, exampleEnv);
    console.log('✅ Created .env file with example configuration');
    console.log('📝 Please update the .env file with your actual values');
  }
  
  // Run the deployment validator
  const validator = new DeploymentValidator();
  
  try {
    await validator.validateDeployment();
    
    // Check the results
    const reportPath = path.join(__dirname, 'deployment-validation-report.json');
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
      
      console.log('\n📋 Quick Summary:');
      console.log(`   Overall Status: ${report.results.overall}`);
      
      // Show critical issues first
      const recommendations = report.recommendations || [];
      const criticalIssues = recommendations.filter(r => r.priority === 3);
      const highIssues = recommendations.filter(r => r.priority === 2);
      
      if (criticalIssues.length > 0) {
        console.log('\n🚨 Critical Issues (Must Fix):');
        criticalIssues.forEach(issue => {
          console.log(`   ❌ ${issue.check}: ${issue.issue}`);
          console.log(`      Action: ${issue.action}`);
        });
      }
      
      if (highIssues.length > 0) {
        console.log('\n⚠️  High Priority Issues:');
        highIssues.forEach(issue => {
          console.log(`   ⚠️  ${issue.check}: ${issue.issue}`);
          console.log(`      Action: ${issue.action}`);
        });
      }
      
      if (criticalIssues.length === 0 && highIssues.length === 0) {
        console.log('\n✅ No critical or high-priority issues found!');
      }
      
      // Provide next steps
      console.log('\n📝 Next Steps:');
      if (report.results.overall === 'PASSED') {
        console.log('   🎉 Your system is ready for deployment!');
        console.log('   📦 Run: npm run build (for production build)');
        console.log('   🚀 Run: npm start (to start the server)');
      } else if (report.results.overall === 'WARNING') {
        console.log('   ⚠️  Review warnings before deployment');
        console.log('   🔧 Fix issues listed above');
        console.log('   🔄 Run this check again after fixes');
      } else {
        console.log('   ❌ Fix critical issues before deployment');
        console.log('   🔧 Address all issues listed above');
        console.log('   🔄 Run this check again after fixes');
      }
      
    }
    
  } catch (error) {
    console.error('❌ Deployment check failed:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Make sure Redis is installed and running');
    console.log('   2. Check that all dependencies are installed: npm install');
    console.log('   3. Verify your .env file has correct values');
    console.log('   4. Ensure you have Node.js 16+ installed');
    
    process.exit(1);
  }
}

// Run the check
if (require.main === module) {
  checkDeployment().catch(error => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { checkDeployment }; 