// Product validation utilities
export const PRODUCT_CATEGORIES = {
  KOREAN_COSMETICS: 'korean_cosmetics',
  US_IT: 'us_it'
};

// Keywords for Korean cosmetics
const KOREAN_COSMETICS_KEYWORDS = [
  '화장품', 'cosmetic', 'skincare', 'skincare', 'beauty', 'makeup', 'cleanser', 'toner', 'serum', 'essence', 'cream', 'lotion', 'mask', 'sheet mask',
  'k-beauty', 'korean beauty', 'korean skincare', 'korean cosmetic', 'korean makeup',
  'innisfree', 'laneige', 'sulwhasoo', 'sk-ii', 'the face shop', 'etude house', 'missha', 'nature republic', 'tony moly', 'banila co', 'clio', '3ce',
  'cosrx', 'dr. jart', 'dr. belmeur', 'belif', 'huxley', 'klairs', 'pyunkang yul', 'beauty of joseon', 'round lab', 'isntree', 'purito', 'iunik',
  'snail', 'propolis', 'ceramide', 'hyaluronic acid', 'niacinamide', 'vitamin c', 'retinol', 'peptide', 'collagen', 'centella', 'green tea', 'rice',
  'bb cream', 'cc cream', 'cushion', 'foundation', 'concealer', 'blush', 'eyeshadow', 'eyeliner', 'mascara', 'lipstick', 'lip tint', 'lip balm',
  'sunscreen', 'spf', 'uv', 'whitening', 'brightening', 'anti-aging', 'anti-wrinkle', 'moisturizing', 'hydrating', 'soothing', 'calming'
];

// Keywords for US IT products
const US_IT_KEYWORDS = [
  'laptop', 'computer', 'pc', 'desktop', 'macbook', 'imac', 'mac pro', 'mac mini', 'airpods', 'iphone', 'ipad', 'apple watch', 'apple tv',
  'dell', 'hp', 'lenovo', 'asus', 'acer', 'msi', 'razer', 'alienware', 'surface', 'xbox', 'playstation', 'nintendo', 'switch',
  'nvidia', 'amd', 'intel', 'processor', 'cpu', 'gpu', 'graphics card', 'ram', 'ssd', 'hard drive', 'motherboard', 'power supply',
  'monitor', 'keyboard', 'mouse', 'headphones', 'speakers', 'microphone', 'webcam', 'printer', 'scanner', 'router', 'modem', 'wifi',
  'software', 'app', 'application', 'program', 'game', 'gaming', 'streaming', 'video editing', 'photo editing', 'music production',
  'smartphone', 'android', 'samsung', 'google pixel', 'oneplus', 'motorola', 'lg', 'smart watch', 'fitness tracker', 'tablet',
  'amazon echo', 'google home', 'smart home', 'smart speaker', 'smart bulb', 'smart lock', 'smart thermostat', 'smart camera',
  'drone', 'camera', 'gopro', 'canon', 'nikon', 'sony', 'fujifilm', 'action camera', 'mirrorless', 'dslr'
];

// Korean cosmetics domains
const KOREAN_COSMETICS_DOMAINS = [
  'oliveyoung.com', 'lotte.com', 'gmarket.co.kr', 'auction.co.kr', '11st.co.kr', 'coupang.com', 'ssg.com', 'emart.com',
  'innisfree.com', 'laneige.com', 'sulwhasoo.com', 'sk-ii.com', 'thefaceshop.com', 'etudehouse.com', 'missha.com',
  'naturecollection.com', 'tonymoly.com', 'banilaco.com', 'clio.co.kr', '3ce.com', 'cosrx.com', 'drjart.com',
  'belif.com', 'huxley.com', 'klairs.com', 'pyunkangyul.com', 'beautyofjoseon.com', 'roundlab.com', 'isntree.com',
  'purito.com', 'iunik.com', 'yesstyle.com', 'stylevana.com', 'jolse.com', 'roseroseshop.com', 'koreadepart.com'
];

// US IT domains
const US_IT_DOMAINS = [
  'amazon.com', 'bestbuy.com', 'walmart.com', 'target.com', 'costco.com', 'bjs.com', 'samsclub.com',
  'apple.com', 'microsoft.com', 'dell.com', 'hp.com', 'lenovo.com', 'asus.com', 'acer.com', 'msi.com',
  'razer.com', 'alienware.com', 'newegg.com', 'microcenter.com', 'frys.com', 'bhphotovideo.com',
  'adorama.com', 'b&h.com', 'adorama.com', 'bhphotovideo.com', 'adorama.com', 'bhphotovideo.com',
  'steam.com', 'gog.com', 'epicgames.com', 'origin.com', 'uplay.com', 'battle.net', 'playstation.com',
  'nintendo.com', 'xbox.com', 'microsoft.com', 'google.com', 'samsung.com', 'lg.com', 'sony.com'
];

export function detectProductCategory(title, description, link) {
  const text = `${title} ${description}`.toLowerCase();
  const url = link.toLowerCase();
  
  // Check domain first
  const domain = extractDomain(url);
  
  // Korean cosmetics detection
  if (KOREAN_COSMETICS_DOMAINS.some(d => domain.includes(d))) {
    return PRODUCT_CATEGORIES.KOREAN_COSMETICS;
  }
  
  // US IT detection
  if (US_IT_DOMAINS.some(d => domain.includes(d))) {
    return PRODUCT_CATEGORIES.US_IT;
  }
  
  // Check keywords
  const koreanCosmeticsScore = KOREAN_COSMETICS_KEYWORDS.filter(keyword => 
    text.includes(keyword.toLowerCase())
  ).length;
  
  const usItScore = US_IT_KEYWORDS.filter(keyword => 
    text.includes(keyword.toLowerCase())
  ).length;
  
  if (koreanCosmeticsScore > usItScore && koreanCosmeticsScore > 0) {
    return PRODUCT_CATEGORIES.KOREAN_COSMETICS;
  }
  
  if (usItScore > koreanCosmeticsScore && usItScore > 0) {
    return PRODUCT_CATEGORIES.US_IT;
  }
  
  return null; // Unknown category
}

export function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

export function validateProductCategory(title, description, link) {
  const category = detectProductCategory(title, description, link);
  
  if (!category) {
    return {
      isValid: false,
      category: null,
      message: '이 제품은 한국 화장품이나 미국 IT 제품이 아닙니다. 한국 화장품이나 미국 IT 제품만 등록할 수 있습니다.'
    };
  }
  
  return {
    isValid: true,
    category: category,
    message: category === PRODUCT_CATEGORIES.KOREAN_COSMETICS 
      ? '한국 화장품으로 인식되었습니다.' 
      : '미국 IT 제품으로 인식되었습니다.'
  };
}

export function getCategoryDisplayName(category) {
  switch (category) {
    case PRODUCT_CATEGORIES.KOREAN_COSMETICS:
      return '한국 화장품';
    case PRODUCT_CATEGORIES.US_IT:
      return '미국 IT 제품';
    default:
      return '알 수 없음';
  }
}

export function getCategoryDescription(category) {
  switch (category) {
    case PRODUCT_CATEGORIES.KOREAN_COSMETICS:
      return '한국의 화장품, 스킨케어, 뷰티 제품들입니다.';
    case PRODUCT_CATEGORIES.US_IT:
      return '미국의 전자제품, 컴퓨터, IT 관련 제품들입니다.';
    default:
      return '';
  }
} 