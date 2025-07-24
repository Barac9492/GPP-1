#!/usr/bin/env node

const admin = require('firebase-admin');

// Initialize Firebase Admin for emulator
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'globalcal-fhvfo'
  });
}

const db = admin.firestore();

// Connect to emulator
db.settings({
  host: 'localhost:8080',
  ssl: false
});

// Import mock data generator
const { createMockQuizData } = require('./generate-mock-data');

const addMockDataToFirebase = async (quizData) => {
  try {
    const quizDoc = createMockQuizData(quizData);
    
    // Add to Firestore
    const docRef = await db.collection('quizzes').add(quizDoc);
    console.log(`✅ Created mock quiz with ID: ${docRef.id}`);
    console.log(`📊 Generated ${quizDoc.matchedDeals.length} mock deals for "${quizDoc.item}"`);
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating mock quiz:', error);
    throw error;
  }
};

// Test function with multiple scenarios
const testMultipleScenarios = async () => {
  console.log('🎯 Adding Mock Data to Firebase Emulator...');
  
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
      const quizId = await addMockDataToFirebase(scenario);
      console.log(`✅ Quiz ID: ${quizId}`);
    }
    
    console.log('\n🎉 All mock data added successfully!');
    console.log('🌐 Check your frontend at http://localhost:3000');
    console.log('📊 Check Firebase Emulator UI at http://localhost:4000');
    
  } catch (error) {
    console.error('❌ Failed to add mock data:', error);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  process.exit(0);
});

// Start the script
if (require.main === module) {
  testMultipleScenarios().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { addMockDataToFirebase }; 