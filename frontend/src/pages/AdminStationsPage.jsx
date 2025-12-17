import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit2, Trash2, Battery, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const AdminStationsPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    totalSlots: 10,
    chargingPoints: 5
  });

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const { data } = await axios.get('/stations');
      setStations(data.data);
    } catch (error) {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const stationData = {
        name: formData.name,
        address: formData.address,
        location: {
          type: 'Point',
          coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
        },
        totalSlots: parseInt(formData.totalSlots),
        availableSlots: parseInt(formData.totalSlots),
        chargingPoints: parseInt(formData.chargingPoints)
      };

      if (editingStation) {
        await axios.put(`/stations/${editingStation._id}`, stationData);
        alert('✅ Station updated successfully!');
      } else {
        await axios.post('/stations', stationData);
        alert('✅ Station created successfully!');
      }

      setShowForm(false);
      setEditingStation(null);
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        totalSlots: 10,
        chargingPoints: 5
      });
      fetchStations();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save station');
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      address: station.address,
      latitude: station.location.coordinates[1],
      longitude: station.location.coordinates[0],
      totalSlots: station.totalSlots,
      chargingPoints: station.chargingPoints
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this station?')) return;
    
    try {
      await axios.delete(`/stations/${id}`);
      alert('✅ Station deleted successfully!');
      fetchStations();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete station');
    }
  };

  const getLocationFromBrowser = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }));
      },
      (error) => {
        alert('Unable to get your location. Please enter manually.');
      }
    );
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Charging Stations</h1>
            <p className="text-gray-600">Manage charging stations and parking slots</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingStation(null);
              setFormData({
                name: '',
                address: '',
                latitude: '',
                longitude: '',
                totalSlots: 10,
                chargingPoints: 5
              });
            }}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Station
          </button>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Stations</p>
                <p className="text-2xl font-bold text-gray-900">{stations.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Stations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stations.filter(s => s.isActive).length}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Battery className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Charging Points</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stations.reduce((acc, s) => acc + s.chargingPoints, 0)}
                </p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Slots</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stations.reduce((acc, s) => acc + s.totalSlots, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingStation ? 'Edit Station' : 'Add New Station'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Station Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Kharghar Central Station"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    placeholder="Full address"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 19.0330"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="input-field"
                    placeholder="e.g., 73.0297"
                    required
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={getLocationFromBrowser}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Use my current location
              </button>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Parking Slots *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.totalSlots}
                    onChange={(e) => setFormData({ ...formData, totalSlots: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charging Points *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.chargingPoints}
                    onChange={(e) => setFormData({ ...formData, chargingPoints: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary">
                  {editingStation ? 'Update Station' : 'Create Station'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStation(null);
                  }}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Stations List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station, idx) => (
            <motion.div
              key={station._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{station.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{station.address}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${station.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Slots</span>
                  <span className="font-semibold text-gray-900">{station.totalSlots}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Available</span>
                  <span className="font-semibold text-green-600">{station.availableSlots}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Charging Points</span>
                  <span className="font-semibold text-purple-600">{station.chargingPoints}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Vehicles Parked</span>
                  <span className="font-semibold text-blue-600">
                    {station.vehiclesParked?.length || 0}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(station)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(station._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {stations.length === 0 && !showForm && (
          <div className="text-center py-20">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Stations Yet</h3>
            <p className="text-gray-600 mb-6">Add your first charging station to get started</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Station
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStationsPage;
