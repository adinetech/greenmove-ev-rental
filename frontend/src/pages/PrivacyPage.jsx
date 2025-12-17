import { motion } from 'framer-motion';
import { Shield, Lock, Eye, UserX, FileText } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: January 2025</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card space-y-8"
        >
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At GreenMove Technologies Pvt. Ltd., we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our electric vehicle rental service.
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Billing address for invoice generation</li>
                  <li>Account credentials (encrypted passwords)</li>
                  <li>Profile preferences and settings</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Usage Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Ride history including start/end locations</li>
                  <li>Vehicle usage patterns and duration</li>
                  <li>Payment and wallet transaction history</li>
                  <li>Reward points and cashback earned</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Location Data</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Real-time location during active rides</li>
                  <li>Station and vehicle locations for service delivery</li>
                  <li>Route information for fare calculation</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide and maintain our vehicle rental service</li>
              <li>Process payments and generate invoices</li>
              <li>Calculate fares based on distance and duration</li>
              <li>Track environmental impact (CO2 savings)</li>
              <li>Manage reward points and cashback programs</li>
              <li>Send service notifications and updates</li>
              <li>Improve our services and user experience</li>
              <li>Prevent fraud and ensure security</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>We implement industry-standard security measures to protect your personal information:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Password encryption using bcrypt hashing</li>
                <li>JWT-based authentication for secure sessions</li>
                <li>HTTPS encryption for all data transmission</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
              </ul>
              <p className="text-sm text-gray-600 italic mt-4">
                However, no method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
            <div className="space-y-3 text-gray-700">
              <p>We do not sell your personal information. We may share data with:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Service Providers:</strong> Third-party services that help us operate (hosting, analytics)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserX className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>You have the following rights regarding your personal data:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Access:</strong> View your personal information at any time</li>
                <li><strong>Update:</strong> Modify your profile and address information</li>
                <li><strong>Delete:</strong> Request account deletion (removes all data permanently)</li>
                <li><strong>Export:</strong> Download your ride history as invoices</li>
                <li><strong>Opt-out:</strong> Unsubscribe from promotional communications</li>
              </ul>
              <p className="text-sm mt-4">
                To exercise these rights, visit your Profile page or contact us at{' '}
                <a href="mailto:support@greenmove.com" className="text-primary-600 hover:underline">
                  support@greenmove.com
                </a>
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700">
              We retain your personal information for as long as your account is active or as needed to provide services. 
              When you delete your account, we permanently remove all your data including ride history, wallet balance, 
              and reward points within 30 days. Some information may be retained for legal compliance purposes.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-700">
              Our service is not intended for users under 18 years of age. We do not knowingly collect information from 
              children. If you believe we have collected data from a minor, please contact us immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting 
              the new policy on this page and updating the "Last updated" date. Continued use of our service after changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="space-y-2 text-gray-700">
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <div className="space-y-1">
                <p><strong>Email:</strong> <a href="mailto:support@greenmove.com" className="text-primary-600 hover:underline">support@greenmove.com</a></p>
                <p><strong>Address:</strong> B301, Vidyulata Prince Palace CHS, Kharghar, Navi Mumbai - 410210</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPage;
