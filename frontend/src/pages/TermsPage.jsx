import { motion } from 'framer-motion';
import { FileText, AlertCircle, UserCheck, Shield, Ban } from 'lucide-react';

const TermsPage = () => {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
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
              Welcome to GreenMove! These Terms of Service ("Terms") govern your use of our electric vehicle rental 
              platform operated by GreenMove Technologies Pvt. Ltd. By accessing or using our service, you agree to be 
              bound by these Terms.
            </p>
          </section>

          {/* Acceptance */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>By creating an account and using GreenMove, you acknowledge that:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>You are at least 18 years of age</li>
                <li>You have a valid driver's license (where applicable)</li>
                <li>You have read and understood these Terms</li>
                <li>You agree to comply with all applicable laws and regulations</li>
                <li>You will use the service responsibly and ethically</li>
              </ul>
            </div>
          </section>

          {/* Account Registration */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Registration</h2>
            <div className="space-y-3 text-gray-700">
              <p>To use GreenMove, you must create an account by providing:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Accurate and complete personal information</li>
                <li>A valid email address and phone number</li>
                <li>A secure password that you keep confidential</li>
                <li>Your billing address for invoice generation</li>
              </ul>
              <p className="mt-4">
                You are responsible for maintaining the security of your account credentials. Any activity under your 
                account is your responsibility. Notify us immediately of any unauthorized access.
              </p>
            </div>
          </section>

          {/* Service Usage */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Usage and Vehicle Rentals</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Rental Process</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Reserve an available electric vehicle from any station</li>
                  <li>Start your ride when ready to begin travel</li>
                  <li>End your ride when you reach your destination</li>
                  <li>Pay using reward points, wallet balance, or both</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Fare Structure</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Base Fare:</strong> Rs. 10 per ride</li>
                  <li><strong>Distance Charges:</strong> Rs. 5 per kilometer</li>
                  <li><strong>Time Charges:</strong> Rs. 2 per minute</li>
                  <li><strong>GST:</strong> 18% applicable on all rides</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Reward points are automatically redeemed first (if available)</li>
                  <li>Remaining amount is deducted from your wallet balance</li>
                  <li>You must maintain sufficient wallet balance to complete rides</li>
                  <li>Earn 10% cashback on wallet payments as reward points</li>
                  <li>All payments are final and non-refundable unless service error occurs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* User Responsibilities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">User Responsibilities</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>As a user of GreenMove, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Operate vehicles safely and follow all traffic laws</li>
                <li>Inspect the vehicle before use and report any damage</li>
                <li>Return vehicles to designated station areas</li>
                <li>Not use vehicles while under the influence of alcohol or drugs</li>
                <li>Not allow unauthorized persons to use the vehicle</li>
                <li>Not modify, damage, or misuse the vehicle</li>
                <li>Report accidents or incidents immediately</li>
                <li>Maintain your helmet and safety gear (where required)</li>
              </ul>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Ban className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Prohibited Activities</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p>You may not:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Use the service for illegal purposes or commercial activities</li>
                <li>Attempt to hack, reverse engineer, or compromise the platform</li>
                <li>Create multiple accounts to abuse promotions or rewards</li>
                <li>Share your account credentials with others</li>
                <li>Use vehicles outside designated service areas</li>
                <li>Remove or tamper with vehicle tracking devices</li>
                <li>Provide false information during registration or usage</li>
                <li>Harass, threaten, or abuse other users or staff</li>
              </ul>
            </div>
          </section>

          {/* Liability */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Liability and Insurance</h2>
            </div>
            <div className="space-y-3 text-gray-700">
              <p><strong>User Liability:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
                <li>You are responsible for any damage to the vehicle during your rental period</li>
                <li>You are liable for traffic violations, fines, and penalties incurred</li>
                <li>You assume all risk of injury to yourself or third parties</li>
                <li>Damage charges will be deducted from your wallet balance</li>
              </ul>
              <p><strong>Company Liability:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We maintain basic insurance coverage for our vehicles</li>
                <li>We are not liable for personal injuries or property damage during rentals</li>
                <li>We do not guarantee vehicle availability at all times</li>
                <li>Service may be interrupted for maintenance or emergencies</li>
              </ul>
            </div>
          </section>

          {/* Suspension and Termination */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Suspension and Termination</h2>
            <div className="space-y-3 text-gray-700">
              <p>We reserve the right to suspend or terminate your account if you:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Violate these Terms of Service</li>
                <li>Engage in fraudulent or illegal activities</li>
                <li>Abuse or damage vehicles repeatedly</li>
                <li>Fail to pay outstanding charges</li>
                <li>Provide false information or impersonate others</li>
              </ul>
              <p className="mt-4">
                You may delete your account at any time from your Profile page. Upon deletion, all your data including 
                wallet balance and reward points will be permanently removed.
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
            <p className="text-gray-700">
              All content on the GreenMove platform including logos, text, graphics, software, and design elements are 
              the property of GreenMove Technologies Pvt. Ltd. and protected by copyright and trademark laws. You may 
              not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          {/* Privacy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700">
              Your use of GreenMove is also governed by our{' '}
              <a href="/privacy" className="text-primary-600 hover:underline font-semibold">Privacy Policy</a>, 
              which explains how we collect, use, and protect your personal information. By using our service, you 
              consent to our data practices as described in the Privacy Policy.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimer of Warranties</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700">
              <p className="font-semibold mb-2">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND.</p>
              <p className="text-sm">
                We do not guarantee that the service will be uninterrupted, error-free, or secure. We do not warrant 
                that vehicles will be available when needed or in perfect condition. Your use of the service is at 
                your own risk.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-700">
              <p className="text-sm">
                To the maximum extent permitted by law, GreenMove Technologies Pvt. Ltd. shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
                whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses 
                resulting from your use of the service.
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modifications to Terms</h2>
            <p className="text-gray-700">
              We reserve the right to modify these Terms at any time. We will notify users of significant changes via 
              email or platform notification. Continued use of the service after changes constitutes acceptance of the 
              modified Terms. If you do not agree with the changes, you must stop using the service and delete your account.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Dispute Resolution</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising 
                from these Terms or the use of our service shall be subject to the exclusive jurisdiction of the courts 
                in Navi Mumbai, Maharashtra.
              </p>
              <p>
                Before filing any legal action, you agree to attempt to resolve disputes through good faith negotiation 
                with us.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-primary-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="space-y-2 text-gray-700">
              <p>If you have questions about these Terms of Service, please contact us:</p>
              <div className="space-y-1">
                <p><strong>Email:</strong> <a href="mailto:support@greenmove.com" className="text-primary-600 hover:underline">support@greenmove.com</a></p>
                <p><strong>Address:</strong> B301, Vidyulata Prince Palace CHS, Kharghar, Navi Mumbai - 410210</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
              </div>
            </div>
          </section>

          {/* Acceptance Footer */}
          <section className="border-t-2 border-gray-200 pt-6">
            <p className="text-sm text-gray-600 italic text-center">
              By using GreenMove, you acknowledge that you have read, understood, and agree to be bound by these 
              Terms of Service and our Privacy Policy.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsPage;
