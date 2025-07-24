export const translations = {
  ko: {
    // Header
    home: '홈',
    about: '소개',
    reports: '리포트',
    products: '상품',
    contact: '연락처',
    signUpSignIn: '회원가입 / 로그인',
    logout: '로그아웃',
    
    // Product Form
    productRegistration: '상품 등록하기',
    linkOnlyPaste: '링크만 붙여넣으면 AI가 자동으로 정보를 추출합니다!',
    productLink: '상품 링크',
    amazonCoupangEtc: '(Amazon, Coupang, etc.)',
    linkPlaceholder: 'https://amazon.com/product...',
    extracting: '추출 중...',
    linkRequired: '링크를 입력해주세요',
    invalidLink: '올바른 링크를 입력해주세요',
    autoExtractInfo: '링크를 입력하면 AI가 자동으로 상품명, 가격, 이미지를 추출합니다',
    extractedInfo: '추출된 정보',
    productName: '상품명',
    price: '가격',
    imageUrl: '이미지 URL',
    description: '설명',
    descriptionOptional: '설명 (선택)',
    descriptionPlaceholder: '상품에 대한 간단한 설명을 추가하세요...',
    nickname: '닉네임',
    nicknameOptional: '닉네임 (선택)',
    nicknamePlaceholder: '공개할 닉네임을 입력하세요',
    nicknameHint: '비워두시면 Google 계정명이 표시됩니다',
    registerProduct: '상품 등록하기',
    registering: '등록 중...',
    registrationSuccess: '상품이 성공적으로 등록되었습니다!',
    registrationFailed: '상품 등록에 실패했습니다. 다시 시도해주세요.',
    extractionFailed: '상품 정보를 자동으로 추출할 수 없습니다. 수동으로 입력해주세요.',
    
    // Product Category Validation
    categoryValidation: '제품 카테고리 검증',
    koreanCosmetics: '한국 화장품',
    usItProducts: '미국 IT 제품',
    categoryDetected: '카테고리 감지됨',
    categoryNotSupported: '지원하지 않는 카테고리',
    categoryValidationMessage: '한국 화장품이나 미국 IT 제품만 등록할 수 있습니다.',
    koreanCosmeticsDetected: '한국 화장품으로 인식되었습니다.',
    usItProductDetected: '미국 IT 제품으로 인식되었습니다.',
    categoryGuidelines: '등록 가능한 제품',
    koreanCosmeticsGuidelines: '한국의 화장품, 스킨케어, 뷰티 제품들입니다.',
    usItGuidelines: '미국의 전자제품, 컴퓨터, IT 관련 제품들입니다.',
    categoryExamples: '예시',
    koreanCosmeticsExamples: 'Innisfree, Laneige, Sulwhasoo, SK-II, The Face Shop, Etude House, Missha, Nature Republic, Tony Moly, Banila Co, Clio, 3CE, Cosrx, Dr. Jart, Belif, Huxley, Klairs, Pyunkang Yul, Beauty of Joseon, Round Lab, Isntree, Purito, Iunik 등',
    usItExamples: 'Apple, Dell, HP, Lenovo, Asus, Acer, MSI, Razer, Alienware, Microsoft, Samsung, LG, Sony, Canon, Nikon, GoPro, Steam, PlayStation, Xbox, Nintendo 등',
    
    // Product List
    latestProducts: '최신 상품 목록',
    productListDescription: '사용자들이 공유한 최고의 딜들을 확인해보세요!',
    loading: '로딩 중...',
    loadingProducts: '상품 목록을 불러오는 중...',
    error: '오류',
    loadFailed: '상품 목록을 불러오는데 실패했습니다.',
    retry: '다시 시도',
    noProducts: '아직 등록된 상품이 없습니다',
    noProductsDescription: '첫 번째 상품을 등록해보세요!',
    registerFirstProduct: '상품 등록하기',
    recommender: '추천자',
    anonymous: 'Anonymous',
    views: '명이 봤어요!',
    justRegistered: '방금 등록됨',
    buyNow: '구매하러 가기',
    priceInfo: '가격 정보 없음',
    today: '오늘',
    yesterday: '어제',
    daysAgo: '일 전',
    
    // Products Page
    shareProducts: '상품 공유하기',
    shareProductsDescription: '좋은 딜을 발견하셨나요? 다른 사람들과 공유해보세요! 한국과 미국의 가격 차이를 활용한 최고의 상품들을 찾아보세요.',
    productRegistration: '상품 등록',
    loginAndShare: '로그인하고 좋은 딜을 공유해보세요!',
    registrationGuide: '상품 등록 가이드',
    step1: '1. 링크 붙여넣기',
    step1Description: '상품 링크를 복사해서 붙여넣기만 하면 됩니다.',
    step2: '2. AI 자동 추출',
    step2Description: 'AI가 자동으로 상품명, 가격, 이미지를 추출합니다.',
    step3: '3. 공유하기',
    step3Description: '추출된 정보를 확인하고 등록하면 다른 사용자들이 볼 수 있습니다.',
    
    // Common
    hello: '안녕하세요',
    welcome: '님!',
    googleLogin: 'Google로 로그인',
    loginRequired: '상품 등록은 로그인 후 이용하실 수 있습니다.',
    
    // Date formatting
    formatDate: (date) => {
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return '오늘';
      if (diffDays === 2) return '어제';
      if (diffDays <= 7) return `${diffDays - 1}일 전`;
      return date.toLocaleDateString('ko-KR');
    },
    
    // Price formatting
    formatPrice: (price) => {
      if (!price) return '가격 정보 없음';
      const numPrice = parseInt(price);
      if (isNaN(numPrice)) return price;
      return new Intl.NumberFormat('ko-KR').format(numPrice) + '원';
    }
  },
  
  en: {
    // Header
    home: 'Home',
    about: 'About',
    reports: 'Reports',
    products: 'Products',
    contact: 'Contact',
    signUpSignIn: 'Sign up / Sign in',
    logout: 'Logout',
    
    // Product Form
    productRegistration: 'Product Registration',
    linkOnlyPaste: 'Just paste the link and AI will automatically extract the information!',
    productLink: 'Product Link',
    amazonCoupangEtc: '(Amazon, Coupang, etc.)',
    linkPlaceholder: 'https://amazon.com/product...',
    extracting: 'Extracting...',
    linkRequired: 'Please enter a link',
    invalidLink: 'Please enter a valid link',
    autoExtractInfo: 'Enter a link and AI will automatically extract product name, price, and image',
    extractedInfo: 'Extracted Information',
    productName: 'Product Name',
    price: 'Price',
    imageUrl: 'Image URL',
    description: 'Description',
    descriptionOptional: 'Description (Optional)',
    descriptionPlaceholder: 'Add a brief description of the product...',
    nickname: 'Nickname',
    nicknameOptional: 'Nickname (Optional)',
    nicknamePlaceholder: 'Enter a nickname to display publicly',
    nicknameHint: 'Leave empty to use your Google account name',
    registerProduct: 'Register Product',
    registering: 'Registering...',
    registrationSuccess: 'Product registered successfully!',
    registrationFailed: 'Product registration failed. Please try again.',
    extractionFailed: 'Unable to automatically extract product information. Please enter manually.',
    
    // Product Category Validation
    categoryValidation: 'Product Category Validation',
    koreanCosmetics: 'Korean Cosmetics',
    usItProducts: 'US IT Products',
    categoryDetected: 'Category Detected',
    categoryNotSupported: 'Category Not Supported',
    categoryValidationMessage: 'Only Korean cosmetics or US IT products can be registered.',
    koreanCosmeticsDetected: 'Recognized as Korean cosmetics.',
    usItProductDetected: 'Recognized as US IT product.',
    categoryGuidelines: 'Registerable Products',
    koreanCosmeticsGuidelines: 'Korean cosmetics, skincare, beauty products.',
    usItGuidelines: 'US electronics, computers, IT-related products.',
    categoryExamples: 'Examples',
    koreanCosmeticsExamples: 'Innisfree, Laneige, Sulwhasoo, SK-II, The Face Shop, Etude House, Missha, Nature Republic, Tony Moly, Banila Co, Clio, 3CE, Cosrx, Dr. Jart, Belif, Huxley, Klairs, Pyunkang Yul, Beauty of Joseon, Round Lab, Isntree, Purito, Iunik, etc.',
    usItExamples: 'Apple, Dell, HP, Lenovo, Asus, Acer, MSI, Razer, Alienware, Microsoft, Samsung, LG, Sony, Canon, Nikon, GoPro, Steam, PlayStation, Xbox, Nintendo, etc.',
    
    // Product List
    latestProducts: 'Latest Products',
    productListDescription: 'Check out the best deals shared by users!',
    loading: 'Loading...',
    loadingProducts: 'Loading product list...',
    error: 'Error',
    loadFailed: 'Failed to load product list.',
    retry: 'Retry',
    noProducts: 'No products registered yet',
    noProductsDescription: 'Register the first product!',
    registerFirstProduct: 'Register Product',
    recommender: 'Recommender',
    anonymous: 'Anonymous',
    views: ' people viewed!',
    justRegistered: 'Just registered',
    buyNow: 'Buy Now',
    priceInfo: 'No price info',
    today: 'Today',
    yesterday: 'Yesterday',
    daysAgo: ' days ago',
    
    // Products Page
    shareProducts: 'Share Products',
    shareProductsDescription: 'Found a great deal? Share it with others! Find the best products using price differences between Korea and the US.',
    productRegistration: 'Product Registration',
    loginAndShare: 'Login and share great deals!',
    registrationGuide: 'Product Registration Guide',
    step1: '1. Paste Link',
    step1Description: 'Simply copy and paste the product link.',
    step2: '2. AI Auto-Extract',
    step2Description: 'AI automatically extracts product name, price, and image.',
    step3: '3. Share',
    step3Description: 'Review extracted information and register for others to see.',
    
    // Common
    hello: 'Hello',
    welcome: '!',
    googleLogin: 'Sign in with Google',
    loginRequired: 'Product registration is available after login.',
    
    // Date formatting
    formatDate: (date) => {
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) return `${diffDays - 1} days ago`;
      return date.toLocaleDateString('en-US');
    },
    
    // Price formatting
    formatPrice: (price) => {
      if (!price) return 'No price info';
      const numPrice = parseInt(price);
      if (isNaN(numPrice)) return price;
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numPrice);
    }
  }
}; 