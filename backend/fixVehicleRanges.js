const mongoose = require('mongoose');
const Vehicle = require('./models/Vehicle');

// Vehicle specs mapping
const VEHICLE_SPECS = {
  // Scooters
  'Ather': 105,
  'Ola Electric': 135,
  'TVS': 100,
  'Bajaj': 95,
  'Simple': 203,
  'Hero Electric': 85,
  // Bikes
  'Revolt': 150,
  'Tork': 120,
  'Ultraviolette': 130,
  'Oben': 187,
  // Cars
  'Tata': 315,
  'MG': 461,
  'Hyundai': 452,
  'Mahindra': 140
};

async function fixVehicleRanges() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/greenmove');
    console.log('✅ Connected to MongoDB');

    // Get all vehicles
    const vehicles = await Vehicle.find({});
    console.log(`📊 Found ${vehicles.length} vehicles to update`);

    let updated = 0;
    for (const vehicle of vehicles) {
      const correctRange = VEHICLE_SPECS[vehicle.brand];
      
      if (correctRange && vehicle.range !== correctRange) {
        vehicle.range = correctRange;
        await vehicle.save();
        console.log(`✅ Updated ${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber}): ${vehicle.range} km`);
        updated++;
      }
    }

    console.log(`\n🎉 Successfully updated ${updated} vehicles!`);
    console.log('All vehicles now have correct manufacturer range specs.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixVehicleRanges();
