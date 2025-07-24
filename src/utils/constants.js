/**
 * Application constants
 * Anti-Spaghetti: Centralized configuration
 */

// Quiz configuration
export const QUIZ_CONFIG = {
  MAX_STEPS: 5,
  MIN_BUDGET: 1,
  MAX_BUDGET: 10000,
  DEFAULT_REGION: 'Global'
};

// Categories for deals
export const CATEGORIES = [
  { value: 'Electronics', label: 'Electronics', icon: '📱', color: 'blue' },
  { value: 'Travel', label: 'Travel', icon: '✈️', color: 'green' },
  { value: 'Fashion', label: 'Fashion', icon: '👕', color: 'purple' },
  { value: 'Home', label: 'Home & Garden', icon: '🏠', color: 'orange' },
  { value: 'Sports', label: 'Sports & Outdoors', icon: '⚽', color: 'red' },
  { value: 'Books', label: 'Books & Media', icon: '📚', color: 'indigo' }
];

// Regions for deals
export const REGIONS = [
  { value: 'Korea', label: 'South Korea', flag: '🇰🇷', code: 'KR' },
  { value: 'US', label: 'United States', flag: '🇺🇸', code: 'US' },
  { value: 'Japan', label: 'Japan', flag: '🇯🇵', code: 'JP' },
  { value: 'UK', label: 'United Kingdom', flag: '🇬🇧', code: 'GB' },
  { value: 'Germany', label: 'Germany', flag: '🇩🇪', code: 'DE' },
  { value: 'Global', label: 'Global (Any Region)', flag: '🌍', code: 'GLOBAL' }
];

// Platform configuration
export const PLATFORMS = {
  AMAZON: 'Amazon',
  EXPEDIA: 'Expedia',
  BOOKING: 'Booking.com',
  EBAY: 'eBay',
  ALIEXPRESS: 'AliExpress'
};

// Affiliate commission rates (percentage)
export const COMMISSION_RATES = {
  [PLATFORMS.AMAZON]: 4.0, // 4% commission
  [PLATFORMS.EXPEDIA]: 6.0, // 6% commission
  [PLATFORMS.BOOKING]: 5.0, // 5% commission
  [PLATFORMS.EBAY]: 3.0,    // 3% commission
  [PLATFORMS.ALIEXPRESS]: 2.0 // 2% commission
};

// Subscription plans
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['5 searches per month', 'Basic deal matching', 'Email notifications']
  },
  BASIC: {
    name: 'Basic',
    price: 5,
    features: ['Unlimited searches', 'Advanced AI matching', 'Priority notifications', 'Deal alerts']
  },
  PRO: {
    name: 'Pro',
    price: 15,
    features: ['Everything in Basic', 'Price history tracking', 'Custom deal alerts', 'Export data']
  }
};

// API endpoints (for future use)
export const API_ENDPOINTS = {
  DEALS: '/api/deals',
  QUIZ: '/api/quiz',
  ANALYTICS: '/api/analytics',
  SUBSCRIPTION: '/api/subscription'
};

// Error messages
export const ERROR_MESSAGES = {
  QUIZ_SUBMISSION: 'Error submitting quiz. Please try again.',
  DEAL_LOADING: 'Error loading deals. Please refresh the page.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  AUTH_ERROR: 'Authentication error. Please log in again.',
  GENERAL_ERROR: 'Something went wrong. Please try again.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  QUIZ_SUBMITTED: 'Quiz submitted successfully!',
  DEAL_COPIED: 'Deal link copied to clipboard!',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully!'
};

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'gpp_user_preferences',
  QUIZ_HISTORY: 'gpp_quiz_history',
  THEME: 'gpp_theme'
};

// Analytics event names
export const ANALYTICS_EVENTS = {
  QUIZ_STARTED: 'quiz_started',
  QUIZ_COMPLETED: 'quiz_completed',
  DEAL_CLICKED: 'deal_clicked',
  DEAL_SHARED: 'deal_shared',
  SUBSCRIPTION_INTEREST: 'subscription_interest',
  PAGE_VIEW: 'page_view',
  ERROR: 'error'
};

// Performance thresholds
export const PERFORMANCE = {
  MAX_LOAD_TIME: 3000, // 3 seconds
  MAX_QUIZ_TIME: 60000, // 1 minute
  MIN_DEAL_COUNT: 3,
  MAX_DEAL_COUNT: 20
};

// SEO keywords
export const SEO_KEYWORDS = [
  'global deals',
  'price comparison',
  'cross-border shopping',
  'AI deals',
  'international shopping',
  'best prices',
  'global markets',
  'travel deals',
  'electronics deals'
]; 