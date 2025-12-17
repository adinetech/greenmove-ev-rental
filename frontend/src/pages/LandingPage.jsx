import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, MapPin, Zap, Award, TrendingDown, Shield } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Find Nearby",
      description: "Locate eco-friendly vehicles within seconds"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Booking",
      description: "Reserve and unlock with a single tap"
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      title: "Zero Emissions",
      description: "100% electric fleet for cleaner air"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Earn Rewards",
      description: "Get points for every eco-friendly ride"
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Track Impact",
      description: "Monitor your carbon savings in real-time"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Safe & Secure",
      description: "Verified vehicles, insured rides"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 sm:py-32">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8">
              <Leaf className="w-4 h-4 text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Sustainable Urban Mobility</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-gray-900 mb-6">
              Ride Green,
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent"> Live Clean</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Experience the future of transportation. Eco-friendly electric vehicles at your fingertips.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Get Started
                </motion.button>
              </Link>
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary"
                >
                  Sign In
                </motion.button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              {[
                { value: "50K+", label: "Happy Riders" },
                { value: "100+", label: "Cities" },
                { value: "5M kg", label: "CO₂ Saved" }
              ].map((stat, idx) => (
                <div key={idx} className="glass rounded-2xl p-6">
                  <div className="text-3xl font-bold text-primary-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </motion.div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose GreenMove?</h2>
          <p className="text-lg text-gray-600">Everything you need for sustainable urban travel</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="card group cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto px-6 py-20"
      >
        <div className="glass-dark rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Join thousands of riders reducing their carbon footprint, one ride at a time.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Start Your Journey
            </motion.button>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">GreenMove</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Making cities greener with on-demand electric vehicle rentals. Sustainable, affordable, and accessible mobility for everyone.
              </p>
              <p className="text-sm text-gray-500">
                © 2025 GreenMove Technologies Pvt. Ltd.<br />
                All rights reserved.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@greenmove.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="mailto:partnerships@greenmove.com" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Partnerships
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            <p>B301, Vidyulata Prince Palace CHS, Kharghar, Navi Mumbai - 410210</p>
            <p className="mt-2">Making the world greener, one ride at a time 🌍⚡</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
