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
  // Create a new object to avoid mutating the original
  const sanitized = {};
  
  Object.keys(data).forEach(key => {
    let value = data[key];
    
    // Handle undefined values
    if (value === undefined) {
      value = null;
    }
    // Handle null values in nested objects
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      value = sanitizeData(value);
    }
    // Handle arrays with undefined values
    else if (Array.isArray(value)) {
      value = value.map(item => item === undefined ? null : item);
    }
    
    sanitized[key] = value;
  });
  
  return sanitized;
}

async function uploadToFirestore(product, priceData) {
  try {
    console.log(`📝 Uploading data for: ${product.name}`);
    
    // Ensure all required fields have values
    const docData = sanitizeData({
      productName: product.name || 'Unknown Product',
      category: product.category || 'unknown',
      description: product.description || `Scraped product data for ${product.name}`,
      prices: priceData || {},
      scrapedAt: admin.firestore.FieldValue.serverTimestamp(),
      source: product.source || 'gpp-agent',
      status: 'active'
    });
    
    // Validate data before upload
    if (!docData.productName || docData.productName === 'Unknown Product') {
      throw new Error('Invalid product name');
    }
    
    // Add to scraped_products collection
    const docRef = await db.collection('scraped_products').add(docData);
    
    console.log(`✅ Successfully uploaded to Firestore with ID: ${docRef.id}`);
    console.log(`📊 Data summary: ${Object.keys(priceData || {}).length} price entries`);
    
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