import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { TrendingProduct } from './claude_product_ideator';
import { PriceData } from './scraper';
import { config } from '../config';

// Initialize Firebase (using the same config as your main app)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyBNaX6-RiIHTp1003NREKfYX2AnH_BmAOI',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'globalpp-1.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'globalpp-1',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'globalpp-1.firebasestorage.app',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '900286647865',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:900286647865:web:e2b706131518b05f9407e8',
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || 'G-N3LDQ5DD3D'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    
    const docRef = await addDoc(collection(db, config.firestore.collection), {
      ...scrapedData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
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