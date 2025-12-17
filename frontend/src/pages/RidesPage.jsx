import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Leaf, Star, Clock, IndianRupee, Filter, Activity, FileText } from 'lucide-react';
import axios from 'axios';
import { generateInvoice } from '../utils/invoiceGenerator';
import { useAuth } from '../context/AuthContext';

const RidesPage = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, completed, cancelled, reserved, active
  const [currentTime, setCurrentTime] = useState(Date.now());
  const { user } = useAuth();

  useEffect(() => {
    fetchRides();
    
    // Update current time every second for active rides
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRides = async () => {
    try {
      const { data } = await axios.get('/rides');
      setRides(data.data);
    } catch (error) {
      console.error('Failed to fetch rides:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRides = rides.filter(ride => {
    if (filter === 'all') return true;
    return ride.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      active: 'bg-blue-100 text-blue-700',
      reserved: 'bg-yellow-100 text-yellow-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getElapsedTime = (startTime) => {
    const elapsed = Math.floor((currentTime - new Date(startTime).getTime()) / 1000); // seconds
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 px-6 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Rides</h1>
          <p className="text-gray-600">Your ride history and details</p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 overflow-x-auto">
          {['all', 'reserved', 'active', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl font-medium transition-all whitespace-nowrap ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Rides List */}
        {filteredRides.length > 0 ? (
          <div className="space-y-4">
            {filteredRides.map((ride, idx) => (
              <motion.div
                key={ride._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {ride.vehicleId?.brand} {ride.vehicleId?.model || ride.vehicleId?.name || 'Unknown Vehicle'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {new Date(ride.reservedAt || ride.startTime || ride.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ride.status)}`}>
                    {ride.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      ride.status === 'active' ? 'bg-blue-100 animate-pulse' : 'bg-primary-100'
                    }`}>
                      {ride.status === 'active' ? (
                        <Activity className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-semibold text-gray-900">
                        {ride.status === 'active' && ride.startTime ? (
                          <span className="text-blue-600">
                            {getElapsedTime(ride.startTime)} ⏱️
                          </span>
                        ) : ride.status === 'reserved' ? (
                          <span className="text-yellow-600">Not Started</span>
                        ) : ride.duration ? (
                          `${ride.duration} mins`
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">CO₂ Saved</div>
                      <div className="font-semibold text-gray-900">
                        {ride.status === 'active' || ride.status === 'reserved' ? (
                          <span className="text-gray-500">Calculating...</span>
                        ) : (
                          `${ride.carbonSaved?.toFixed(2) || 0} kg`
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">
                      {ride.status === 'active' ? (
                        <span className="text-blue-600">📍 Tracking...</span>
                      ) : ride.status === 'reserved' ? (
                        <span className="text-yellow-600">Not Started</span>
                      ) : ride.distance ? (
                        `${ride.distance.toFixed(2)} km`
                      ) : (
                        'Distance N/A'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                    <IndianRupee className="w-5 h-5" />
                    {ride.status === 'active' || ride.status === 'reserved' ? (
                      <span className="text-sm text-gray-500">Pending</span>
                    ) : (
                      (ride.fare || 0).toFixed(2)
                    )}
                  </div>
                </div>

                {/* Reward Points Info */}
                {ride.status === 'completed' && (ride.pointsEarned > 0 || ride.pointsRedeemed > 0) && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
                    {ride.pointsRedeemed > 0 && (
                      <div className="text-purple-600">
                        🎁 Redeemed: ₹{ride.pointsRedeemed}
                      </div>
                    )}
                    {ride.pointsEarned > 0 && (
                      <div className="text-yellow-600 ml-auto">
                        ⭐ Earned: +{ride.pointsEarned} pts
                      </div>
                    )}
                  </div>
                )}

                {/* Download Invoice Button */}
                {ride.status === 'completed' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => generateInvoice(ride, user)}
                      className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-900 transition-all flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      Download Invoice PDF
                    </motion.button>
                  </div>
                )}

                {ride.status === 'reserved' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => window.location.href = '/active-ride'}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      🔓 Start Ride
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      💡 In production: Scan QR code on vehicle to start ride securely
                    </p>
                  </div>
                )}

                {ride.rating && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm text-gray-600">
                      You rated {ride.rating} stars
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center py-12"
          >
            <div className="text-6xl mb-4">🚲</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No rides yet' : `No ${filter} rides`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start your first eco-friendly ride today!'
                : `You don't have any ${filter} rides`}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="btn-secondary"
              >
                View All Rides
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RidesPage;
