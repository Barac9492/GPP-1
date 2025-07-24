import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, TrendingUp, DollarSign } from "lucide-react";

interface ProfessionalHeroProps {
  onStartSearch?: () => void;
}

export const ProfessionalHero: React.FC<ProfessionalHeroProps> = ({ onStartSearch }) => {
  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-20 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Main Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-7xl md:text-8xl lg:text-9xl font-bold text-center text-slate-900 mb-8 leading-[0.85] tracking-tight"
        >
          Global Price
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Pulse
          </span>
        </motion.h1>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-2xl md:text-3xl text-slate-600 max-w-4xl mx-auto mb-16 leading-relaxed font-light"
        >
          AI-powered arbitrage alerts for smart global shoppers
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
          <div className="flex items-center space-x-3 bg-slate-100 px-6 py-3 rounded-full">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-slate-700 font-medium">Korea ↔ US</span>
          </div>
          <div className="flex items-center space-x-3 bg-slate-100 px-6 py-3 rounded-full">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-slate-700 font-medium">20-50% Savings</span>
          </div>
          <div className="flex items-center space-x-3 bg-slate-100 px-6 py-3 rounded-full">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <span className="text-slate-700 font-medium">AI-Powered</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStartSearch}
          className="bg-slate-900 text-white px-12 py-6 rounded-2xl font-semibold text-xl hover:bg-slate-800 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center mx-auto cursor-pointer group"
        >
          Start Your Search
          <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
        </motion.button>

        {/* Additional Info */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="text-slate-500 text-lg mt-8 font-light"
        >
          Free to start • No credit card required
        </motion.p>
      </motion.div>
    </div>
  );
};

export const UserTypeCards = () => {
  return (
    <div className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-8 tracking-tight">
            Two Markets.
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              One Platform.
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Whether you're shopping from the US to Korea or vice versa, we've got you covered with AI-powered price monitoring.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="group relative"
          >
            <div className="bg-white rounded-3xl p-12 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-slate-200">
              <div className="text-6xl mb-8">🇺🇸 → 🇰🇷</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">US Consumers</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Buy Korean cosmetics directly from Korea. Save 30-50% on K-beauty products with our AI-powered price tracking.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">COSRX Snail Mucin Essence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Laneige Water Sleeping Mask</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Innisfree Green Tea Serum</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="group relative"
          >
            <div className="bg-white rounded-3xl p-12 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-slate-200">
              <div className="text-6xl mb-8">🇰🇷 → 🇺🇸</div>
              <h3 className="text-3xl font-bold text-slate-900 mb-6">Korean Consumers</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Buy US IT products directly from the US. Save 20-40% on Apple, Samsung, and other premium tech products.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">iPhone 15 Pro</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">MacBook Pro M3</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Samsung Galaxy S24</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 