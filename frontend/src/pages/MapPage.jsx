import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, Zap, Battery, MapPin, X, Loader, IndianRupee, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons
const createVehicleIcon = (type, status) => {
  const color = status === 'available' ? '#22c55e' : '#94a3b8';
  return L.divIcon({
    html: `<div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 9h14M5 15h14M7 5v14M17 5v14"/>
      </svg>
    </div>`,
    className: 'custom-vehicle-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

const MapPage = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehiclesAtLocation, setVehiclesAtLocation] = useState([]); // For multiple vehicles at same spot
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [reportingIssue, setReportingIssue] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [issueData, setIssueData] = useState({ issueType: 'battery', description: '' });
  const [userLocation, setUserLocation] = useState([12.9716, 77.5946]); // Bangalore default
  
  const isAdmin = user?.role === 'admin';

  // Helper to check if two coordinates are at same location (within ~10 meters)
  const isSameLocation = (coord1, coord2) => {
    const [lng1, lat1] = coord1;
    const [lng2, lat2] = coord2;
    const threshold = 0.0001; // roughly 10 meters
    return Math.abs(lng1 - lng2) < threshold && Math.abs(lat1 - lat2) < threshold;
  };

  // Group vehicles by location
  const groupVehiclesByLocation = () => {
    const grouped = [];
    const processed = new Set();

    vehicles.forEach((vehicle, idx) => {
      if (processed.has(idx)) return;

      const sameLocation = [vehicle];
      processed.add(idx);

      vehicles.forEach((other, otherIdx) => {
        if (idx !== otherIdx && !processed.has(otherIdx)) {
          if (isSameLocation(vehicle.location.coordinates, other.location.coordinates)) {
            sameLocation.push(other);
            processed.add(otherIdx);
          }
        }
      });

      grouped.push({
        coordinates: vehicle.location.coordinates,
        vehicles: sameLocation
      });
    });

    return grouped;
  };

  const handleMarkerClick = (vehicleGroup) => {
    if (vehicleGroup.vehicles.length === 1) {
      setSelectedVehicle(vehicleGroup.vehicles[0]);
      setShowVehicleSelector(false);
    } else {
      setVehiclesAtLocation(vehicleGroup.vehicles);
      setShowVehicleSelector(true);
      setSelectedVehicle(null);
    }
  };

  const handleSelectFromGroup = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowVehicleSelector(false);
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchNearbyVehicles();
    }
  }, [userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          // Keep Bangalore default if geolocation fails
          fetchNearbyVehicles();
        }
      );
    }
  };

  const fetchNearbyVehicles = async () => {
    try {
      const { data } = await axios.get('/vehicles/nearby', {
        params: {
          lat: userLocation[0],
          lng: userLocation[1],
          radius: 5000 // 5km radius
        }
      });
      setVehicles(data.data);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async (vehicleId) => {
    setReserving(true);
    try {
      await axios.post(`/vehicles/${vehicleId}/reserve`);
      alert('Vehicle reserved for 5 minutes! Go unlock it.');
      fetchNearbyVehicles();
      setSelectedVehicle(null);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reserve vehicle');
    } finally {
      setReserving(false);
    }
  };

  const handleReportIssue = async () => {
    if (!issueData.description.trim()) {
      alert('Please provide a description');
      return;
    }

    setReportingIssue(true);
    try {
      await axios.post('/issues', {
        vehicleId: selectedVehicle._id,
        issueType: issueData.issueType,
        description: issueData.description
      });
      alert('Issue reported successfully!');
      setShowIssueForm(false);
      setIssueData({ issueType: 'battery', description: '' });
      setSelectedVehicle(null);
      fetchNearbyVehicles();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to report issue');
    } finally {
      setReportingIssue(false);
    }
  };

  const getVehicleIcon = (type) => {
    const icons = {
      scooter: '🛴',
      bike: '🏍️',
      ev: '🚗'
    };
    return icons[type] || '🛴';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="relative h-screen pt-16">
      {/* Map */}
      <MapContainer
        center={userLocation}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapUpdater center={userLocation} />

        {/* User location marker */}
        <Marker position={userLocation}>
          <Popup>Your Location</Popup>
        </Marker>

        {/* Vehicle markers - grouped by location */}
        {groupVehiclesByLocation().map((group, idx) => (
          <Marker
            key={`group-${idx}`}
            position={[group.coordinates[1], group.coordinates[0]]}
            icon={createVehicleIcon(group.vehicles[0].type, group.vehicles[0].status)}
            eventHandlers={{
              click: () => handleMarkerClick(group)
            }}
          >
            <Popup>
              <div className="text-center">
                {group.vehicles.length > 1 ? (
                  <>
                    <div className="text-2xl mb-1">🚲</div>
                    <div className="font-semibold">{group.vehicles.length} vehicles here</div>
                    <div className="text-sm text-gray-600">Click to select</div>
                  </>
                ) : (
                  <>
                    <div className="text-2xl mb-1">{getVehicleIcon(group.vehicles[0].type)}</div>
                    <div className="font-semibold">{group.vehicles[0].brand} {group.vehicles[0].model}</div>
                    <div className="text-sm text-gray-600">{Math.round(group.vehicles[0].battery)}% battery</div>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Vehicle Selector for Multiple Vehicles at Same Location */}
      <AnimatePresence>
        {showVehicleSelector && vehiclesAtLocation.length > 0 && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 glass-dark rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto z-[1000]"
          >
            <button
              onClick={() => setShowVehicleSelector(false)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">
              {vehiclesAtLocation.length} Vehicles at this Location
            </h2>
            <p className="text-gray-300 mb-6">Select a vehicle to view details</p>

            <div className="space-y-3">
              {vehiclesAtLocation.map((vehicle) => (
                <motion.button
                  key={vehicle._id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectFromGroup(vehicle)}
                  className="w-full glass rounded-2xl p-4 text-left transition-all hover:bg-white/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{getVehicleIcon(vehicle.type)}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-300">{vehicle.vehicleNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-white">
                        <Battery className="w-5 h-5" />
                        <span className="font-semibold">{Math.round(vehicle.battery)}%</span>
                      </div>
                      <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                        vehicle.status === 'available' ? 'bg-green-500' : 'bg-gray-500'
                      } text-white`}>
                        {vehicle.status}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle Details Panel */}
      <AnimatePresence>
        {selectedVehicle && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 glass-dark rounded-t-3xl p-6 max-h-[60vh] overflow-y-auto z-[1000]"
          >
            <button
              onClick={() => setSelectedVehicle(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="text-white">
              <div className="text-4xl mb-3">{getVehicleIcon(selectedVehicle.type)}</div>
              <h2 className="text-2xl font-bold mb-2">{selectedVehicle.brand} {selectedVehicle.model}</h2>
              <p className="text-gray-300 mb-4">{selectedVehicle.vehicleNumber} • <span className="capitalize">{selectedVehicle.type}</span></p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Battery className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="text-sm text-gray-400">Battery</div>
                    <div className="font-semibold">{Math.round(selectedVehicle.battery)}%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary-400" />
                  <div>
                    <div className="text-sm text-gray-400">Range (Max)</div>
                    <div className="font-semibold">{selectedVehicle.range} km</div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      ~{Math.round((selectedVehicle.battery / 100) * selectedVehicle.range)} km left
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Base Fare</span>
                  <span className="font-bold text-white flex items-center">
                    <IndianRupee className="w-4 h-4" />10
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Per Minute</span>
                  <span className="font-bold text-white flex items-center">
                    <IndianRupee className="w-4 h-4" />2
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Security Deposit</span>
                  <span className="font-bold text-white flex items-center">
                    <IndianRupee className="w-4 h-4" />5
                  </span>
                </div>
              </div>

              {!isAdmin ? (
                !showIssueForm ? (
                  <>
                    {selectedVehicle.status === 'available' ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleReserve(selectedVehicle._id)}
                        disabled={reserving}
                        className="w-full bg-white text-gray-900 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                      >
                        {reserving ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Reserving...
                          </>
                        ) : (
                          <>
                            <Zap className="w-5 h-5" />
                            Reserve for 5 mins
                          </>
                        )}
                      </motion.button>
                    ) : selectedVehicle.status === 'reserved' ? (
                      <div className="space-y-3">
                        <div className="w-full bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400 py-3 rounded-xl font-semibold text-center">
                          🎉 Reserved - Ready to Unlock!
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => window.location.href = '/active-ride'}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg mb-3"
                        >
                          <Zap className="w-5 h-5" />
                          Start Ride
                        </motion.button>
                      </div>
                    ) : (
                      <div className="w-full bg-gray-600 text-white py-4 rounded-xl font-semibold text-center mb-3">
                        {selectedVehicle.status === 'in-use' ? '🚴 Currently in Use' : 'Not Available'}
                      </div>
                    )}
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowIssueForm(true)}
                      className="w-full bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <AlertTriangle className="w-5 h-5" />
                      Report Issue
                    </motion.button>
                  </>
                ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold mb-4">Report Issue</h3>
                  
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Issue Type</label>
                    <select
                      value={issueData.issueType}
                      onChange={(e) => setIssueData({ ...issueData, issueType: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-primary-500"
                    >
                      <option value="battery">Low Battery</option>
                      <option value="mechanical">Mechanical Issue</option>
                      <option value="damage">Physical Damage</option>
                      <option value="cleanliness">Cleanliness</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Description</label>
                    <textarea
                      value={issueData.description}
                      onChange={(e) => setIssueData({ ...issueData, description: e.target.value })}
                      placeholder="Describe the issue..."
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:border-primary-500 resize-none"
                    />
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReportIssue}
                      disabled={reportingIssue}
                      className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {reportingIssue ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Reporting...
                        </>
                      ) : (
                        'Submit'
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowIssueForm(false);
                        setIssueData({ issueType: 'battery', description: '' });
                      }}
                      className="px-6 bg-gray-700 text-white py-3 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
                )
              ) : (
                <div className="w-full bg-gray-700/50 border-2 border-gray-600 text-gray-300 py-4 rounded-xl font-medium text-center">
                  👁️ Admin View - Monitoring Mode
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Stats */}
      <div className="absolute top-20 left-4 glass rounded-2xl p-4 z-[999]">
        <div className="flex items-center gap-2 text-gray-900">
          <MapPin className="w-5 h-5 text-primary-600" />
          <div>
            <div className="text-xs text-gray-600">Available</div>
            <div className="font-bold">{vehicles.filter(v => v.status === 'available').length} vehicles</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
