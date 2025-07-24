import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingUp, Globe, DollarSign, Sparkles, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="mb-20">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200 mb-8 text-lg font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            Welcome to Your
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl leading-relaxed">
            Explore personalized arbitrage opportunities based on your preferences
          </p>
        </div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 rounded-3xl p-12 mb-20 border border-slate-200"
        >
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Setup Complete!</h2>
              <p className="text-slate-600 text-lg mt-2">Your preferences have been saved</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center p-6 bg-white rounded-2xl border border-slate-200">
              <Globe className="w-6 h-6 text-blue-600 mr-4" />
              <div>
                <p className="text-sm text-slate-600 font-medium">Shopping Direction</p>
                <p className="text-lg font-semibold text-slate-900">US → Korea</p>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white rounded-2xl border border-slate-200">
              <DollarSign className="w-6 h-6 text-green-600 mr-4" />
              <div>
                <p className="text-sm text-slate-600 font-medium">Budget Range</p>
                <p className="text-lg font-semibold text-slate-900">$50 - $100</p>
              </div>
            </div>
            <div className="flex items-center p-6 bg-white rounded-2xl border border-slate-200">
              <TrendingUp className="w-6 h-6 text-purple-600 mr-4" />
              <div>
                <p className="text-sm text-slate-600 font-medium">Shopping Frequency</p>
                <p className="text-lg font-semibold text-slate-900">Monthly</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] border border-slate-200"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Latest Deals</h3>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">Discover today's best arbitrage opportunities</p>
            <button className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-slate-800 transition-colors duration-200 shadow-lg hover:shadow-xl">
              View Deals
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] border border-slate-200"
          >
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Price Tracking</h3>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">Track specific products across markets</p>
            <button className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-slate-800 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Track Prices
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer group hover:scale-[1.02] border border-slate-200"
          >
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Savings Calculator</h3>
            <p className="text-slate-600 mb-6 text-lg leading-relaxed">Calculate potential savings on purchases</p>
            <button className="w-full bg-slate-900 text-white py-4 px-6 rounded-2xl font-semibold hover:bg-slate-800 transition-colors duration-200 shadow-lg hover:shadow-xl">
              Calculate
            </button>
          </motion.div>
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 rounded-3xl p-12 text-white shadow-2xl"
        >
          <div className="text-center">
            <h3 className="text-4xl font-bold mb-6 tracking-tight">Stay Updated</h3>
            <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
              Get weekly arbitrage alerts and exclusive deals delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-2xl text-slate-900 focus:outline-none focus:ring-4 focus:ring-white/20 text-lg"
              />
              <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-semibold hover:bg-slate-100 transition-colors duration-200 shadow-lg hover:shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 