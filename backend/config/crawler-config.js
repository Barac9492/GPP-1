module.exports = {
  // Crawler settings
  crawler: {
    delay: 5000, // 5 seconds between requests
    maxRetries: 3,
    timeout: 30000, // 30 seconds timeout
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    maxConcurrent: 2, // Limit concurrent requests
    rateLimit: {
      requests: 10,
      window: 60000 // 10 requests per minute
    }
  },

  // Target products for Korea-US comparison
  products: [
    {
      category: 'Electronics',
      name: 'iPhone 15 Pro',
      krKeywords: ['아이폰 15 프로', 'iPhone 15 Pro'],
      usKeywords: ['iPhone 15 Pro'],
      expectedKRPrice: 1500000, // KRW
      expectedUSPrice: 999, // USD
      shippingKR: 0,
      shippingUS: 0,
      priority: 'high'
    },
    {
      category: 'Electronics',
      name: 'Samsung Galaxy S24',
      krKeywords: ['삼성 갤럭시 S24', 'Samsung Galaxy S24'],
      usKeywords: ['Samsung Galaxy S24'],
      expectedKRPrice: 1200000, // KRW
      expectedUSPrice: 799, // USD
      shippingKR: 0,
      shippingUS: 0,
      priority: 'high'
    },
    {
      category: 'Beauty',
      name: 'Laneige Lip Sleeping Mask',
      krKeywords: ['라네즈 립 슬리핑 마스크', 'Laneige Lip Sleeping Mask'],
      usKeywords: ['Laneige Lip Sleeping Mask'],
      expectedKRPrice: 11000, // KRW
      expectedUSPrice: 26, // USD
      shippingKR: 0,
      shippingUS: 5,
      priority: 'medium'
    },
    {
      category: 'Fashion',
      name: 'Nike Air Force 1',
      krKeywords: ['나이키 에어포스 1', 'Nike Air Force 1'],
      usKeywords: ['Nike Air Force 1'],
      expectedKRPrice: 120000, // KRW
      expectedUSPrice: 100, // USD
      shippingKR: 0,
      shippingUS: 0,
      priority: 'medium'
    },
    {
      category: 'Luxury',
      name: 'Louis Vuitton Speedy Bandoulière 25',
      krKeywords: ['루이비통 스피디', 'Louis Vuitton Speedy'],
      usKeywords: ['Louis Vuitton Speedy Bandouliere 25'],
      expectedKRPrice: 3000000, // KRW
      expectedUSPrice: 2484, // USD
      shippingKR: 0,
      shippingUS: 0,
      priority: 'low'
    }
  ],

  // Korean e-commerce sites
  koreanSites: {
    coupang: {
      url: 'https://www.coupang.com',
      searchPath: '/np/search',
      priceSelector: '.price-value',
      titleSelector: '.name',
      enabled: true
    },
    gmarket: {
      url: 'https://www.gmarket.co.kr',
      searchPath: '/search',
      priceSelector: '.price',
      titleSelector: '.item_title',
      enabled: true
    },
    elevenst: {
      url: 'https://www.11st.co.kr',
      searchPath: '/search',
      priceSelector: '.price',
      titleSelector: '.title',
      enabled: true
    },
    naver: {
      url: 'https://shopping.naver.com',
      searchPath: '/search',
      priceSelector: '.price',
      titleSelector: '.title',
      enabled: true
    }
  },

  // US e-commerce sites
  usSites: {
    amazon: {
      url: 'https://www.amazon.com',
      searchPath: '/s',
      priceSelector: '.a-price-whole',
      titleSelector: '.a-size-medium',
      enabled: true
    },
    walmart: {
      url: 'https://www.walmart.com',
      searchPath: '/search',
      priceSelector: '.price-characteristic',
      titleSelector: '.product-title',
      enabled: true
    },
    target: {
      url: 'https://www.target.com',
      searchPath: '/search',
      priceSelector: '.price',
      titleSelector: '.product-title',
      enabled: true
    },
    bestbuy: {
      url: 'https://www.bestbuy.com',
      searchPath: '/site/searchpage.jsp',
      priceSelector: '.priceView-customer-price',
      titleSelector: '.sku-title',
      enabled: true
    }
  },

  // Exchange rate settings
  exchangeRate: {
    baseCurrency: 'USD',
    targetCurrency: 'KRW',
    updateInterval: 3600000, // 1 hour
    fallbackRate: 1300 // Fallback KRW/USD rate
  },

  // Database settings
  database: {
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3
    }
  },

  // Logging settings
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: './logs/crawler.log',
    maxSize: '10m',
    maxFiles: 5
  },

  // Notification settings
  notifications: {
    email: {
      enabled: false,
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      }
    },
    slack: {
      enabled: false,
      webhook: process.env.SLACK_WEBHOOK
    }
  }
}; 