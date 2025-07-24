const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
let app;
try {
  const serviceAccountPath = path.join(__dirname, '../secrets/globalpp-1-firebase-adminsdk-fbsvc.json');
  const serviceAccount = require(serviceAccountPath);
  
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
  throw error;
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

function sanitizeData(data) {
  // Remove or nullify undefined fields
  Object.keys(data).forEach(key => {
    if (data[key] === undefined) {
      data[key] = null; // Or: delete data[key];
    }
  });
  return data;
}

async function uploadToFirestore(product, priceData) {
  try {
    console.log(`📝 Uploading data for: ${product.name}`);
    
    const docData = sanitizeData({
      productName: product.name,
      category: product.category,
      description: product.description,
      prices: priceData,
      scrapedAt: admin.firestore.FieldValue.serverTimestamp(),
      source: 'gpp-agent'
    });
    
    // Add to scraped_products collection
    const docRef = await db.collection('scraped_products').add(docData);
    
    console.log(`✅ Successfully uploaded to Firestore with ID: ${docRef.id}`);
    
    return {
      success: true,
      documentId: docRef.id,
      productName: product.name
    };
    
  } catch (error) {
    console.error(`❌ Failed to upload ${product.name} to Firestore:`, error);
    throw error;
  }
}

module.exports = { uploadToFirestore }; 