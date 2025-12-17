import { motion } from 'framer-motion';
import { Heart, Users, Target, Leaf, Award, Zap } from 'lucide-react';

const AboutPage = () => {
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
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">About GreenMove</h1>
              <p className="text-gray-600">Revolutionizing urban mobility, one ride at a time</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Mission Statement */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              GreenMove Technologies Pvt. Ltd. is on a mission to transform urban transportation by making electric 
              vehicle rentals accessible, affordable, and sustainable. We believe that everyone deserves access to 
              clean, eco-friendly transportation that doesn't compromise on convenience or cost.
            </p>
          </div>

          {/* The Problem We're Solving */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">The Problem We're Solving</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                Urban India faces a critical challenge: <strong>transportation contributes to 24% of global CO2 emissions</strong>, 
                with cities bearing the brunt of air pollution and traffic congestion. Traditional vehicle ownership is 
                expensive, parking is scarce, and last-mile connectivity remains a persistent problem for millions.
              </p>
              <p>
                While electric vehicles offer a solution, high upfront costs and limited charging infrastructure have 
                slowed adoption. That's where GreenMove comes in—we make EVs accessible through on-demand rentals, 
                eliminating ownership barriers while promoting sustainable urban mobility.
              </p>
            </div>
          </div>

          {/* Our Solution */}
          <div className="card bg-gradient-to-br from-primary-50 to-white">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">How GreenMove Works</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">For Users</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">1.</span>
                    <span>Browse available electric scooters and bikes on our interactive map</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">2.</span>
                    <span>Reserve a vehicle instantly and start your ride when ready</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">3.</span>
                    <span>Pay with reward points or wallet balance—earn 10% cashback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">4.</span>
                    <span>Track your environmental impact and download invoices</span>
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">For Cities</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>Reduce carbon emissions and improve air quality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>Solve last-mile connectivity challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>Decrease traffic congestion and parking demand</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 font-bold">•</span>
                    <span>Promote sustainable urban development</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Our Core Values</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sustainability</h3>
                <p className="text-sm text-gray-600">
                  Every ride reduces carbon footprint. We're committed to environmental responsibility.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Accessibility</h3>
                <p className="text-sm text-gray-600">
                  Affordable pricing and widespread availability make EVs accessible to everyone.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Innovation</h3>
                <p className="text-sm text-gray-600">
                  Cutting-edge technology meets user-centric design for seamless experiences.
                </p>
              </div>
            </div>
          </div>

          {/* Our Impact */}
          <div className="card bg-green-50 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-4">
              <Leaf className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Environmental Impact</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">0.15 kg</div>
                <p className="text-gray-700">CO2 saved per kilometer</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">100%</div>
                <p className="text-gray-700">Electric fleet</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                <p className="text-gray-700">Service availability</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 text-center mt-6 italic">
              Join thousands of users making a positive impact on the environment with every ride.
            </p>
          </div>

          {/* Technology Stack */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Technology & Innovation</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                GreenMove is built on a modern, scalable technology stack designed for reliability and user experience:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Frontend</h3>
                  <ul className="text-sm space-y-1">
                    <li>• React.js for dynamic user interfaces</li>
                    <li>• Tailwind CSS for modern design</li>
                    <li>• Leaflet for interactive maps</li>
                    <li>• Real-time ride tracking</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Backend</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Node.js & Express.js APIs</li>
                    <li>• MongoDB for data management</li>
                    <li>• JWT authentication & security</li>
                    <li>• Automated invoice generation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Our Fleet */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Fleet</h2>
            <p className="text-gray-700 mb-4">
              We partner with leading electric vehicle manufacturers to provide a diverse, reliable fleet:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <p className="font-semibold text-primary-700">Ather 450X</p>
                <p className="text-xs text-gray-600">Premium Scooter</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <p className="font-semibold text-primary-700">Ola S1 Pro</p>
                <p className="text-xs text-gray-600">Smart Scooter</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <p className="font-semibold text-primary-700">Simple One</p>
                <p className="text-xs text-gray-600">Long Range</p>
              </div>
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <p className="font-semibold text-primary-700">TVS iQube</p>
                <p className="text-xs text-gray-600">Reliable Choice</p>
              </div>
            </div>
          </div>

          {/* Future Vision */}
          <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
            <h2 className="text-2xl font-bold mb-4">Our Vision for the Future</h2>
            <div className="space-y-3">
              <p className="text-primary-50">
                We envision a future where electric vehicle sharing is the norm, not the exception. A future where 
                cities are cleaner, quieter, and more livable. Where sustainable transportation is accessible to 
                everyone, regardless of income or location.
              </p>
              <p className="text-primary-50">
                GreenMove is just the beginning. We're continuously expanding our fleet, improving our technology, 
                and partnering with cities to build the infrastructure needed for truly sustainable urban mobility.
              </p>
              <p className="text-primary-50 font-semibold">
                Join us in driving the change. One electric ride at a time. 🌱⚡
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Have questions, feedback, or partnership inquiries? We'd love to hear from you!
              </p>
              <div className="bg-primary-50 rounded-xl p-6 space-y-2">
                <p><strong>Email:</strong> <a href="mailto:support@greenmove.com" className="text-primary-600 hover:underline">support@greenmove.com</a></p>
                <p><strong>Business Inquiries:</strong> <a href="mailto:partnerships@greenmove.com" className="text-primary-600 hover:underline">partnerships@greenmove.com</a></p>
                <p><strong>Address:</strong> B301, Vidyulata Prince Palace CHS, Kharghar, Navi Mumbai - 410210</p>
                <p><strong>Phone:</strong> +91 98765 43210</p>
              </div>
            </div>
          </div>

          {/* Company Info */}
          <div className="text-center text-gray-600 text-sm py-6 border-t border-gray-200">
            <p>© 2025 GreenMove Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="mt-2">Making cities greener, one ride at a time. 🌍</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
