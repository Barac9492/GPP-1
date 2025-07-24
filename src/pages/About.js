import React from 'react';
import { ArrowLeft, Globe, Zap, TrendingUp, Shield, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Global Price Pulse</h1>
          <p className="text-xl text-gray-600">
            Revolutionizing cross-border shopping with AI-powered price comparison
          </p>
        </div>

        {/* Mission Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center mb-8">
            <Globe className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              To democratize global shopping by making cross-border price comparison accessible, 
              intelligent, and profitable for consumers worldwide. We believe everyone deserves 
              to find the best deals, regardless of where they live.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">$500+</div>
            <div className="text-gray-600">Average Savings per User</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
            <div className="text-gray-600">Global Markets Covered</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">1 min</div>
            <div className="text-gray-600">Quiz Completion Time</div>
          </div>
        </section>

        {/* Story Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The Problem</h3>
              <p className="text-gray-700 mb-4">
                In today's globalized world, consumers often miss out on significant savings 
                because they don't know where to look or how to compare prices across borders. 
                Traditional price comparison tools are limited to local markets, leaving 
                international deals undiscovered.
              </p>
              <p className="text-gray-700">
                We recognized that the average consumer could save hundreds or even thousands 
                of dollars by shopping globally, but the process was too complex and time-consuming.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">The Solution</h3>
              <p className="text-gray-700 mb-4">
                Global Price Pulse was born from the idea that AI could revolutionize how people 
                discover and compare global deals. Our 1-minute quiz captures your preferences, 
                and our intelligent algorithm matches you with the best deals across multiple markets.
              </p>
              <p className="text-gray-700">
                We've built a platform that makes cross-border shopping as simple as answering 
                a few questions, while ensuring you get the best possible prices and deals.
              </p>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Technology</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
              <p className="text-gray-700">
                Advanced algorithms analyze your preferences and match you with the most relevant 
                deals across global markets in real-time.
              </p>
            </div>
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Data</h3>
              <p className="text-gray-700">
                Continuous monitoring of prices across multiple retailers and markets to ensure 
                you always get the most current deals.
              </p>
            </div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-700">
                Enterprise-grade security with end-to-end encryption and GDPR compliance to 
                protect your data and privacy.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Team</h2>
          <p className="text-gray-700 mb-6">
            Global Price Pulse is built by a team of international experts with deep experience 
            in e-commerce, AI, and cross-border commerce. Our diverse background spans:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Leadership</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• Experienced professionals from major tech companies</li>
                <li>• Background in venture capital and strategic partnerships</li>
                <li>• Deep understanding of global markets and consumer behavior</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Expertise</h3>
              <ul className="text-gray-700 space-y-2">
                <li>• AI/ML specialists with focus on recommendation systems</li>
                <li>• E-commerce and affiliate marketing experts</li>
                <li>• International business and cross-border commerce</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">User-First</h3>
              <p className="text-gray-700">
                Every decision we make is driven by what's best for our users. We prioritize 
                your savings and experience above all else.
              </p>
            </div>
            <div className="text-center">
              <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-700">
                We strive for excellence in everything we do, from the accuracy of our deals 
                to the quality of our user experience.
              </p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Perspective</h3>
              <p className="text-gray-700">
                We think globally and act locally, understanding the unique needs of consumers 
                in different markets and regions.
              </p>
            </div>
          </div>
        </section>

        {/* Markets Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Global Markets We Cover</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'South Korea', flag: '🇰🇷', savings: '$300-800' },
              { name: 'United States', flag: '🇺🇸', savings: '$200-600' },
              { name: 'Japan', flag: '🇯🇵', savings: '$400-1000' },
              { name: 'United Kingdom', flag: '🇬🇧', savings: '$150-500' },
              { name: 'Germany', flag: '🇩🇪', savings: '$200-600' },
              { name: 'Global', flag: '🌍', savings: '$100-2000' }
            ].map((market, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-2">{market.flag}</div>
                <div className="font-semibold text-gray-900">{market.name}</div>
                <div className="text-sm text-gray-600">Avg. savings: {market.savings}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Market Coverage Section */}
        <section className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Global Market Coverage</h2>
          <p className="text-gray-700 mb-6">
            Our AI analyzes prices from major retailers and e-commerce platforms worldwide to provide you with comprehensive price comparisons:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              'Amazon', 'Expedia', 'Booking.com', 'eBay', 'AliExpress',
              'Best Buy', 'Target', 'Walmart', 'Newegg', 'Rakuten'
            ].map((platform, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">{platform}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-sm p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-xl mb-6 opacity-90">
            Join thousands of users who are already saving money with Global Price Pulse
          </p>
          <Link 
            to="/" 
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Your Quiz
          </Link>
        </section>

        {/* Contact Section */}
        <section className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3 text-gray-700">
                <p><strong>Email:</strong> hello@globalpricepulse.com</p>
                <p><strong>Support:</strong> support@globalpricepulse.com</p>
                <p><strong>Business:</strong> partnerships@globalpricepulse.com</p>
                <p><strong>Address:</strong> [Business Address]</p>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Follow Us</h3>
              <div className="space-y-2 text-gray-700">
                <p>• LinkedIn: Global Price Pulse</p>
                <p>• Twitter: @GlobalPricePulse</p>
                <p>• Instagram: @globalpricepulse</p>
                <p>• YouTube: Global Price Pulse</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 