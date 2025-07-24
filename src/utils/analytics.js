import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * Track user interactions for business intelligence
 * Anti-Spaghetti: Modular analytics functions
 */
export const trackEvent = async (eventName, eventData = {}) => {
  try {
    await addDoc(collection(db, 'analytics'), {
      event: eventName,
      ...eventData,
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

/**
 * Track quiz completion
 */
export const trackQuizCompletion = async (quizData) => {
  await trackEvent('quiz_completed', {
    item: quizData.item,
    category: quizData.category,
    budget: quizData.budget,
    region: quizData.region,
    hasEmail: !!quizData.email
  });
};

/**
 * Track deal click
 */
export const trackDealClick = async (deal, userId) => {
  await trackEvent('deal_clicked', {
    dealId: deal.id,
    item: deal.item,
    platform: deal.platform,
    price: deal.price,
    originalPrice: deal.originalPrice,
    userId
  });
};

/**
 * Track share action
 */
export const trackShare = async (deal, platform) => {
  await trackEvent('deal_shared', {
    dealId: deal.id,
    item: deal.item,
    platform,
    savings: deal.originalPrice - deal.price
  });
};

/**
 * Track subscription interest
 */
export const trackSubscriptionInterest = async (plan = 'basic') => {
  await trackEvent('subscription_interest', {
    plan,
    source: 'dashboard_cta'
  });
};

/**
 * Track page view
 */
export const trackPageView = async (pageName) => {
  await trackEvent('page_view', {
    page: pageName
  });
};

/**
 * Track error
 */
export const trackError = async (error, context) => {
  await trackEvent('error', {
    message: error.message,
    stack: error.stack,
    context
  });
}; 