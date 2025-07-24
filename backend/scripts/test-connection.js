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

const testConnection = async () => {
  console.log('🔍 Testing Firebase Connection...');
  
  try {
    // Test basic connection
    console.log('📡 Testing connection to Firestore...');
    const testDoc = await db.collection('test').doc('connection').get();
    console.log('✅ Firestore connection successful');
    
    // Check for existing quizzes
    console.log('\n📊 Checking for existing quizzes...');
    const quizzesSnapshot = await db.collection('quizzes').get();
    
    if (quizzesSnapshot.empty) {
      console.log('❌ No quizzes found in database');
      return;
    }
    
    console.log(`✅ Found ${quizzesSnapshot.size} quizzes:`);
    
    quizzesSnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`• ID: ${doc.id}`);
      console.log(`  Item: ${data.item}`);
      console.log(`  Budget: $${data.budget}`);
      console.log(`  Region: ${data.region}`);
      console.log(`  Deals: ${data.matchedDeals?.length || 0}`);
      console.log('');
    });
    
    // Test specific quiz
    const testQuizId = quizzesSnapshot.docs[0].id;
    console.log(`🔍 Testing specific quiz: ${testQuizId}`);
    
    const quizDoc = await db.collection('quizzes').doc(testQuizId).get();
    if (quizDoc.exists) {
      const quizData = quizDoc.data();
      console.log('✅ Quiz data retrieved successfully');
      console.log(`📋 Quiz details:`);
      console.log(`  Item: ${quizData.item}`);
      console.log(`  Budget: $${quizData.budget}`);
      console.log(`  Region: ${quizData.region}`);
      console.log(`  Deals count: ${quizData.matchedDeals?.length || 0}`);
      
      if (quizData.matchedDeals && quizData.matchedDeals.length > 0) {
        console.log('\n💰 Sample deals:');
        quizData.matchedDeals.slice(0, 3).forEach((deal, index) => {
          console.log(`  ${index + 1}. ${deal.platform} - $${deal.price} (was $${deal.originalPrice})`);
        });
      }
    } else {
      console.log('❌ Quiz not found');
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Full error:', error);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  process.exit(0);
});

// Start the test
if (require.main === module) {
  testConnection().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { testConnection }; 