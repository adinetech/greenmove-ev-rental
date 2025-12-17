import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Navigation, IndianRupee, Zap, Battery, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import axios from 'axios';
import { generateInvoice } from '../utils/invoiceGenerator';
import { useAuth } from '../context/AuthContext';

const ActiveRidePage = () => {
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ending, setEnding] = useState(false);
  const [duration, setDuration] = useState(0);
  const [completedRide, setCompletedRide] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchActiveRide();
  }, []);

  useEffect(() => {
    if (!ride || ride.status !== 'active' || !ride.startTime) return;

    const interval = setInterval(() => {
      const start = new Date(ride.startTime);
      const now = new Date();
      const diff = Math.floor((now - start) / 1000); // seconds
      setDuration(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [ride]);

  const fetchActiveRide = async () => {
    try {
      const { data } = await axios.get('/rides/active/current');
      if (data.data) {
        setRide(data.data);
      } else {
        navigate('/rides');
      }
    } catch (error) {
      console.error('Failed to fetch active ride:', error);
      navigate('/rides');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRide = async () => {
    setLoading(true);
    
    // Get user's current location
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { data } = await axios.post('/rides/start', {
            vehicleId: ride.vehicleId._id,
            startLat: position.coords.latitude,
            startLng: position.coords.longitude,
            startAddress: 'Current Location'
          });
          setRide(data.data);
          alert('Ride started! Enjoy your eco-friendly journey! 🚀');
        } catch (error) {
          alert(error.response?.data?.error || 'Failed to start ride');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        alert('Unable to get your location. Please enable location services.');
        setLoading(false);
      }
    );
  };

  const handleEndRide = async () => {
    setEnding(true);
    
    // Get user's current location
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      setEnding(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { data } = await axios.post(`/rides/${ride._id}/end`, {
            endLat: position.coords.latitude,
            endLng: position.coords.longitude,
            endAddress: 'End Location'
          });
      
      const rideData = data.data.ride || data.data;
      const summary = data.data.summary || {};
      const fare = rideData.fare;
      const duration = rideData.duration;
      const distance = rideData.distance;
      const carbonSaved = rideData.carbonSaved;
      const pointsEarned = summary.pointsEarned || 0;
      const pointsRedeemed = summary.pointsRedeemed || 0;
      const totalPoints = summary.totalPoints || 0;
      const walletBalance = summary.walletBalance || 0;
      const originalFare = parseFloat(summary.originalFare?.replace('₹', '')) || fare;
      
      // Payment success message with wallet and reward points
      let message = `🎉 Ride Completed!\n\n`;
      message += `⏱️ Duration: ${duration} minutes\n`;
      message += `📍 Distance: ${distance.toFixed(2)} km\n`;
      message += `🌱 CO₂ Saved: ${carbonSaved.toFixed(2)} kg\n\n`;
      
      message += `--- Payment Breakdown ---\n`;
      if (pointsRedeemed > 0) {
        message += `💰 Original Fare: ₹${originalFare.toFixed(2)}\n`;
        message += `🎁 Points Redeemed: -₹${pointsRedeemed}\n`;
        message += `💵 Paid from Wallet: ₹${fare.toFixed(2)}\n`;
      } else {
        message += `💵 Paid from Wallet: ₹${fare.toFixed(2)}\n`;
      }
      
      message += `\n--- Rewards & Balance ---\n`;
      message += `⭐ Cashback Earned: +${pointsEarned} points (10%)\n`;
      message += `🏆 Total Points: ${totalPoints}\n`;
      message += `💳 Wallet Balance: ₹${walletBalance.toFixed(2)}\n\n`;
      message += `Thank you for using GreenMove! 🌿`;
      
      // Store completed ride data for invoice generation
      setCompletedRide(rideData);
      
      alert(message);
        } catch (error) {
          alert(error.response?.data?.message || 'Failed to end ride');
          setEnding(false);
        }
      },
      (error) => {
        alert('Unable to get your location. Please enable location services to end ride.');
        setEnding(false);
      }
    );
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  const calculateEstimatedFare = () => {
    if (!ride) return 0;
    const minutes = Math.floor(duration / 60);
    const baseFare = 10;
    const perMinute = 2;
    return baseFare + (minutes * perMinute);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 px-6 pb-12">
        <div className="max-w-2xl mx-auto text-center py-20">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Ride</h2>
          <p className="text-gray-600 mb-6">You don't have any ongoing rides</p>
          <button
            onClick={() => navigate('/map')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            Find Vehicles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 px-6 pb-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold mb-4">
            <CheckCircle className="w-5 h-5" />
            Ride in Progress
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Active Ride</h1>
          <p className="text-gray-600">Keep riding safely!</p>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white"
        >
          <div className="text-center">
            <div className="text-6xl font-bold mb-2">{formatDuration(duration)}</div>
            <div className="text-primary-100 text-lg">Ride Duration</div>
          </div>
        </motion.div>

        {/* Vehicle Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-3xl">
              {ride.vehicleId?.type === 'bike' ? '🏍️' : ride.vehicleId?.type === 'ev' ? '🚗' : '🛴'}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{ride.vehicleId?.brand} {ride.vehicleId?.model}</h3>
              <p className="text-gray-600">{ride.vehicleId?.vehicleNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Battery className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">Battery</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{Math.round(ride.vehicleId?.battery || 0)}%</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">Range</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{ride.vehicleId?.range} km</div>
            </div>
          </div>
        </motion.div>

        {/* Fare Estimate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <IndianRupee className="w-5 h-5" />
            Estimated Fare
          </h3>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Base Fare</span>
              <span className="font-semibold text-gray-900">₹10</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Duration ({Math.floor(duration / 60)} mins)</span>
              <span className="font-semibold text-gray-900">₹{Math.floor(duration / 60) * 2}</span>
            </div>
            <div className="h-px bg-gray-200"></div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900">Current Total</span>
              <span className="text-3xl font-bold text-primary-600">₹{calculateEstimatedFare()}</span>
            </div>
          </div>

          <div className="glass rounded-xl p-3 text-sm text-gray-600">
            <Clock className="w-4 h-4 inline mr-2" />
            {ride.status === 'reserved' 
              ? `Reserved at ${new Date(ride.reservedAt).toLocaleTimeString()}`
              : `Started at ${new Date(ride.startTime).toLocaleTimeString()}`
            }
          </div>
          {ride.status === 'reserved' && (
            <p className="text-xs text-center text-gray-500 mt-3">
              💡 In production: Scan QR code on vehicle to start
            </p>
          )}
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {ride.status === 'reserved' ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStartRide}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-6 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  Starting...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  Start Ride
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleEndRide}
              disabled={ending}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-6 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {ending ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  Ending Ride...
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  End Ride
                </>
              )}
            </motion.button>
          )}

          <p className="text-center text-sm text-gray-600 mt-4">
            Make sure to park the vehicle properly before ending
          </p>
        </motion.div>

        {/* Invoice Download Section - Shows after ride completion */}
        {completedRide && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-8 shadow-xl mt-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ride Completed! 🎉</h2>
              <p className="text-gray-600">Download your invoice for record keeping</p>
            </div>

            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => generateInvoice(completedRide, user)}
                className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-4 rounded-xl font-semibold hover:from-gray-800 hover:to-gray-900 transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Download Invoice PDF
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/rides')}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all"
              >
                View All Rides
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ActiveRidePage;
