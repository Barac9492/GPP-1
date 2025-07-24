import * as admin from 'firebase-admin';
import { TrendingProduct } from './claude_product_ideator';
import { PriceData } from './scraper';

// Initialize Firebase Admin
const serviceAccount = require('../secrets/globalpp-1-firebase-adminsdk-fbsvc.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'globalpp-1'
  });
}

const db = admin.firestore();

export interface ScrapedProductData {
  product: TrendingProduct;
  priceData: PriceData;
  scrapedAt: string;
  agentVersion: string;
  status: 'success' | 'partial' | 'failed';
}

export async function uploadToFirestore(product: TrendingProduct, priceData: PriceData): Promise<string> {
  try {
    const scrapedData: ScrapedProductData = {
      product,
      priceData,
      scrapedAt: new Date().toISOString(),
      agentVersion: '1.0.0',
      status: determineStatus(priceData)
    };

    console.log(`Uploading data for ${product.name} to Firestore...`);
    
    const docRef = await db.collection('scraped_products').add({
      ...scrapedData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Successfully uploaded ${product.name} with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Failed to upload ${product.name} to Firestore:`, error);
    throw new Error(`Failed to upload product data: ${error.message}`);
  }
}

function determineStatus(priceData: PriceData): 'success' | 'partial' | 'failed' {
  const hasKorea = !!priceData.korea && priceData.korea.available;
  const hasUS = !!priceData.us && priceData.us.available;
  
  if (hasKorea && hasUS) {
    return 'success';
  } else if (hasKorea || hasUS) {
    return 'partial';
  } else {
    return 'failed';
  }
}

export async function uploadBatch(products: ScrapedProductData[]): Promise<string[]> {
  const docIds: string[] = [];
  
  try {
    for (const data of products) {
      const docId = await uploadToFirestore(data.product, data.priceData);
      docIds.push(docId);
    }
    
    console.log(`✅ Successfully uploaded batch of ${products.length} products`);
    return docIds;
  } catch (error) {
    console.error('❌ Failed to upload batch:', error);
    throw error;
  }
} 