import { Anthropic } from '@anthropic-ai/sdk';
import { config } from '../config';

const anthropic = new Anthropic({
  apiKey: config.claude.apiKey,
});

export interface TrendingProduct {
  name: string;
  category: 'korean_cosmetics' | 'us_it';
  description: string;
  searchKeywords: string[];
  expectedPriceRange: {
    min: number;
    max: number;
    currency: string;
  };
}

export async function getTrendingProducts(): Promise<TrendingProduct[]> {
  try {
    const prompt = `You are a product research expert specializing in cross-border e-commerce between Korea and the US.

Your task is to identify trending products that would be interesting for price comparison between Korean and US markets.

Focus on these categories:
1. Korean Cosmetics (K-beauty products, skincare, makeup)
2. US IT Products (electronics, gadgets, tech accessories)

For each product, provide:
- Product name
- Category (korean_cosmetics or us_it)
- Brief description
- Search keywords for price scraping
- Expected price range

Generate 10 trending products (5 Korean cosmetics, 5 US IT products) that are currently popular and have significant price differences between markets.

Return the response as a JSON array with this structure:
[
  {
    "name": "Product Name",
    "category": "korean_cosmetics|us_it",
    "description": "Brief product description",
    "searchKeywords": ["keyword1", "keyword2", "keyword3"],
    "expectedPriceRange": {
      "min": 10,
      "max": 100,
      "currency": "USD"
    }
  }
]`;

    const response = await anthropic.messages.create({
      model: config.claude.model,
      max_tokens: config.claude.maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type === 'text') {
      try {
        const products = JSON.parse(content.text);
        console.log(`Generated ${products.length} trending products`);
        return products;
      } catch (parseError) {
        console.error('Failed to parse Claude response:', parseError);
        return getDefaultProducts();
      }
    }

    return getDefaultProducts();
  } catch (error) {
    console.error('Error getting trending products from Claude:', error);
    return getDefaultProducts();
  }
}

function getDefaultProducts(): TrendingProduct[] {
  return [
    {
      name: "Laneige Water Sleeping Mask",
      category: "korean_cosmetics",
      description: "Popular Korean overnight hydrating mask",
      searchKeywords: ["laneige", "water sleeping mask", "korean skincare"],
      expectedPriceRange: { min: 15, max: 35, currency: "USD" }
    },
    {
      name: "Innisfree Green Tea Seed Serum",
      category: "korean_cosmetics", 
      description: "Hydrating serum with green tea extract",
      searchKeywords: ["innisfree", "green tea seed serum", "korean serum"],
      expectedPriceRange: { min: 12, max: 28, currency: "USD" }
    },
    {
      name: "Apple AirPods Pro",
      category: "us_it",
      description: "Wireless noise-cancelling earbuds",
      searchKeywords: ["airpods pro", "apple earbuds", "wireless headphones"],
      expectedPriceRange: { min: 200, max: 250, currency: "USD" }
    },
    {
      name: "Samsung Galaxy S24",
      category: "us_it",
      description: "Latest Samsung flagship smartphone",
      searchKeywords: ["samsung galaxy s24", "galaxy s24", "samsung phone"],
      expectedPriceRange: { min: 800, max: 1200, currency: "USD" }
    }
  ];
} 