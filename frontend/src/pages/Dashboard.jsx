import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, TrendingUp, Route, Award, Trophy, Zap, IndianRupee, Wallet, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [addingMoney, setAddingMoney] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get('/users/dashboard');
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    {
      icon: <Route className="w-6 h-6" />,
      label: 'Total Rides',
      value: stats?.stats?.totalRides || 0,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      label: 'CO₂ Saved',
      value: stats?.stats?.totalCarbonSaved || '0.00 kg CO₂',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <IndianRupee className="w-6 h-6" />,
      label: 'Total Spent',
      value: stats?.stats?.totalSpent || '₹0',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: 'Reward Points (10% cashback)',
      value: `${stats?.user?.rewardPoints || 0} pts`,
      color: 'from-yellow-500 to-yellow-600',
      subtitle: '1 pt = ₹1 | Auto-redeemed'
    }
  ];

  const achievements = stats?.achievements || [];

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    
    if (!amountNum || amountNum <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (amountNum > 10000) {
      alert('Maximum amount per transaction is ₹10,000');
      return;
    }
    
    setAddingMoney(true);
    try {
      const { data } = await axios.post('/users/wallet/add', { amount: amountNum });
      alert(`✅ ${data.message}`);
      setShowAddMoney(false);
      setAmount('');
      fetchDashboard(); // Refresh to show new balance
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add money');
    } finally {
      setAddingMoney(false);
    }
  };

  const quickAmounts = [100, 250, 500, 1000, 2000, 5000];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-gray-600">Here's your eco-impact summary</p>
        </motion.div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm opacity-90 mb-1">Wallet Balance</p>
                <p className="text-4xl font-bold">₹{stats?.user?.walletBalance?.toFixed(2) || '0.00'}</p>
                <p className="text-xs opacity-75 mt-1">Used for ride payments after reward points</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddMoney(true)}
              className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Money
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-4`}>
                {stat.icon}
              </div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              {stat.subtitle && <div className="text-xs text-gray-500 mt-1">{stat.subtitle}</div>}
            </motion.div>
          ))}
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="card mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="glass rounded-xl p-4 text-center"
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <div className="font-semibold text-gray-900 mb-1">{achievement.title}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Rides */}
        {stats?.recentRides && stats.recentRides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="card"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Rides</h2>
            <div className="space-y-4">
              {stats.recentRides.map((ride) => (
                <div
                  key={ride._id}
                  className="flex items-center justify-between p-4 glass rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {ride.vehicleId?.brand} {ride.vehicleId?.model || 'Vehicle'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(ride.startTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900 flex items-center justify-end">
                      <IndianRupee className="w-4 h-4" />
                      {ride.fare}
                    </div>
                    <div className="text-sm text-green-600 flex items-center justify-end gap-1">
                      <Leaf className="w-3 h-3" />
                      {ride.carbonSaved.toFixed(2)} kg CO₂
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {stats?.stats?.totalRides === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <div className="text-6xl mb-4">🚴</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Start Your First Ride!</h3>
            <p className="text-gray-600 mb-6">Find a vehicle nearby and begin your eco-journey</p>
            <a
              href="/map"
              className="inline-flex items-center gap-2 btn-primary"
            >
              <Zap className="w-5 h-5" />
              Find Vehicles
            </a>
          </motion.div>
        )}

        {/* Add Money Modal */}
        <AnimatePresence>
          {showAddMoney && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
              onClick={() => setShowAddMoney(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Add Money to Wallet</h2>
                  <button
                    onClick={() => setShowAddMoney(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleAddMoney} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      min="1"
                      max="10000"
                      step="0.01"
                      className="input-field text-2xl font-bold"
                      required
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2">Maximum ₹10,000 per transaction</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">Quick Add</p>
                    <div className="grid grid-cols-3 gap-3">
                      {quickAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setAmount(amt.toString())}
                          className="px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:border-primary-500 hover:bg-primary-50 transition-colors"
                        >
                          ₹{amt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-blue-900">
                      💡 <strong>Demo Mode:</strong> Money is added instantly for testing. 
                      In production, this would integrate with UPI/Cards.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={addingMoney}
                    className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50"
                  >
                    {addingMoney ? 'Processing...' : `Add ₹${amount || '0'} to Wallet`}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
