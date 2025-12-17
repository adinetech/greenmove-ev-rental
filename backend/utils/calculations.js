const { getDistance } = require('geolib');

/**
 * Calculate fare based on duration and distance
 * @param {number} durationMinutes - Ride duration in minutes
 * @param {number} distanceKm - Ride distance in kilometers
 * @returns {number} Total fare in INR
 */
const calculateFare = (durationMinutes, distanceKm) => {
  const baseFare = parseFloat(process.env.BASE_FARE) || 10;
  const perMinuteCharge = parseFloat(process.env.PER_MINUTE_CHARGE) || 2;
  const perKmCharge = parseFloat(process.env.PER_KM_CHARGE) || 5;

  const fare = baseFare + (durationMinutes * perMinuteCharge) + (distanceKm * perKmCharge);
  
  return Math.round(fare * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate carbon savings
 * Based on research: NITI Aayog India EV Report 2020 & IEA Global EV Outlook
 * - Average petrol car in India: ~120g CO₂/km
 * - Electric vehicle (with India's power mix): ~12g CO₂/km
 * - Net carbon saving: 108g = 0.108 kg CO₂ per km
 * 
 * @param {number} distanceKm - Distance traveled in kilometers
 * @returns {number} Carbon saved in kg CO2
 */
const calculateCarbonSavings = (distanceKm) => {
  const carbonSavingPerKm = parseFloat(process.env.CARBON_SAVING_PER_KM) || 0.108;
  
  return Math.round(distanceKm * carbonSavingPerKm * 100) / 100;
};

/**
 * Calculate distance between two coordinates
 * @param {object} start - Start location {latitude, longitude}
 * @param {object} end - End location {latitude, longitude}
 * @returns {number} Distance in kilometers
 */
const calculateDistance = (start, end) => {
  // Using geolib to calculate distance
  const distanceInMeters = getDistance(
    { latitude: start.latitude, longitude: start.longitude },
    { latitude: end.latitude, longitude: end.longitude }
  );
  
  return Math.round((distanceInMeters / 1000) * 100) / 100; // Convert to km
};

/**
 * Calculate estimated fare before ride starts
 * @param {number} distanceKm - Estimated distance in km
 * @returns {object} Fare breakdown
 */
const estimateFare = (distanceKm) => {
  const baseFare = parseFloat(process.env.BASE_FARE) || 10;
  const perKmCharge = parseFloat(process.env.PER_KM_CHARGE) || 5;
  
  // Assume average speed of 20 km/h for time estimate
  const estimatedMinutes = Math.round((distanceKm / 20) * 60);
  const perMinuteCharge = parseFloat(process.env.PER_MINUTE_CHARGE) || 2;
  
  const totalFare = baseFare + (estimatedMinutes * perMinuteCharge) + (distanceKm * perKmCharge);
  
  return {
    baseFare,
    distanceCharge: Math.round(distanceKm * perKmCharge * 100) / 100,
    timeCharge: Math.round(estimatedMinutes * perMinuteCharge * 100) / 100,
    estimatedTotal: Math.round(totalFare * 100) / 100,
    estimatedDuration: estimatedMinutes
  };
};

/**
 * Update vehicle battery based on distance traveled
 * Realistic battery consumption based on actual EV ranges
 * 
 * @param {number} currentBattery - Current battery percentage
 * @param {number} distanceKm - Distance traveled
 * @param {string} vehicleType - Type of vehicle
 * @returns {number} Updated battery percentage
 */
const updateBattery = (currentBattery, distanceKm, vehicleType) => {
  // Battery consumption per km (%) based on typical ranges
  const consumptionRates = {
    scooter: 2,    // 2% per km (~50km range at 100%)
    bike: 1.33,    // 1.33% per km (~75km range at 100%)
    ev: 1.25       // 1.25% per km (~80km range at 100%)
  };
  
  const rate = consumptionRates[vehicleType] || 2;
  const batteryUsed = distanceKm * rate;
  const newBattery = Math.max(0, currentBattery - batteryUsed);
  
  return Math.round(newBattery * 100) / 100;
};

module.exports = {
  calculateFare,
  calculateCarbonSavings,
  calculateDistance,
  estimateFare,
  updateBattery
};
