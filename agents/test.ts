#!/usr/bin/env ts-node

import { config } from './config';

async function testSetup() {
  console.log('🧪 Testing GPP Agent Setup...\n');

  // Test 1: Check environment variables
  console.log('1️⃣ Testing environment variables...');
  const requiredEnvVars = ['CLAUDE_API_KEY'];
  const optionalEnvVars = ['SLACK_WEBHOOK_URL', 'ADMIN_EMAIL'];
  
  let envOk = true;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.log(`❌ Missing required env var: ${envVar}`);
      envOk = false;
    } else {
      console.log(`✅ Found: ${envVar}`);
    }
  }
  
  for (const envVar of optionalEnvVars) {
    if (process.env[envVar]) {
      console.log(`✅ Found optional: ${envVar}`);
    } else {
      console.log(`⚠️  Missing optional: ${envVar}`);
    }
  }

  // Test 2: Check configuration
  console.log('\n2️⃣ Testing configuration...');
  console.log(`✅ Browser userDataDir: ${config.browser.userDataDir}`);
  console.log(`✅ Scraping delay: ${config.scraping.delayBetweenRequests}ms`);
  console.log(`✅ Max retries: ${config.scraping.maxRetries}`);
  console.log(`✅ Firestore collection: ${config.firestore.collection}`);

  // Test 3: Test module imports
  console.log('\n3️⃣ Testing module imports...');
  try {
    const { getTrendingProducts } = await import('./modules/claude_product_ideator');
    console.log('✅ claude_product_ideator imported');
  } catch (error) {
    console.log('❌ claude_product_ideator import failed:', error.message);
  }

  try {
    const { scrapePrices } = await import('./modules/scraper');
    console.log('✅ scraper imported');
  } catch (error) {
    console.log('❌ scraper import failed:', error.message);
  }

  try {
    const { uploadToFirestore } = await import('./modules/firestore_writer');
    console.log('✅ firestore_writer imported');
  } catch (error) {
    console.log('❌ firestore_writer import failed:', error.message);
  }

  try {
    const { handleError } = await import('./modules/self_healer');
    console.log('✅ self_healer imported');
  } catch (error) {
    console.log('❌ self_healer import failed:', error.message);
  }

  try {
    const { sendReport } = await import('./modules/notifier');
    console.log('✅ notifier imported');
  } catch (error) {
    console.log('❌ notifier import failed:', error.message);
  }

  // Test 4: Check Firebase config
  console.log('\n4️⃣ Testing Firebase configuration...');
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBNaX6-RiIHTp1003NREKfYX2AnH_BmAOI',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'globalpp-1.firebaseapp.com',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'globalpp-1',
  };
  
  console.log(`✅ Firebase project: ${firebaseConfig.projectId}`);
  console.log(`✅ Firebase auth domain: ${firebaseConfig.authDomain}`);

  // Summary
  console.log('\n' + '='.repeat(50));
  if (envOk) {
    console.log('🎉 Setup looks good! You can run the agent with:');
    console.log('   npm start');
    console.log('   or');
    console.log('   npx ts-node run.ts');
  } else {
    console.log('⚠️  Some issues found. Please check the errors above.');
    console.log('Make sure to set up your .env file with the required API keys.');
  }
  console.log('='.repeat(50));
}

// Run the test
testSetup().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
}); 