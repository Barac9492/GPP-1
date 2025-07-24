import { db } from '../firebase';
import { collection, addDoc, getDocs, orderBy, query, doc, updateDoc, increment, serverTimestamp, getDoc } from 'firebase/firestore';

export async function addProduct(product) {
  try {
    console.log('addProduct called with:', product);
    
    // Validate required fields
    if (!product.title || !product.price || !product.link) {
      console.error('Missing required fields:', { title: !!product.title, price: !!product.price, link: !!product.link });
      throw new Error('필수 필드가 누락되었습니다.');
    }

    // Clean and validate data
    const cleanProduct = {
      title: product.title.trim(),
      price: product.price.toString().replace(/[^0-9]/g, ''), // 숫자만 추출
      imageUrl: product.imageUrl?.trim() || '',
      description: product.description?.trim() || '',
      link: product.link.trim(),
      introducedBy: product.introducedBy?.trim() || 'Anonymous',
      category: product.category || null, // Add category field
      views: 0,
      createdAt: serverTimestamp(), // Use server timestamp for consistency
    };

    console.log('Clean product data:', cleanProduct);

    const docRef = await addDoc(collection(db, 'products'), cleanProduct);
    console.log('Product added successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('상품 등록 실패:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    throw new Error('상품 등록에 실패했습니다. 다시 시도해주세요.');
  }
}

export async function getProducts() {
  try {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
        views: data.views || 0,
        introducedBy: data.introducedBy || 'Anonymous'
      };
    });
  } catch (error) {
    console.error('상품 목록 조회 실패:', error);
    throw new Error('상품 목록을 불러오는데 실패했습니다.');
  }
}

export async function incrementProductViews(productId) {
  try {
    if (!productId) {
      console.warn('상품 ID가 없습니다.');
      return;
    }

    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { 
      views: increment(1),
      lastViewed: serverTimestamp()
    });
  } catch (error) {
    console.error('조회수 증가 실패:', error);
    // Don't throw error for view increment as it's not critical
  }
}

export async function getProductById(productId) {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      throw new Error('상품을 찾을 수 없습니다.');
    }

    const data = productDoc.data();
    return {
      id: productDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || data.createdAt || new Date(),
      views: data.views || 0,
      introducedBy: data.introducedBy || 'Anonymous'
    };
  } catch (error) {
    console.error('상품 조회 실패:', error);
    throw new Error('상품 정보를 불러오는데 실패했습니다.');
  }
} 