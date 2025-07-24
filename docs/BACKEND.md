# Global Price Pulse - Backend Crawling System

## 🎯 Overview

This backend system provides ethical web crawling capabilities for Global Price Pulse, focusing on price comparison across global markets. The system is designed to be respectful of websites' terms of service while gathering valuable price data.

## 🏗️ Architecture

```
backend/
├── crawlers/           # Crawler implementations
│   ├── base-crawler.js    # Base crawler with common functionality
│   ├── amazon-crawler.js  # Amazon-specific crawler
│   └── [other-crawlers]  # Additional retailer crawlers
├── api/               # REST API endpoints
├── database/          # Database models and migrations
├── scripts/           # Utility scripts
└── data/             # Crawled data storage
```

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
2. **Redis** (for rate limiting and caching)
3. **PostgreSQL** (for data storage)

### Installation

```bash
# Install dependencies
cd backend
npm install

# Copy environment variables
cp env.example .env

# Edit .env with your configuration
nano .env

# Install Redis (macOS)
brew install redis
brew services start redis

# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql
```

### Running Tests

```bash
# Test the Amazon crawler
npm run test

# Run specific crawler test
node scripts/test-crawler.js
```

## 🕷️ Crawler Features

### Ethical Crawling Practices

- ✅ **Robots.txt compliance** - Respects website crawling policies
- ✅ **Rate limiting** - Configurable delays between requests
- ✅ **User agent identification** - Clear bot identification
- ✅ **Exponential backoff** - Handles temporary failures gracefully
- ✅ **Request logging** - Full audit trail of all requests

### Supported Retailers

| Retailer | Status | Regions | API Available |
|----------|--------|---------|---------------|
| Amazon | ✅ Active | US, UK, DE, JP, CA | ❌ Scraping |
| eBay | 🔄 Planned | Global | ✅ API |
| Expedia | 🔄 Planned | Global | ✅ API |
| Best Buy | 🔄 Planned | US | ❌ Scraping |

## 📊 Data Structure

### Product Data Format

```javascript
{
  "title": "Samsung Galaxy S21",
  "price": 799.99,
  "originalPrice": 999.99,
  "currency": "USD",
  "region": "US",
  "retailer": "Amazon",
  "rating": 4.5,
  "reviewCount": 1250,
  "imageUrl": "https://...",
  "productUrl": "https://amazon.com/...",
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Price History Format

```javascript
{
  "productId": "B08N5WRWNW",
  "priceHistory": [
    {
      "date": "2025-01-10",
      "price": 999.99,
      "currency": "USD"
    },
    {
      "date": "2025-01-15", 
      "price": 799.99,
      "currency": "USD"
    }
  ]
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/global_price_pulse
REDIS_URL=redis://localhost:6379

# Crawling Settings
CRAWL_DELAY=1000                    # Milliseconds between requests
MAX_CONCURRENT_REQUESTS=5           # Concurrent crawler instances
USER_AGENT=GlobalPricePulse-Bot/1.0 # Bot identification

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60           # Requests per minute per domain
RATE_LIMIT_PER_HOUR=1000           # Requests per hour per domain
```

### Crawler Options

```javascript
const crawler = new AmazonCrawler({
  delay: 2000,              // 2 seconds between requests
  maxRetries: 3,            // Retry failed requests
  timeout: 30000,           // 30 second timeout
  userAgent: 'Custom User Agent'
});
```

## 📈 Usage Examples

### Basic Product Search

```javascript
const AmazonCrawler = require('./crawlers/amazon-crawler');

const crawler = new AmazonCrawler();

// Search for products
const products = await crawler.searchProducts('iPhone 15', 'US', 3);
console.log(`Found ${products.length} products`);

// Get detailed product information
const details = await crawler.getProductDetails(productUrl);

// Monitor price changes
const priceInfo = await crawler.monitorPriceChanges(productUrl, 'US');
```

### Multi-Region Comparison

```javascript
const regions = ['US', 'UK', 'DE', 'JP'];
const query = 'Samsung Galaxy S21';

for (const region of regions) {
  const products = await crawler.searchProducts(query, region, 1);
  
  if (products.length > 0) {
    const product = products[0];
    console.log(`${region}: ${product.price} ${product.currency}`);
  }
}
```

## 🛡️ Legal Compliance

### Ethical Guidelines

1. **Respect robots.txt** - All crawlers check robots.txt before requests
2. **Rate limiting** - Configurable delays prevent server overload
3. **User agent identification** - Clear bot identification in headers
4. **Terms of service compliance** - Respect website terms
5. **Data usage transparency** - Clear purpose and usage disclosure

### Best Practices

- ✅ **Start with small requests** - Test with limited scope
- ✅ **Monitor server responses** - Respect 429 (rate limit) responses
- ✅ **Use legitimate APIs** - Prefer official APIs over scraping
- ✅ **Implement proper error handling** - Graceful failure handling
- ✅ **Log all activities** - Maintain audit trail

## 🔍 Monitoring & Analytics

### Health Metrics

- **Success rate** by retailer and region
- **Response times** and performance metrics
- **Error rates** and failure patterns
- **Data freshness** (how recent is the data)

### Business Metrics

- **Deal discovery rate** (new deals found per day)
- **Savings potential** (average savings per deal)
- **Regional coverage** (markets with best deals)
- **User engagement** (which deals get most clicks)

## 🚀 Deployment

### Local Development

```bash
# Start Redis
brew services start redis

# Start PostgreSQL
brew services start postgresql

# Run crawler tests
npm run test

# Start development server
npm run dev
```

### Production Deployment

```bash
# Install dependencies
npm install --production

# Set environment variables
export DATABASE_URL="postgresql://..."
export REDIS_URL="redis://..."

# Start production server
npm start
```

## 📝 Development Guidelines

### Adding New Crawlers

1. **Extend BaseCrawler**
```javascript
const BaseCrawler = require('./base-crawler');

class NewRetailerCrawler extends BaseCrawler {
  constructor(options = {}) {
    super(options);
    // Retailer-specific configuration
  }
  
  async extractProductData(html, region) {
    // Implement product data extraction
  }
}
```

2. **Implement Required Methods**
   - `extractProductData()` - Parse HTML for product information
   - `searchProducts()` - Search for products by query
   - `getProductDetails()` - Get detailed product information

3. **Add Tests**
   - Unit tests for data extraction
   - Integration tests for full crawling
   - Performance tests for rate limiting

### Code Style

- **ESLint** for code quality
- **Prettier** for code formatting
- **JSDoc** for documentation
- **TypeScript** (future consideration)

## 🔧 Troubleshooting

### Common Issues

1. **Rate limiting errors**
   - Increase delays between requests
   - Check robots.txt compliance
   - Verify user agent settings

2. **Data extraction failures**
   - Update CSS selectors for site changes
   - Add error handling for missing elements
   - Implement fallback extraction methods

3. **Performance issues**
   - Optimize database queries
   - Implement caching strategies
   - Scale horizontally with multiple instances

### Debug Mode

```javascript
const crawler = new AmazonCrawler({
  debug: true,  // Enable detailed logging
  delay: 5000   // Slower for debugging
});
```

## 📞 Support

For questions or issues:

- **Email**: dev@globalpricepulse.com
- **Documentation**: [Internal Wiki]
- **Issues**: [GitHub Issues]

---

**Remember**: Always respect website terms of service and implement ethical crawling practices. This system is designed for legitimate price comparison purposes only. 