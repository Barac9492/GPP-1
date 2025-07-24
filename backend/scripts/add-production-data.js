#!/usr/bin/env node

const admin = require('firebase-admin');

// Initialize Firebase Admin for production
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'global-price-pulse'
  });
}

const db = admin.firestore();

// Import mock data generator
const { createMockQuizData } = require('./generate-mock-data');

const addProductionData = async (quizData) => {
  try {
    const quizDoc = createMockQuizData(quizData);
    
    // Add to Firestore
    const docRef = await db.collection('quizzes').add(quizDoc);
    console.log(`✅ Created production quiz with ID: ${docRef.id}`);
    console.log(`📊 Generated ${quizDoc.matchedDeals.length} deals for "${quizDoc.item}"`);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating production quiz:', error);
    throw error;
  }
};

// Test function with multiple scenarios
const testProductionData = async () => {
  console.log('🎯 Adding Test Data to Production Firebase...');
  
  const scenarios = [
    {
      item: 'AirPods Pro',
      budget: 300,
      region: 'US',
      category: 'Electronics',
      email: 'test@example.com'
    },
    {
      item: 'iPhone 15 Pro',
      budget: 1000,
      region: 'Japan',
      category: 'Electronics',
      email: 'user2@example.com'
    },
    {
      item: 'MacBook Air M2',
      budget: 1200,
      region: 'Korea',
      category: 'Electronics',
      email: 'user3@example.com'
    }
  ];

  try {
    for (const scenario of scenarios) {
      console.log(`\n📝 Adding data for: ${scenario.item} ($${scenario.budget})`);
      const quizId = await addProductionData(scenario);
      console.log(`✅ Quiz ID: ${quizId}`);
    }
    
    console.log('\n🎉 All production data added successfully!');
    console.log('🌐 Check your frontend at http://localhost:3001');
    console.log('📊 Check Firebase Console at https://console.firebase.google.com/project/global-price-pulse/firestore');
    
  } catch (error) {
    console.error('❌ Failed to add production data:', error);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  process.exit(0);
});

// Start the script
if (require.main === module) {
  testProductionData().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { addProductionData }; 