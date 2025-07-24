import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">Last updated: January 15, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing and using Global Price Pulse ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-gray-700">
                Global Price Pulse is operated by Global Price Pulse ("we," "us," or "our"), a cross-border price comparison platform that uses AI technology to match users with personalized deals across global markets.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Global Price Pulse provides an AI-powered platform that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Analyzes user preferences through a 1-minute quiz</li>
                <li>Matches users with personalized deals across global markets</li>
                <li>Provides affiliate links to third-party retailers</li>
                <li>Offers subscription services for enhanced features</li>
                <li>Facilitates cross-border price comparisons</li>
              </ul>
              <p className="text-gray-700">
                Our service covers various categories including electronics, travel, fashion, home & garden, sports, and books & media across multiple regions including South Korea, United States, Japan, United Kingdom, Germany, and global markets.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-700 mb-4">
                To access certain features of our Service, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and update your account information</li>
                <li>Keep your account credentials secure</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
              <p className="text-gray-700">
                We reserve the right to terminate accounts that violate these terms or are inactive for extended periods.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <p className="text-gray-700 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon intellectual property rights</li>
                <li>Transmit harmful, offensive, or inappropriate content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the Service</li>
                <li>Use automated tools to access the Service without permission</li>
                <li>Engage in fraudulent activities or misrepresentation</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Affiliate Marketing and Commissions</h2>
              <p className="text-gray-700 mb-4">
                Global Price Pulse participates in affiliate marketing programs with various retailers including Amazon, Expedia, Booking.com, eBay, and AliExpress. When you click on affiliate links and make purchases, we may earn commissions.
              </p>
              <p className="text-gray-700 mb-4">
                Important information about affiliate relationships:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>We receive commissions from qualifying purchases made through our affiliate links</li>
                <li>Commission rates vary by retailer and product category (typically 1-10% of sale value)</li>
                <li>Your purchase price is not affected by our affiliate relationships</li>
                <li>We strive to recommend the best deals regardless of commission rates</li>
                <li>All affiliate links are clearly marked and disclosed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Subscription Services</h2>
              <p className="text-gray-700 mb-4">
                We offer subscription plans with enhanced features:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Basic Plan ($5/month):</strong> Unlimited searches, advanced AI matching, priority notifications, deal alerts</li>
                <li><strong>Pro Plan ($15/month):</strong> Everything in Basic plus price history tracking, custom deal alerts, data export</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Subscription terms:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Subscriptions are billed monthly in advance</li>
                <li>You may cancel at any time through your account settings</li>
                <li>No refunds for partial months</li>
                <li>We may change subscription prices with 30 days notice</li>
                <li>Failed payments may result in service suspension</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-gray-700">
                We comply with applicable data protection laws including GDPR for European users and implement appropriate security measures to protect your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The Service and its original content, features, and functionality are owned by Global Price Pulse and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-700">
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service without our prior written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers and Limitations</h2>
              <p className="text-gray-700 mb-4">
                The Service is provided "as is" and "as available" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Accuracy of deal information and pricing</li>
                <li>Availability of products or services</li>
                <li>Quality of third-party retailers</li>
                <li>Uninterrupted or error-free service</li>
                <li>Compatibility with all devices or browsers</li>
              </ul>
              <p className="text-gray-700">
                We are not responsible for transactions between you and third-party retailers, including shipping, returns, warranties, or customer service issues.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                In no event shall Global Price Pulse be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers</li>
                <li>Any interruption or cessation of transmission to or from the Service</li>
                <li>Any bugs, viruses, or other harmful code</li>
                <li>Any errors or omissions in any content or for any loss or damage incurred</li>
              </ul>
              <p className="text-gray-700">
                Our total liability to you for any claims arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="text-gray-700">
                You agree to defend, indemnify, and hold harmless Global Price Pulse and its affiliates from and against any claims, damages, obligations, losses, liabilities, costs, or debt arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including breach of these Terms.
              </p>
              <p className="text-gray-700">
                Upon termination, your right to use the Service will cease immediately. All provisions of these Terms which by their nature should survive termination shall survive termination.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of South Korea, without regard to its conflict of law provisions.
              </p>
              <p className="text-gray-700">
                Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in Seoul, South Korea, in accordance with the rules of the Korean Commercial Arbitration Board.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Posting the updated Terms on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying in-app notifications</li>
              </ul>
              <p className="text-gray-700">
                Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Global Price Pulse</strong><br />
                  Email: legal@globalpricepulse.com<br />
                  Address: [Business Address]<br />
                  Phone: [Contact Number]
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Severability</h2>
              <p className="text-gray-700">
                If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced to the fullest extent under law.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-600">
                These Terms of Service constitute the entire agreement between you and Global Price Pulse regarding the use of our Service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 