const axios = require('axios');

async function testLocalSetup() {
  console.log('🧪 Testing Global Price Pulse Local Setup...\n');

  // Test React App
  try {
    const reactResponse = await axios.get('http://localhost:3000', { timeout: 5000 });
    console.log('✅ React App: Running on http://localhost:3000');
    console.log(`   Status: ${reactResponse.status}`);
  } catch (error) {
    console.log('❌ React App: Not accessible');
    console.log(`   Error: ${error.message}`);
  }

  // Test Firebase Emulator UI
  try {
    const emulatorResponse = await axios.get('http://localhost:4000', { timeout: 5000 });
    console.log('✅ Firebase Emulator UI: Running on http://localhost:4000');
    console.log(`   Status: ${emulatorResponse.status}`);
  } catch (error) {
    console.log('❌ Firebase Emulator UI: Not accessible');
    console.log(`   Error: ${error.message}`);
  }

  // Test Firestore Emulator
  try {
    const firestoreResponse = await axios.get('http://localhost:8080', { timeout: 5000 });
    console.log('✅ Firestore Emulator: Running on http://localhost:8080');
    console.log(`   Status: ${firestoreResponse.status}`);
  } catch (error) {
    console.log('❌ Firestore Emulator: Not accessible');
    console.log(`   Error: ${error.message}`);
  }

  // Test Functions Emulator
  try {
    const functionsResponse = await axios.get('http://localhost:5001', { timeout: 5000 });
    console.log('✅ Functions Emulator: Running on http://localhost:5001');
    console.log(`   Status: ${functionsResponse.status}`);
  } catch (error) {
    console.log('❌ Functions Emulator: Not accessible');
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n🎯 Local Testing URLs:');
  console.log('   React App: http://localhost:3000');
  console.log('   Firebase Emulator UI: http://localhost:4000');
  console.log('   Firestore: http://localhost:8080');
  console.log('   Functions: http://localhost:5001');
  
  console.log('\n📝 Next Steps:');
  console.log('   1. Open http://localhost:3000 in your browser');
  console.log('   2. Complete the 5-step quiz');
  console.log('   3. Check Firebase Emulator UI for data');
  console.log('   4. Test affiliate link clicks');
  console.log('   5. Verify analytics tracking');
}

testLocalSetup().catch(console.error); 