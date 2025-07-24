# GPP Agent System

An autonomous agent system for cross-border product price scraping between Korean and US markets.

## 🚀 Features

- **AI-Powered Product Discovery**: Uses Claude AI to identify trending products
- **Multi-Site Scraping**: Scrapes prices from major Korean and US e-commerce sites
- **Firebase Integration**: Stores scraped data in Firestore
- **Error Handling**: Robust retry logic and error recovery
- **Notifications**: Slack and email reporting
- **Rate Limiting**: Respectful scraping with delays between requests

## 📋 Prerequisites

- Node.js 18+
- Firebase project with Firestore enabled
- Claude API key
- (Optional) Slack webhook URL for notifications
- (Optional) Gmail account for email notifications

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   cd agents
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp ../env.example .env
   ```

   Add these to your `.env` file:
   ```env
   CLAUDE_API_KEY=your_claude_api_key_here
   SLACK_WEBHOOK_URL=your_slack_webhook_url_here
   ADMIN_EMAIL=ethancho12@gmail.com
   
   # Gmail Configuration for Email Notifications (Optional)
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-app-password
   ```

3. **Configure Firebase:**
   The agent uses the same Firebase configuration as your main app.

## 🏃‍♂️ Usage

### Running the Agent

```bash
# Development mode with watch
npm run dev

# Production mode
npm start

# Build TypeScript
npm run build
```

### Manual Execution

```typescript
import gppAgent from './gpp-agent.agent';

// Run the agent
const result = await gppAgent.run();
console.log('Agent completed:', result);
```

## 🏗️ Architecture

### Core Modules

1. **`claude_product_ideator.ts`**
   - Uses Claude AI to generate trending product suggestions
   - Focuses on Korean cosmetics and US IT products
   - Provides search keywords and expected price ranges

2. **`scraper.ts`**
   - Handles price scraping from multiple e-commerce sites
   - Supports Korean sites: Coupang, 11st, Gmarket, Auction
   - Supports US sites: Amazon, Best Buy, Walmart, Target
   - Implements rate limiting and error handling

3. **`firestore_writer.ts`**
   - Uploads scraped data to Firebase Firestore
   - Handles data validation and status tracking
   - Supports batch uploads

4. **`self_healer.ts`**
   - Implements retry logic with exponential backoff
   - Handles different types of errors appropriately
   - Sends critical error alerts

5. **`notifier.ts`**
   - Generates comprehensive reports
   - Sends notifications via Slack and email
   - Provides detailed success/failure analytics

### Configuration

The `config.ts` file contains all configuration options:

```typescript
export const config = {
  browser: {
    userDataDir: '/tmp/chrome-session',
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
    apiKey: process.env.CLAUDE_API_KEY,
    model: 'claude-3-sonnet-20240229',
    maxTokens: 4000
  },
  // ... more config
};
```

## 📊 Data Structure

### Scraped Product Data

```typescript
interface ScrapedProductData {
  product: {
    name: string;
    category: 'korean_cosmetics' | 'us_it';
    description: string;
    searchKeywords: string[];
    expectedPriceRange: {
      min: number;
      max: number;
      currency: string;
    };
  };
  priceData: {
    korea?: {
      price: number;
      currency: string;
      site: string;
      url: string;
      available: boolean;
    };
    us?: {
      price: number;
      currency: string;
      site: string;
      url: string;
      available: boolean;
    };
    scrapedAt: string;
  };
  scrapedAt: string;
  agentVersion: string;
  status: 'success' | 'partial' | 'failed';
}
```

## 🔧 Customization

### Adding New Sites

1. Add the site to `config.ts`:
   ```typescript
   sites: {
     korea: [...existing_sites, 'new-site.co.kr'],
     us: [...existing_sites, 'new-site.com']
   }
   ```

2. Add price selectors in `scraper.ts`:
   ```typescript
   function getPriceSelectors(site: string): string[] {
     switch (site) {
       case 'new-site.com':
         return ['.price', '.product-price', '.sale-price'];
       // ... existing cases
     }
   }
   ```

### Modifying Product Categories

Update the prompt in `claude_product_ideator.ts` to focus on different product categories.

### Custom Error Handling

Extend `self_healer.ts` to handle site-specific errors or implement custom retry logic.

## 🚨 Error Handling

The agent implements comprehensive error handling:

- **Network Errors**: Automatic retry with exponential backoff
- **Rate Limiting**: Respectful delays between requests
- **Site Changes**: Fallback selectors for price extraction
- **Critical Errors**: Immediate alerts via Slack/email

## 📈 Monitoring

### Logs

The agent provides detailed console logging:
```
🚀 Starting GPP Agent...
📊 Fetching trending products...
Found 10 trending products
🔍 Starting price scraping...
Processing 1/10: Laneige Water Sleeping Mask
✅ Successfully processed: Laneige Water Sleeping Mask
📈 Scraping completed in 45s
✅ Successes: 8
❌ Failures: 2
🎉 GPP Agent completed successfully
```

### Reports

Daily reports include:
- Success/failure counts
- Performance metrics
- Detailed error analysis
- Product-specific results

## 🔒 Security

- Uses environment variables for sensitive data
- Implements rate limiting to avoid being blocked
- Respects robots.txt and site terms of service
- Secure Firebase integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📧 Email Setup

To enable email notifications:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "GPP Agent" as the name
   - Copy the generated password
3. **Update your `.env` file**:
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=your-16-digit-app-password
   ADMIN_EMAIL=ethancho12@gmail.com
   ```

## 📄 License

This project is licensed under the MIT License. 