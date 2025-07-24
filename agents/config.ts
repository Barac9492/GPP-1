export const config = {
  browser: {
    userDataDir: '/Users/ethancho/Library/Application Support/Google/Chrome/Default',
    headless: true,
    timeout: 30000
  },
  scraping: {
    delayBetweenRequests: 2000, // 2 seconds
    maxRetries: 3,
    timeout: 30000
  },
  firestore: {
    collection: 'scraped_products',
    batchSize: 500
  },
  claude: {
    apiKey: process.env['CLAUDE_API_KEY'],
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4000
  },
  notification: {
    webhookUrl: process.env['SLACK_WEBHOOK_URL'],
    email: process.env['ADMIN_EMAIL']
  },
  sites: {
    korea: [
      'coupang.com',
      '11st.co.kr',
      'gmarket.co.kr',
      'auction.co.kr'
    ],
    us: [
      'amazon.com',
      'bestbuy.com',
      'walmart.com',
      'target.com'
    ]
  }
}; 