import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Route, Leaf, IndianRupee, Award, Activity, Clock } from 'lucide-react';
import axios from 'axios';

const AdminReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data } = await axios.get('/admin/sustainability-reports');
      setStats(data.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
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
      icon: <Users className="w-6 h-6" />,
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <Route className="w-6 h-6" />,
      label: 'Total Rides',
      value: stats?.totalRides || 0,
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: <Leaf className="w-6 h-6" />,
      label: 'CO₂ Saved',
      value: `${(stats?.totalCarbonSaved || 0).toFixed(2)} kg`,
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <IndianRupee className="w-6 h-6" />,
      label: 'Total Revenue',
      value: `₹${stats?.totalRevenue || 0}`,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      label: 'Fleet Size',
      value: stats?.totalVehicles || 0,
      color: 'from-red-500 to-red-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Avg Ride Duration',
      value: `${stats?.avgRideDuration || 0} min`,
      color: 'from-pink-500 to-pink-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sustainability Reports</h1>
          <p className="text-gray-600">Platform analytics and environmental impact</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Most Used Vehicles */}
        {stats?.mostUsedVehicles && stats.mostUsedVehicles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Most Used Vehicles</h2>
            <div className="space-y-4">
              {stats.mostUsedVehicles.map((vehicle, idx) => (
                <div
                  key={vehicle._id}
                  className="flex items-center justify-between p-4 glass rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {vehicle.brand} {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-600">{vehicle.vehicleNumber}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{vehicle.rideCount} rides</div>
                    <div className="text-sm text-gray-600">
                      ₹{vehicle.totalRevenue?.toFixed(0) || 0} revenue
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Fleet Utilization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="card mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Fleet Utilization</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 glass rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {stats?.utilizationRate || 0}%
              </div>
              <div className="text-sm text-gray-600">Average Utilization</div>
            </div>
            <div className="text-center p-6 glass rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats?.activeVehicles || 0}
              </div>
              <div className="text-sm text-gray-600">Currently Active</div>
            </div>
            <div className="text-center p-6 glass rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stats?.avgRidesPerVehicle || 0}
              </div>
              <div className="text-sm text-gray-600">Rides per Vehicle</div>
            </div>
          </div>
        </motion.div>

        {/* Environmental Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card bg-gradient-to-br from-green-50 to-primary-50"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Environmental Impact</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-2">Total CO₂ Saved</div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {(stats?.totalCarbonSaved || 0).toFixed(2)} kg
              </div>
              <div className="text-xs text-gray-500">
                Equivalent to {Math.floor((stats?.totalCarbonSaved || 0) / 0.411)} km by car
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-2">Total Distance</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {(stats?.totalDistance || 0).toFixed(1)} km
              </div>
              <div className="text-xs text-gray-500">
                Eco-friendly kilometers traveled
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <div className="text-sm text-gray-600 mb-2">Trees Equivalent</div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {Math.floor((stats?.totalCarbonSaved || 0) / 21.77)}
              </div>
              <div className="text-xs text-gray-500">
                Trees needed to offset emissions
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminReportsPage;
