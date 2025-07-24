import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">Last updated: January 15, 2025</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Global Price Pulse ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered cross-border price comparison platform.
              </p>
              <p className="text-gray-700">
                By using our Service, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-4">
                We may collect the following personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Account Information:</strong> Email address, name, and password when you create an account</li>
                <li><strong>Quiz Responses:</strong> Product preferences, budget information, regional preferences</li>
                <li><strong>Usage Data:</strong> Search queries, deal interactions, affiliate link clicks</li>
                <li><strong>Communication Data:</strong> Email correspondence, support requests</li>
                <li><strong>Payment Information:</strong> Subscription payment details (processed securely by third-party providers)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Automatically Collected Information</h3>
              <p className="text-gray-700 mb-4">
                We automatically collect certain information when you use our Service:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Analytics:</strong> Pages visited, time spent, features used, error logs</li>
                <li><strong>Location Data:</strong> General location information (country/region level) for regional deal matching</li>
                <li><strong>Cookies and Similar Technologies:</strong> Session data, preferences, authentication tokens</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Third-Party Information</h3>
              <p className="text-gray-700">
                We may receive information from third-party services including:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Affiliate networks (Amazon Associates, Expedia Affiliate Network, etc.)</li>
                <li>Analytics providers (Google Analytics, Firebase Analytics)</li>
                <li>Payment processors (Stripe, PayPal)</li>
                <li>Social media platforms (when you share deals)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Service Provision:</strong> To provide and maintain our AI-powered deal matching service</li>
                <li><strong>Personalization:</strong> To match you with relevant deals based on your preferences</li>
                <li><strong>Account Management:</strong> To create and manage your account, process subscriptions</li>
                <li><strong>Communication:</strong> To send deal alerts, updates, and respond to inquiries</li>
                <li><strong>Analytics:</strong> To improve our service, analyze usage patterns, and optimize performance</li>
                <li><strong>Security:</strong> To protect against fraud, abuse, and unauthorized access</li>
                <li><strong>Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                <li><strong>Marketing:</strong> To send promotional content (with your consent)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Service Providers</h3>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Cloud hosting and infrastructure providers (Firebase, Google Cloud)</li>
                <li>Analytics and monitoring services</li>
                <li>Payment processing services</li>
                <li>Email and communication services</li>
                <li>Customer support platforms</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Affiliate Partners</h3>
              <p className="text-gray-700 mb-4">
                When you click on affiliate links, we may share limited information (such as referral codes) with our affiliate partners to track commissions and ensure proper attribution.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Legal Requirements</h3>
              <p className="text-gray-700 mb-4">
                We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.4 Business Transfers</h3>
              <p className="text-gray-700">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication and access controls</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal information on a need-to-know basis</li>
                <li>Secure data centers and infrastructure</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="text-gray-700">
                However, no method of transmission over the internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 mb-4">
                We retain your personal information for as long as necessary to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our services</li>
              </ul>
              <p className="text-gray-700 mb-4">
                Specific retention periods:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Account Data:</strong> Retained while your account is active, deleted 30 days after account deletion</li>
                <li><strong>Usage Analytics:</strong> Retained for 2 years for service improvement</li>
                <li><strong>Payment Information:</strong> Retained as required by payment processors and tax laws</li>
                <li><strong>Communication Records:</strong> Retained for 3 years for customer support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Access and Control</h3>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain processing activities</li>
                <li>Withdraw consent for marketing communications</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Marketing Preferences</h3>
              <p className="text-gray-700 mb-4">
                You can control marketing communications by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Unsubscribing from email communications</li>
                <li>Updating your notification preferences in your account</li>
                <li>Contacting us directly to opt out</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.3 Cookies and Tracking</h3>
              <p className="text-gray-700">
                You can control cookies through your browser settings. However, disabling certain cookies may affect the functionality of our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Standard Contractual Clauses (SCCs) for EU data transfers</li>
                <li>Adequacy decisions where applicable</li>
                <li>Certification schemes and codes of conduct</li>
                <li>Other appropriate safeguards as required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
              <p className="text-gray-700">
                If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our Service may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties.
              </p>
              <p className="text-gray-700">
                When you click on affiliate links or use third-party services, their privacy policies will govern the collection and use of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. GDPR Compliance (EU Users)</h2>
              <p className="text-gray-700 mb-4">
                For users in the European Union, you have additional rights under the General Data Protection Regulation (GDPR):
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Right to Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to Restriction:</strong> Limit how we process your data</li>
                <li><strong>Right to Object:</strong> Object to certain types of processing</li>
                <li><strong>Right to Lodge a Complaint:</strong> Contact your local data protection authority</li>
              </ul>
              <p className="text-gray-700">
                Our legal basis for processing your data includes consent, contract performance, legitimate interests, and legal obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. CCPA Compliance (California Users)</h2>
              <p className="text-gray-700 mb-4">
                For California residents, you have rights under the California Consumer Privacy Act (CCPA):
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Right to know what personal information we collect and how we use it</li>
                <li>Right to delete your personal information</li>
                <li>Right to opt out of the sale of personal information</li>
                <li>Right to non-discrimination for exercising your rights</li>
              </ul>
              <p className="text-gray-700">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Posting the updated policy on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying in-app notifications</li>
                <li>Updating the "Last updated" date</li>
              </ul>
              <p className="text-gray-700">
                Your continued use of our Service after such changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  <strong>Global Price Pulse</strong><br />
                  Email: privacy@globalpricepulse.com<br />
                  Address: [Business Address]<br />
                  Phone: [Contact Number]<br />
                  <br />
                  <strong>Data Protection Officer:</strong><br />
                  Email: dpo@globalpricepulse.com
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Cookie Policy</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li><strong>Essential Cookies:</strong> Required for basic functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how you use our Service</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
              </ul>
              <p className="text-gray-700">
                You can manage cookie preferences through your browser settings or our cookie consent banner.
              </p>
            </section>

            <div className="border-t border-gray-200 pt-8 mt-8">
              <p className="text-sm text-gray-600">
                This Privacy Policy is effective as of the date listed above and applies to all users of Global Price Pulse.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 