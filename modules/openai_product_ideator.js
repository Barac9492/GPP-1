const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function fetchTrendingProducts() {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-20240717',
      messages: [
        {
          role: 'system',
          content: 'You are a market trend analyst. Provide a list of 10 trending consumer electronics and beauty products globally in 2025, with one product per line, no extra text or formatting.'
        },
        { role: 'user', content: 'List 10 trending products.' }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const products = response.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .map(product => product.trim());

    if (products.length < 10) {
      throw new Error('Insufficient products fetched from OpenAI');
    }

    return products;
  } catch (error) {
    console.error(`❌ OpenAI API error: ${error.message}`);
    // Fallback to default products if API fails
    return [
      'Samsung Galaxy S24', 'Apple MacBook Pro M3', 'Innisfree Green Tea Seed Serum',
      'Laneige Water Sleeping Mask', 'Sony WH-1000XM5', 'Missha Time Revolution Essence',
      'Dell XPS 13', 'Etude House Moistfull Collagen Cream', 'Logitech MX Master 3S',
      'COSRX Advanced Snail 96 Mucin Power Essence'
    ];
  }
}

module.exports = { fetchTrendingProducts }; 