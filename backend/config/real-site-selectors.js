module.exports = {
  // Korean e-commerce sites with real selectors
  koreanSites: {
    coupang: {
      url: 'https://www.coupang.com',
      searchPath: '/np/search',
      priceSelectors: [
        '.price-value',
        '.price',
        '[data-price]',
        '.cost',
        '.product-price'
      ],
      titleSelectors: [
        '.name',
        '.product-name',
        'h3',
        '.title',
        '.item-title'
      ],
      enabled: true,
      delay: 3000,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    gmarket: {
      url: 'https://www.gmarket.co.kr',
      searchPath: '/search',
      priceSelectors: [
        '.price',
        '.cost',
        '[class*="price"]',
        '.item_price',
        '.product-price'
      ],
      titleSelectors: [
        '.item_title',
        '.title',
        'h3',
        '.product-title',
        '.item-name'
      ],
      enabled: true,
      delay: 3000,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    elevenst: {
      url: 'https://www.11st.co.kr',
      searchPath: '/search',
      priceSelectors: [
        '.price',
        '.cost',
        '[class*="price"]',
        '.item_price',
        '.product-price'
      ],
      titleSelectors: [
        '.title',
        '.product-title',
        'h3',
        '.item-title',
        '.name'
      ],
      enabled: true,
      delay: 3000,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  },

  // US e-commerce sites with real selectors
  usSites: {
    amazon: {
      url: 'https://www.amazon.com',
      searchPath: '/s',
      priceSelectors: [
        '.a-price-whole',
        '.a-price .a-offscreen',
        '[data-price]',
        '.price',
        '.cost'
      ],
      titleSelectors: [
        '.a-size-medium',
        '.a-size-base',
        'h2',
        '.product-title',
        '.title'
      ],
      enabled: true,
      delay: 3000,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    bestbuy: {
      url: 'https://www.bestbuy.com',
      searchPath: '/site/searchpage.jsp',
      priceSelectors: [
        '.priceView-customer-price',
        '.price',
        '[data-price]',
        '.cost',
        '.product-price'
      ],
      titleSelectors: [
        '.sku-title',
        '.product-title',
        'h4',
        '.title',
        '.name'
      ],
      enabled: true,
      delay: 3000,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    walmart: {
      url: 'https://www.walmart.com',
      searchPath: '/search',
      priceSelectors: [
        '.price-characteristic',
        '.price',
        '[data-price]',
        '.cost',
        '.product-price'
      ],
      titleSelectors: [
        '.product-title',
        '.title',
        'h3',
        '.name',
        '.item-title'
      ],
      enabled: true,
      delay: 3000,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    },
    target: {
      url: 'https://www.target.com',
      searchPath: '/search',
      priceSelectors: [
        '.price',
        '.cost',
        '[data-price]',
        '.product-price',
        '.item-price'
      ],
      titleSelectors: [
        '.product-title',
        '.title',
        'h3',
        '.name',
        '.item-title'
      ],
      enabled: true,
      delay: 3000,
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    }
  },

  // Product-specific configurations
  productConfigs: {
    'iPhone 15 Pro': {
      koreanKeywords: ['아이폰 15 프로', 'iPhone 15 Pro', '애플 아이폰 15 프로'],
      usKeywords: ['iPhone 15 Pro', 'Apple iPhone 15 Pro'],
      expectedKRPrice: 1500000,
      expectedUSPrice: 999,
      category: 'Electronics',
      priority: 'high'
    },
    'Samsung Galaxy S24': {
      koreanKeywords: ['삼성 갤럭시 S24', 'Samsung Galaxy S24', '갤럭시 S24'],
      usKeywords: ['Samsung Galaxy S24', 'Galaxy S24'],
      expectedKRPrice: 1200000,
      expectedUSPrice: 799,
      category: 'Electronics',
      priority: 'high'
    },
    'Laneige Lip Sleeping Mask': {
      koreanKeywords: ['라네즈 립 슬리핑 마스크', 'Laneige Lip Sleeping Mask', '라네즈 립마스크'],
      usKeywords: ['Laneige Lip Sleeping Mask', 'Laneige Lip Mask'],
      expectedKRPrice: 11000,
      expectedUSPrice: 26,
      category: 'Beauty',
      priority: 'medium'
    },
    'Nike Air Force 1': {
      koreanKeywords: ['나이키 에어포스 1', 'Nike Air Force 1', '에어포스 1'],
      usKeywords: ['Nike Air Force 1', 'Air Force 1'],
      expectedKRPrice: 120000,
      expectedUSPrice: 100,
      category: 'Fashion',
      priority: 'medium'
    }
  },

  // Rate limiting configuration
  rateLimiting: {
    requestsPerMinute: 10,
    requestsPerHour: 100,
    delayBetweenRequests: 5000, // 5 seconds
    maxConcurrentRequests: 2
  },

  // Error handling configuration
  errorHandling: {
    maxRetries: 3,
    retryDelay: 2000,
    timeout: 30000,
    ignoreSSL: false
  },

  // Data validation rules
  validation: {
    minPrice: 1000, // Minimum valid price in KRW
    maxPrice: 5000000, // Maximum valid price in KRW
    minDisparity: 5, // Minimum disparity percentage to report
    maxDisparity: 200, // Maximum disparity percentage to report
    confidenceThreshold: 0.7 // Minimum confidence score
  }
}; 