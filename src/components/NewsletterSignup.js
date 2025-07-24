import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { CheckCircle, AlertCircle } from 'lucide-react';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email: email.toLowerCase(),
        timestamp: serverTimestamp(),
        source: 'landing_page',
        status: 'active'
      });

      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-3xl p-8 border border-emerald-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-4">
        Get Weekly T-Alerts! 🎯
      </h3>
      <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
        Don't let tariffs trump your wallet! Get AI-curated arbitrage opportunities delivered weekly. 
        Treasure the deals, triumph over inflation! 💰
      </p>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
          disabled={isSubmitting}
        />
        <button 
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe Free'}
        </button>
      </form>
      
      {isSuccess && (
        <div className="mt-4 flex items-center justify-center text-emerald-600">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Successfully subscribed!</span>
        </div>
      )}
      
      {error && (
        <div className="mt-4 flex items-center justify-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}
      
      <p className="text-xs text-slate-500 mt-3">
        Free weekly tips • No spam • Unsubscribe anytime
      </p>
    </div>
  );
};

export default NewsletterSignup; 