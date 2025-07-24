const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Default products if Claude API fails
const getDefaultProducts = () => [
  {
    name: 'Samsung Galaxy S24',
    category: 'US_IT',
    description: 'Latest Samsung smartphone with advanced features'
  },
  {
    name: 'Apple MacBook Pro M3',
    category: 'US_IT', 
    description: 'High-performance laptop with M3 chip'
  },
  {
    name: 'Innisfree Green Tea Seed Serum',
    category: 'KOREA_COSMETICS',
    description: 'Popular Korean skincare serum'
  },
  {
    name: 'Laneige Water Sleeping Mask',
    category: 'KOREA_COSMETICS',
    description: 'Hydrating overnight mask'
  },
  {
    name: 'Sony WH-1000XM5',
    category: 'US_IT',
    description: 'Premium noise-cancelling headphones'
  },
  {
    name: 'Missha Time Revolution Essence',
    category: 'KOREA_COSMETICS', 
    description: 'Anti-aging essence with fermented ingredients'
  },
  {
    name: 'Dell XPS 13',
    category: 'US_IT',
    description: 'Ultrabook with InfinityEdge display'
  },
  {
    name: 'Etude House Moistfull Collagen Cream',
    category: 'KOREA_COSMETICS',
    description: 'Moisturizing cream with collagen'
  },
  {
    name: 'Logitech MX Master 3S',
    category: 'US_IT',
    description: 'Wireless mouse with precision scrolling'
  },
  {
    name: 'COSRX Advanced Snail 96 Mucin Power Essence',
    category: 'KOREA_COSMETICS',
    description: 'Snail mucin essence for skin repair'
  }
];

async function getTrendingProducts() {
  try {
    console.log('🤖 Asking Claude for trending products...');
    
    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: `Generate 10 trending products for cross-border price comparison. 
        Focus on:
        - Korean cosmetics and skincare products (popular on sites like Olive Young, Lotte, Gmarket)
        - US IT products (electronics, computers, gadgets from Amazon, Best Buy, Newegg)
        
        Return only a JSON array with objects containing:
        - name: product name
        - category: "KOREA_COSMETICS" or "US_IT"
        - description: brief description
        
        Example format:
        [
          {
            "name": "Samsung Galaxy S24",
            "category": "US_IT",
            "description": "Latest Samsung smartphone"
          }
        ]`
      }]
    });

    const content = message.content[0];
    if (content.type === 'text') {
      try {
        const products = JSON.parse(content.text);
        console.log(`✅ Claude returned ${products.length} products`);
        return products;
      } catch (parseError) {
        console.error('❌ Failed to parse Claude response:', parseError);
        console.log('Using default products...');
        return getDefaultProducts();
      }
    } else {
      throw new Error('Unexpected response format from Claude');
    }
    
  } catch (error) {
    console.error('❌ Claude API error:', error.message);
    console.log('Using default products...');
    return getDefaultProducts();
  }
}

module.exports = { getTrendingProducts }; 