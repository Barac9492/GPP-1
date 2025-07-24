import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Quiz from './components/Quiz.tsx';
import Dashboard from './components/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import HelpCenter from './pages/HelpCenter';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import DebugConnection from './components/DebugConnection';
import NewsletterSignup from './components/NewsletterSignup';
import ArbitrageReport from './components/ArbitrageReport';
import { ProfessionalHero, UserTypeCards } from './components/ProfessionalHero.tsx';
import { Globe, Zap, TrendingUp, ArrowRight, CheckCircle, Star, MapPin, Clock, DollarSign, Shield, Users, Award, Sparkles, X, Languages } from 'lucide-react';
import PriceChart from './components/PriceChart';
import Products from './pages/Products';
import { auth, functions } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { translations } from './translations';

const AppContent: React.FC = () => {
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState<boolean>(false);
  const { language, toggleLanguage, isKorean } = useLanguage();

  const t = translations[language];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setFirebaseInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const openQuizModal = () => {
    setShowQuizModal(true);
  };

  const closeQuizModal = () => {
    setShowQuizModal(false);
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setShowQuizModal(false);
    // Redirect to dashboard after a short delay
    setTimeout(() => {
      window.location.hash = '#/dashboard';
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <header className="w-full bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold text-slate-900 tracking-tight">Global Price Pulse</span>
          </Link>
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-slate-700 hover:text-slate-900 font-medium">{t.home}</Link>
              <Link to="/about" className="text-slate-700 hover:text-slate-900 font-medium">{t.about}</Link>
              <Link to="/arbitrage" className="text-slate-700 hover:text-slate-900 font-medium">{t.reports}</Link>
              <Link to="/products" className="text-slate-700 hover:text-slate-900 font-medium">{t.products}</Link>
              <Link to="/contact" className="text-slate-700 hover:text-slate-900 font-medium">{t.contact}</Link>
            </nav>
            
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors px-2 py-1 rounded border border-gray-200 hover:border-gray-300"
              title={isKorean ? 'Switch to English' : '한국어로 변경'}
            >
              <Languages className="w-4 h-4" />
              <span>{isKorean ? 'EN' : '한'}</span>
            </button>
            
            {/* Login/logout button */}
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user.displayName || user.email}{t.welcome}</span>
                <button 
                  onClick={handleLogout} 
                  className="bg-gray-100 text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition text-sm font-semibold"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <button 
                onClick={handleLogin} 
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm font-semibold shadow"
              >
                {t.signUpSignIn}
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* Rest of the component remains the same */}
      <Routes>
        <Route path="/" element={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            {/* Professional Hero Section */}
            <ProfessionalHero onStartSearch={openQuizModal} />
            
            {/* User Type Cards */}
            <UserTypeCards />

            {/* Newsletter Signup */}
            <div className="mt-20 text-center">
              <NewsletterSignup />
            </div>

            {/* Footer */}
            <footer className="mt-20 border-t border-slate-200 pt-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Global Price Pulse</h3>
                    <p className="text-slate-600 text-sm">
                      Find the best prices across borders. Save money on international purchases.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li><Link to="/about" className="hover:text-slate-900">{t.about}</Link></li>
                      <li><Link to="/products" className="hover:text-slate-900">{t.products}</Link></li>
                      <li><Link to="/contact" className="hover:text-slate-900">{t.contact}</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Support</h4>
                    <ul className="space-y-2 text-sm text-slate-600">
                      <li><Link to="/help" className="hover:text-slate-900">Help Center</Link></li>
                      <li><Link to="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
                      <li><Link to="/terms" className="hover:text-slate-900">Terms of Service</Link></li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-4">Connect</h4>
                    <div className="flex space-x-4">
                      <a href="#" className="text-slate-400 hover:text-slate-600">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="text-slate-400 hover:text-slate-600">
                        <span className="sr-only">GitHub</span>
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <p className="text-sm text-slate-400 text-center">
                    © 2024 Global Price Pulse. All rights reserved.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        } />
        
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<HelpCenter />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/products" element={<Products />} />
        <Route path="/arbitrage" element={<ArbitrageReport />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/debug" element={<DebugConnection />} />
      </Routes>

      {/* Quiz Modal */}
      {showQuizModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <Quiz 
              isOpen={showQuizModal}
              onComplete={handleQuizComplete} 
              onClose={closeQuizModal} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App; 