import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Battery, MapPin, Activity, AlertCircle, CheckCircle, X, Save, Search } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lng, e.latlng.lat]);
    },
  });

  return position ? (
    <Marker position={[position[1], position[0]]} />
  ) : null;
}

// Predefined EV vehicles for GreenMove 🌱⚡
// Ranges based on manufacturer claims (real-world may vary by 10-15%)
const EV_VEHICLES = {
  scooters: [
    { brand: 'Ather', models: ['450X', '450 Apex', '450S'], range: 105 }, // 450X: 105km true range
    { brand: 'Ola Electric', models: ['S1 Pro', 'S1 Air', 'S1 X'], range: 135 }, // S1 Pro: 135km
    { brand: 'TVS', models: ['iQube', 'iQube ST'], range: 100 }, // iQube: 100km
    { brand: 'Bajaj', models: ['Chetak Premium', 'Chetak Urbane'], range: 95 }, // Chetak: 95km
    { brand: 'Simple', models: ['One', 'Dot'], range: 203 }, // Simple One: 203km (impressive!)
    { brand: 'Hero Electric', models: ['Optima E5', 'Photon'], range: 85 } // Optima: 85km
  ],
  bikes: [
    { brand: 'Revolt', models: ['RV400', 'RV400 BRZ'], range: 150 }, // RV400: 150km
    { brand: 'Tork', models: ['Kratos', 'Kratos R'], range: 120 }, // Kratos: 120km
    { brand: 'Ultraviolette', models: ['F77'], range: 130 }, // F77: 130-307km (using eco mode)
    { brand: 'Oben', models: ['Rorr'], range: 187 } // Rorr: 187km
  ],
  cars: [
    { brand: 'Tata', models: ['Nexon EV', 'Tiago EV', 'Tigor EV'], range: 315 }, // Nexon EV Max: 315km
    { brand: 'MG', models: ['ZS EV', 'Comet EV'], range: 461 }, // ZS EV: 461km
    { brand: 'Hyundai', models: ['Kona Electric', 'Ioniq 5'], range: 452 }, // Kona: 452km
    { brand: 'Mahindra', models: ['e2o Plus', 'eVerito'], range: 140 } // eVerito: 140km
  ]
};

const AdminFleetPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    type: 'scooter',
    brand: '',
    model: '',
    battery: 100,
    range: 30,
    status: 'available',
    location: {
      type: 'Point',
      coordinates: [77.5946, 12.9716] // [lng, lat] - Bangalore default
    }
  });
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    // Get user's current location when form opens
    if (showAddForm && !editingVehicle) {
      getUserLocation();
    }
  }, [showAddForm, editingVehicle]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            }
          }));
        },
        (error) => {
          console.log('Location access denied, using default location');
        }
      );
    }
  };

  const fetchVehicles = async () => {
    try {
      const { data } = await axios.get('/vehicles');
      setVehicles(data.data);
    } catch (error) {
      // Error fetching vehicles
    } finally {
      setLoading(false);
    }
  };

  // Search for location suggestions as user types (with debounce)
  const handleSearchInput = (value) => {
    setSearchQuery(value);
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    if (value.trim().length < 3) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    // Debounce search to avoid rate limits
    setSearching(true);
    const timeout = setTimeout(async () => {
      try {
        console.log('Searching for:', value);
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=5&countrycodes=in`,
          {
            headers: {
              'User-Agent': 'GreenMove-FleetManagement'
            }
          }
        );
        const data = await response.json();
        console.log('Search results:', data);
        setSearchResults(data);
        setShowResults(data.length > 0);
        setSearching(false);
      } catch (error) {
        console.error('Location search failed:', error);
        setSearching(false);
      }
    }, 800); // Wait 800ms after user stops typing
    
    setSearchTimeout(timeout);
  };

  // Select a location from search results
  const handleSelectLocation = (result) => {
    const { lon, lat, display_name } = result;
    setFormData(prev => ({
      ...prev,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lon), parseFloat(lat)]
      }
    }));
    setSearchQuery(display_name);
    setShowResults(false);
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting vehicle data:', formData);
      if (editingVehicle) {
        await axios.put(`/vehicles/${editingVehicle._id}`, formData);
        alert('Vehicle updated successfully!');
      } else {
        const response = await axios.post('/vehicles', formData);
        console.log('Add vehicle response:', response.data);
        alert('Vehicle added successfully!');
      }
      resetForm();
      fetchVehicles();
    } catch (error) {
      console.error('Vehicle add error:', error.response?.data || error);
      alert(error.response?.data?.error || error.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      vehicleNumber: vehicle.vehicleNumber,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      battery: Math.round(vehicle.battery), // Round to whole number
      range: vehicle.range,
      status: vehicle.status,
      location: vehicle.location
    });
    // Set available models for the vehicle's brand
    const vehicleCategory = vehicle.type === 'ev' ? 'cars' : vehicle.type === 'bike' ? 'bikes' : 'scooters';
    const brandData = EV_VEHICLES[vehicleCategory].find(b => b.brand === vehicle.brand);
    setAvailableModels(brandData?.models || []);
    setShowAddForm(true);
  };

  const handleTypeChange = (type) => {
    setFormData({ 
      ...formData, 
      type, 
      brand: '', 
      model: '', 
      range: 30 
    });
    setAvailableModels([]);
  };

  const handleBrandChange = (brand) => {
    const vehicleCategory = formData.type === 'ev' ? 'cars' : formData.type === 'bike' ? 'bikes' : 'scooters';
    const brandData = EV_VEHICLES[vehicleCategory].find(b => b.brand === brand);
    
    setFormData({ 
      ...formData, 
      brand, 
      model: '',
      range: brandData?.range || 30
    });
    setAvailableModels(brandData?.models || []);
  };

  const resetForm = () => {
    setFormData({
      vehicleNumber: '',
      type: 'scooter',
      brand: '',
      model: '',
      battery: 100,
      range: 30,
      status: 'available',
      location: {
        type: 'Point',
        coordinates: [77.5946, 12.9716]
      }
    });
    setEditingVehicle(null);
    setShowAddForm(false);
  };

  const getStatusColor = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      reserved: 'bg-blue-100 text-blue-800',
      'in-use': 'bg-purple-100 text-purple-800',
      maintenance: 'bg-red-100 text-red-800',
      charging: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeEmoji = (type) => {
    const emojis = {
      scooter: '🛴',
      bike: '🏍️',
      ev: '🚗'
    };
    return emojis[type] || '🛴';
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Fleet Management</h1>
            <p className="text-gray-600">Manage your vehicle fleet</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Vehicle
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {['available', 'reserved', 'in-use', 'maintenance', 'charging'].map((status) => (
            <div key={status} className="card">
              <div className="text-sm text-gray-600 mb-1 capitalize">{status}</div>
              <div className="text-2xl font-bold text-gray-900">
                {vehicles.filter(v => v.status === status).length}
              </div>
            </div>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{getTypeEmoji(vehicle.type)}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-gray-600">{vehicle.vehicleNumber}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEdit(vehicle)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Battery className="w-4 h-4" />
                    Battery
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${vehicle.battery > 50 ? 'bg-green-500' : vehicle.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${vehicle.battery}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{Math.round(vehicle.battery)}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Activity className="w-4 h-4" />
                    Range
                  </div>
                  <span className="text-sm font-semibold">{vehicle.range} km</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    Status
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(vehicle.status)}`}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingVehicle ? 'Edit Vehicle' : 'Add New EV Vehicle'} ⚡🌱
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    GreenMove supports 100% electric vehicles only
                  </p>
                </div>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-green-800">
                  <strong>🌱 Eco-Friendly Fleet:</strong> Select from pre-configured electric vehicles. All vehicles are 100% emission-free!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vehicle Number *
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleNumber}
                      onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })}
                      className="input-field"
                      required
                      placeholder="KA01AB1234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="scooter">🛴 Electric Scooter</option>
                      <option value="bike">🏍️ Electric Bike</option>
                      <option value="ev">🚗 Electric Car</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select Brand</option>
                      {(formData.type === 'ev' ? EV_VEHICLES.cars : 
                        formData.type === 'bike' ? EV_VEHICLES.bikes : 
                        EV_VEHICLES.scooters).map(({ brand }) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <select
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="input-field"
                      required
                      disabled={!formData.brand}
                    >
                      <option value="">Select Model</option>
                      {availableModels.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Battery (%) *
                    </label>
                    <input
                      type="number"
                      value={formData.battery}
                      onChange={(e) => setFormData({ ...formData, battery: parseInt(e.target.value) || 0 })}
                      className="input-field"
                      required
                      min="0"
                      max="100"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Range (km) * <span className="text-xs text-gray-500">(Auto-filled based on brand)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.range}
                      onChange={(e) => setFormData({ ...formData, range: parseInt(e.target.value) })}
                      className="input-field"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="in-use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="charging">Charging</option>
                    </select>
                  </div>

                </div>

                {/* Map for Location Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Location * <span className="text-gray-500 text-xs">(Click on map to set location)</span>
                  </label>
                  
                  {/* Location Search Bar with Autocomplete */}
                  <div className="mb-3 relative">
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => handleSearchInput(e.target.value)}
                          onFocus={() => searchResults.length > 0 && setShowResults(true)}
                          placeholder="Search location (e.g., your college, MG Road, Indiranagar...)"
                          className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-primary-500 text-sm"
                        />
                        {searching && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent" />
                          </div>
                        )}
                        
                        {/* Dropdown with search results */}
                        {showResults && searchResults.length > 0 && (
                          <div 
                            className="absolute w-full mt-1 bg-white border-2 border-primary-500 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
                            style={{ zIndex: 9999 }}
                          >
                            {searchResults.map((result, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => handleSelectLocation(result)}
                                className="w-full px-4 py-3 text-left hover:bg-primary-50 border-b border-gray-100 last:border-b-0 transition-colors"
                              >
                                <div className="flex items-start gap-2">
                                  <MapPin className="w-4 h-4 text-primary-500 mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {result.display_name.split(',')[0]}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                      {result.display_name}
                                    </p>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {searchQuery.length > 0 && searchQuery.length < 3 && (
                      <p className="text-xs text-gray-500 mt-1">Type at least 3 characters to search...</p>
                    )}
                    {searchQuery.length >= 3 && !searching && searchResults.length === 0 && !formData.location.coordinates[0] && (
                      <p className="text-xs text-orange-600 mt-1">No results found. Try a different search term.</p>
                    )}
                    {searchResults.length > 0 && !showResults && (
                      <p className="text-xs text-green-600 mt-1">✓ {searchResults.length} locations found - click input to show</p>
                    )}
                  </div>

                  <div className="relative h-64 rounded-xl overflow-hidden border-2 border-gray-200">
                    <MapContainer
                      center={[formData.location.coordinates[1], formData.location.coordinates[0]]}
                      zoom={15}
                      style={{ height: '100%', width: '100%' }}
        key={`${formData.location.coordinates[0]}-${formData.location.coordinates[1]}`}
                      >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <LocationMarker 
                        position={formData.location.coordinates}
                        setPosition={(coords) => setFormData({
                          ...formData,
                          location: { type: 'Point', coordinates: coords }
                        })}
                      />
                    </MapContainer>
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-gray-700 shadow-md">
                      📍 Click map to set location
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.location.coordinates[0]}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { 
                            type: 'Point',
                            coordinates: [parseFloat(e.target.value), formData.location.coordinates[1]] 
                          } 
                        })}
                        className="input-field text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={formData.location.coordinates[1]}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          location: { 
                            type: 'Point',
                            coordinates: [formData.location.coordinates[0], parseFloat(e.target.value)] 
                          } 
                        })}
                        className="input-field text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFleetPage;
