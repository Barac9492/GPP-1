import React, { useState } from 'react';
import { ArrowLeft, Search, BookOpen, Settings, CreditCard, Shield, Globe, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen },
    { id: 'getting-started', name: 'Getting Started', icon: Zap },
    { id: 'account', name: 'Account & Settings', icon: Settings },
    { id: 'billing', name: 'Billing & Subscriptions', icon: CreditCard },
    { id: 'privacy', name: 'Privacy & Security', icon: Shield },
    { id: 'deals', name: 'Deals & Shopping', icon: Globe }
  ];

  const articles = [
    {
      id: 1,
      title: "How to Complete Your First Quiz",
      category: "getting-started",
      content: "Learn how to use our 1-minute quiz to find the best global deals. We'll walk you through each step and show you how to get the most accurate results.",
      tags: ["quiz", "first-time", "tutorial"]
    },
    {
      id: 2,
      title: "Understanding Your Dashboard",
      category: "getting-started",
      content: "Your dashboard shows matched deals based on your preferences. Learn how to read deal information, understand savings calculations, and use affiliate links.",
      tags: ["dashboard", "deals", "savings"]
    },
    {
      id: 3,
      title: "Creating and Managing Your Account",
      category: "account",
      content: "Step-by-step guide to creating an account, updating your profile, managing preferences, and accessing your account settings.",
      tags: ["account", "profile", "settings"]
    },
    {
      id: 4,
      title: "Subscription Plans and Features",
      category: "billing",
      content: "Compare our free and premium subscription plans. Learn about features like unlimited searches, price history tracking, and custom deal alerts.",
      tags: ["subscription", "premium", "features"]
    },
    {
      id: 5,
      title: "Payment Methods and Billing",
      category: "billing",
      content: "Information about accepted payment methods, billing cycles, invoice access, and how to update your payment information.",
      tags: ["payment", "billing", "invoices"]
    },
    {
      id: 6,
      title: "Data Privacy and Security",
      category: "privacy",
      content: "Learn how we protect your personal information, what data we collect, how we use it, and your rights regarding your data.",
      tags: ["privacy", "security", "data"]
    },
         {
       id: 7,
       title: "How Affiliate Links Work",
       category: "deals",
       content: "Learn about our affiliate program, how commission rates work, and how clicking affiliate links helps support our service.",
       tags: ["affiliate", "commissions", "links"]
     },
    {
      id: 8,
      title: "Troubleshooting Common Issues",
      category: "getting-started",
      content: "Solutions for common problems like quiz not loading, deals not appearing, account access issues, and technical difficulties.",
      tags: ["troubleshooting", "problems", "support"]
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">
            Find answers to common questions and learn how to get the most out of Global Price Pulse
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    selectedCategory === category.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{category.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Getting Started Guide", link: "#", description: "New user? Start here" },
              { title: "Account Settings", link: "#", description: "Manage your profile" },
              { title: "Billing & Subscriptions", link: "#", description: "Payment information" },
              { title: "Contact Support", link: "/contact", description: "Get help from our team" }
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Articles'}
          </h2>
          
          {filteredArticles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or browse our categories instead.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clear search and show all articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
                <div key={article.id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {categories.find(cat => cat.id === article.category)?.name}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{article.content}</p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Read full article →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Video Tutorials */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Getting Started with Global Price Pulse",
                duration: "3:45",
                thumbnail: "🎥",
                description: "Complete walkthrough of your first quiz and dashboard"
              },
              {
                title: "Understanding Your Deal Results",
                duration: "2:30",
                thumbnail: "📊",
                description: "Learn how to read and compare deal information"
              },
              {
                title: "Managing Your Account Settings",
                duration: "4:15",
                thumbnail: "⚙️",
                description: "How to update preferences and subscription settings"
              }
            ].map((video, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="text-4xl mb-3">{video.thumbnail}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{video.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{video.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{video.duration}</span>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Watch Video →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                question: "How accurate are the deal recommendations?",
                answer: "Our AI algorithm analyzes millions of data points to provide highly accurate recommendations. We continuously monitor and update our data to ensure the best possible matches for your preferences."
              },
              {
                question: "Can I use Global Price Pulse without creating an account?",
                answer: "Yes! You can complete the quiz and view deals without an account. However, creating an account allows you to save preferences, track your savings, and access premium features."
              },
              {
                question: "How do I know if a deal is still available?",
                answer: "We update our deal database in real-time, but prices and availability can change quickly. Always verify the current price and availability on the retailer's website before making a purchase."
              },
              {
                question: "What if I'm not satisfied with my subscription?",
                answer: "We offer a 30-day money-back guarantee for all premium subscriptions. If you're not completely satisfied, contact our support team for a full refund."
              }
            ].map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-6 opacity-90">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-sm opacity-90">support@globalpricepulse.com</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm opacity-90">Available during business hours</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Response Time</h3>
              <p className="text-sm opacity-90">Within 24 hours</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter; 