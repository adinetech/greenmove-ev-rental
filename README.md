# 🌱 GreenMove - Eco-Friendly Transportation Platform

**A MERN Stack Application for Managing Electric Scooters, Bikes, and EV Rentals**

> Urban commuters are increasingly opting for eco-friendly transport options. GreenMove facilitates booking, tracking, and managing green rides with a focus on sustainability.

---

## 🎯 Project Overview

GreenMove is a comprehensive platform similar to Yulu, Bounce, and Lime, enabling users to:
- 🔍 Locate nearby e-scooters/e-bikes on interactive maps
- 🚴 Book rides with real-time fare estimates
- 📊 Track ride history and carbon savings
- 🔧 Report vehicle issues or low battery
- 👨‍💼 Admin dashboard for fleet management

---

## ✨ Key Features

### User Features
- ✅ **Secure Registration & Login** - JWT authentication with password encryption (bcrypt)
- 💵 **Rs. 100 Welcome Bonus** - New users get free wallet balance on signup
- 🗺️ **Interactive Map** - Real-time vehicle locations using Leaflet maps with geospatial queries
- ⚡ **Smart Vehicle Search** - Find available vehicles within 5km radius
- 🔋 **Battery Status** - Live battery percentage and range display
- 💰 **Transparent Pricing** - Base fare (Rs. 10) + Distance (Rs. 5/km) + Time (Rs. 2/min)
- 💳 **Dual Payment System**:
  - Reward points auto-redeemed first
  - Wallet balance for remaining amount
  - 10% cashback as reward points on wallet payments
- 📄 **Professional Invoices** - GST-compliant PDF invoices with fare breakdown
- 🌿 **Carbon Footprint Tracking** - Track CO2 savings per ride (0.15kg/km)
- 🏆 **Reward Points System** - Earn points on every ride, redeem automatically
- 📊 **Comprehensive Dashboard** - Wallet, rewards, stats, active rides
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔐 **Account Management** - Update profile, address, password, delete account

### Admin Features
- 📊 **Sustainability Reports Dashboard** - Environmental impact analytics with CO2 savings
- 🚗 **Advanced Fleet Management**:
  - Add/edit/delete vehicles with real EV manufacturer specs
  - Pre-configured vehicles: Ather 450X, Ola S1 Pro, Simple One, TVS iQube, etc.
  - Accurate range data from manufacturer specifications
  - Location search with OpenStreetMap Nominatim API
  - Interactive map for vehicle placement (drag & drop)
  - Manual coordinate entry (lat/lng) with GeoJSON support
  - Fleet statistics by status (available, in-use, maintenance, charging)
- 🔋 **Battery & Maintenance Monitoring** - Track battery levels and service schedules
- 📍 **Charging Station Management** - Add/edit/delete stations with GPS coordinates
- 🐛 **Issue Reporting System** - Users can report vehicle problems
- 👥 **User Management** - View and manage registered users
- 📈 **Most Used Vehicles** - Analytics on vehicle utilization
- 🌱 **Environmental Metrics** - Carbon savings and fleet efficiency tracking

---

## 🏗️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **MongoDB** + **Mongoose** - Database & ODM
- **JWT** - Authentication
- **Geospatial Queries** - Location-based search

### Frontend
- **React 18** + **Vite** - UI framework & dev server
- **React Router** - Client-side navigation
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Leaflet** - Interactive maps with OpenStreetMap
- **jsPDF** - PDF invoice generation
- **Lucide React** - Icon library

---

## 📁 Project Structure

```
GreenMove/
├── backend/              # Express API server
│   ├── config/          # Database configuration
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & error handling
│   ├── utils/           # Helpers & calculations
│   └── server.js        # Entry point
│
├── frontend/            # React app
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Global state (AuthContext)
│   │   ├── utils/       # Helper functions (invoiceGenerator)
│   │   └── App.jsx      # Main app component
│   ├── public/          # Static assets
│   └── index.html       # Entry HTML
│
└── README.md            # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB v4.4+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd GreenMove
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

4. **Start MongoDB**
```bash
mongod
```

5. **Seed Database (Optional)**
```bash
cd backend
npm run seed
```
This creates sample vehicles, stations, and users.

6. **Start Backend Server**
```bash
cd backend
npm run dev
```
Server runs at: **http://localhost:5000**

7. **Start Frontend (New Terminal)**
```bash
cd frontend
npm run dev
```
App runs at: **http://localhost:5173**

---

## 🔑 Default Credentials

After seeding the database:

**Admin Account:**
- Email: `admin@greenmove.com`
- Password: `admin123`

**User Account:**
- Email: `john@example.com`
- Password: `password123`

---

## 📚 API Endpoints

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |
| GET | `/vehicles/nearby` | Find nearby vehicles | Public |
| POST | `/vehicles/:id/reserve` | Reserve vehicle | Private |
| POST | `/rides/start` | Start ride | Private |
| POST | `/rides/:id/end` | End ride | Private |
| GET | `/users/dashboard` | User stats | Private |
| GET | `/admin/analytics` | Admin dashboard | Admin |

**Full API documentation:** See `backend/README.md`

---

## 🧮 How It Works

### User Flow (Like Yulu/Bounce)

1. **User Registers** → Gets Rs. 100 welcome bonus in wallet
2. **Opens Map** → Sees available vehicles within 5km radius
3. **Selects Vehicle** → Views battery %, range, distance from user
4. **Reserves Ride** → Vehicle locked for 5 minutes (auto-cancels if not started)
5. **Starts Ride** → Real-time tracking, fare calculation begins
6. **Ends Ride** → Payment automatically processed:
   - Reward points redeemed first (if available)
   - Remaining amount deducted from wallet
   - Earns 10% cashback as reward points
7. **Downloads Invoice** → GST-compliant PDF with fare breakdown
8. **Tracks Impact** → Carbon savings and ride statistics updated

### Fare Calculation (Precise to 2 Decimals)
```javascript
baseFare = Rs. 10.00
timeFare = duration (mins) × Rs. 2.00
distanceFare = distance (km) × Rs. 5.00
subtotal = baseFare + timeFare + distanceFare
gst = subtotal × 18%
totalFare = subtotal + gst

// All values rounded: Math.round(value * 100) / 100
```

**Example Ride:**
- Duration: 15 mins | Distance: 3.2 km
- Base: Rs. 10.00 + Time: Rs. 30.00 + Distance: Rs. 16.00 = Rs. 56.00
- GST (18%): Rs. 10.08
- **Total: Rs. 66.08**

### Payment Processing Logic
```javascript
// Step 1: Calculate total fare with GST
totalFare = 66.08

// Step 2: Redeem reward points first (auto-applied)
rewardPointsUsed = Math.min(user.rewardPoints, totalFare)
remainingAmount = totalFare - rewardPointsUsed

// Step 3: Deduct from wallet
walletUsed = remainingAmount
user.walletBalance -= walletUsed

// Step 4: Calculate cashback (10% of wallet payment)
cashbackEarned = Math.round(walletUsed * 0.1)
user.rewardPoints += cashbackEarned

// Result stored in ride document for invoice generation
```

### Geospatial Query (Vehicle Search)
```javascript
// MongoDB geospatial index on vehicle.location
// Find vehicles within 5km radius using $near operator
vehicles = await Vehicle.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [userLongitude, userLatitude]
      },
      $maxDistance: 5000 // meters
    }
  },
  status: 'available',
  battery: { $gte: 20 }
})
```

### Carbon Savings Calculation
```
Average petrol vehicle: 150g CO₂/km
Electric vehicle: 0g CO₂/km (zero emissions)
Savings: 150g CO₂/km = 0.15kg CO₂/km

Example: 10km ride saves 1.5kg CO₂
Carbon Saved = Distance × 0.108 kg
```

---

## 📊 Database Schema

### Collections

**Users** - Authentication, wallet, reward points, stats, address (for invoices)  
**Vehicles** - Type, brand, model, location (GeoJSON Point), battery, range, status  
**Rides** - Start/end times, fare breakdown (base/distance/time), payment details, carbon savings  
**Stations** - Name, location (GeoJSON), capacity, available slots  
**Reports** - Vehicle issues, priority, resolution status  

### Key Schema Features

**GeoJSON Location Format:**
```javascript
location: {
  type: 'Point', // Required for MongoDB geospatial queries
  coordinates: [longitude, latitude] // Note: lng first, then lat!
}
```

**Ride Document Structure:**
```javascript
{
  userId, vehicleId,
  startTime, endTime,
  startLocation: { type: 'Point', coordinates: [...] },
  endLocation: { type: 'Point', coordinates: [...] },
  distance: 3.2, // km
  duration: 15, // minutes
  baseFare: 10.00, // stored separately for invoice
  distanceFare: 16.00, // stored separately for invoice
  fare: 66.08, // total with GST
  pointsRedeemed: 20, // reward points used
  cashbackEarned: 5, // 10% of wallet payment
  carbonSaved: 0.48, // kg CO2
  status: 'completed'
}
```

---

## 🌍 Sample Data

The seed script creates:
- **20 vehicles** (scooters, bikes, EVs) across Bangalore
- **5 charging stations** (MG Road, Koramangala, Indiranagar, etc.)
- **3 users** (1 admin, 2 regular users)

All with realistic Bangalore coordinates for testing.

---

## 🎨 Frontend Implementation

### Design System
- **Glassmorphism** with subtle gradients (primary-50 → white → primary-50)
- **Smooth animations** using Framer Motion
- **Micro-interactions** on all buttons (whileHover, whileTap)
- **Green accent color** (#10b981 / primary-500)
- **Responsive design** with Tailwind breakpoints

### Pages Implemented
1. ✅ **Landing Page** - Hero section, features, footer with legal links
2. ✅ **Login/Register** - JWT authentication with address field
3. ✅ **Map View** - Leaflet map with vehicle markers, real-time search
4. ✅ **Dashboard** - Wallet, rewards, stats cards, quick actions
5. ✅ **Active Ride** - Real-time tracking, fare meter, end ride button
6. ✅ **Rides History** - Filter by status, download PDF invoices
7. ✅ **Profile Page** - Edit details, change password, delete account
8. ✅ **Admin Fleet** - Add/edit vehicles, location search, interactive map
9. ✅ **Admin Stations** - Manage charging stations with GPS
10. ✅ **Admin Reports** - Sustainability metrics, CO2 savings
11. ✅ **Privacy Policy** - Comprehensive privacy documentation
12. ✅ **Terms of Service** - Legal terms and conditions
13. ✅ **About Us** - Company mission, values, contact info

### Special Features Implemented
- **PDF Invoice Generation** using jsPDF library
- **GeoJSON Support** for all location-based features
- **Nominatim API Integration** for location search
- **Auto-cancellation Timer** for expired reservations
- **Reward Points System** with auto-redemption
- **Wallet Management** with cashback
- **Account Deletion** with password confirmation and data loss warning

---

## 🔋 Battery & Charging System

### How Battery Works
- **Battery drains realistically** based on distance traveled
  - Scooters: 2% per km (~50km range)
  - Bikes: 1.33% per km (~75km range)
  - EV Cars: 1.25% per km (~80km range)
- Battery updates automatically when ride ends
- Admin can see low battery vehicles in fleet dashboard

### Charging (Production Concept)
In a real-world scenario:
1. **Automated Charging Stations** - Vehicles return to stations when battery < 20%
2. **Swappable Batteries** - Quick battery swap for scooters/bikes
3. **Gig Workers** - Pick up vehicles and charge them overnight
4. **Admin Dashboard** - Shows vehicles needing charge, dispatches chargers

For this demo: Admin manually sets battery to 100% after "charging"

### Payment System
- **Wallet-based payments** - Users maintain a balance for ride payments
- New users start with ₹100 initial balance
- Add money via "Add Money" button in Dashboard
- Payments flow: **Reward Points (auto-redeemed) → Wallet Balance**
- Low balance? Can't complete ride until wallet is topped up
- In production: Integrate UPI/Razorpay/Stripe for real money
- Current: Simulated instant wallet top-up for testing

---

## 💳 Wallet System

### Features
- **Starting Balance**: ₹100 for new users
- **Add Money**: Quick amounts (₹100, ₹250, ₹500, ₹1000, ₹2000, ₹5000)
- **Maximum Top-up**: ₹10,000 per transaction
- **Auto-Deduction**: Fare deducted automatically on ride completion
- **Insufficient Balance Protection**: Can't complete ride if wallet < fare

### Payment Flow
1. Ride fare calculated (e.g., ₹100)
2. **Step 1**: Reward points auto-redeemed (e.g., -₹30)
3. **Step 2**: Remaining amount paid from wallet (₹70)
4. **Step 3**: 10% cashback added to reward points (+7 pts)
5. Wallet balance updated and displayed

### Where to Access
- 💳 **Dashboard** - Large wallet card showing balance + "Add Money" button
- ✅ **Ride Completion** - Shows wallet balance after payment
- 🚨 **Low Balance Alert** - Error message if insufficient funds

---

## 🏆 Reward Points System

### How It Works
- **1 Point = ₹1** discount value
- **10% Cashback** on every completed ride
- **Auto-Redemption** - Points automatically applied to reduce fare

### Example Flow
1. Ride fare calculated: ₹100
2. You have 30 reward points → Auto-redeemed: -₹30
3. **Remaining fare: ₹70** (paid from wallet)
4. Wallet balance: ₹500 → ₹430
5. Cashback earned: ₹70 × 10% = **+7 points**
6. Final balances: **430 in wallet, 7 reward points**

### Where to See
- 💰 **Dashboard** - Total reward points balance with "10% cashback" label
- 🧾 **Ride History** - Shows points earned/redeemed on each completed ride
- ✅ **Ride Completion** - Alert shows points breakdown after ending ride

### Benefits
- Encourages frequent eco-friendly rides
- Transparent savings displayed on every ride
- No manual redemption needed - always get best price!

---

## 🏢 Charging Stations Management (Admin)

### Features
- **Add Stations** - Create new charging stations with GPS coordinates
- **Edit/Delete** - Manage existing stations
- **Real-time Stats** - View total slots, charging points, parked vehicles
- **Location Tracking** - Use browser GPS or manual coordinates
- **Capacity Management** - Track available vs occupied slots

### Station Properties
- Name and full address
- GPS coordinates (latitude/longitude)
- Total parking slots
- Number of charging points
- Active/inactive status
- Currently parked vehicles count

### Use Cases
- Plan where to add new stations based on demand
- Monitor station capacity and utilization
- Track which vehicles are at which stations
- Coordinate fleet distribution across city

**Access**: Navigate to **Admin → Stations** in navbar (admin users only)

---

## 📊 Sustainability Reports Dashboard (Admin)

### Key Metrics Displayed
1. **Overview Stats**
   - Total registered users
   - Complete ride count
   - Total CO₂ saved (kg)
   - Total revenue generated
   - Fleet size and avg ride duration

2. **Fleet Utilization**
   - Current utilization percentage
   - Active vehicles in real-time
   - Average rides per vehicle
   - Identifies underutilized assets

3. **Environmental Impact**
   - Total CO₂ emissions prevented
   - Equivalent car kilometers comparison
   - Trees needed to offset emissions
   - Total eco-friendly distance traveled

4. **Most Used Vehicles**
   - Top 5 vehicles by ride count
   - Revenue generated per vehicle
   - Total distance covered
   - Helps identify high-performing assets

### Sustainability Calculations
- **CO₂ Formula**: 0.108 kg saved per km (based on NITI Aayog India EV Report 2020)
- **Car Equivalent**: 1 kg CO₂ = 2.43 km by petrol car
- **Tree Offset**: 1 tree absorbs ~21.77 kg CO₂ per year

**Access**: Navigate to **Admin → Reports** in navbar (admin users only)

---

## 🔧 Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greenmove
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
BASE_FARE=10
PER_MINUTE_CHARGE=2
PER_KM_CHARGE=5
CARBON_SAVING_PER_KM=0.108
```

---

## 📝 Problem Statement (College Project)

**MERN Stack – Eco-Friendly Transportation Platform**

**Context:**  
Urban commuters are increasingly opting for eco-friendly transport options like electric scooters, bikes, and shared EVs.

**Challenge:**  
Build "GreenMove" to facilitate booking, tracking, and managing green rides.

**Requirements:**
- ✅ Secure authentication (JWT)
- ✅ Geospatial queries for nearby vehicles
- ✅ Real-time fare estimation
- ✅ Ride history & carbon tracking
- ✅ Issue reporting
- ✅ Admin fleet management

**Advanced Features (Implemented):**
- ✅ Rewards for frequent riders
- ✅ Carbon footprint calculator
- ✅ Real-time vehicle tracking
- ✅ Analytics dashboard

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env
```

### GeoJSON Location Error (Admin Manual Update)
**Error:** `unknown GeoJSON type: { coordinates: [...] }`

**Cause:** Old vehicles in database missing `type: "Point"` field

**Solution:**
```javascript
// All location objects MUST have this structure:
location: {
  type: 'Point',        // Required for MongoDB geospatial queries
  coordinates: [lng, lat]  // [longitude, latitude] order
}

// Fix existing vehicles in MongoDB:
db.vehicles.updateMany(
  { "location.type": { $exists: false } },
  { $set: { "location.type": "Point" } }
)
```

**Frontend Fix:** Already implemented - all location updates now include `type: 'Point'`

### Invoice PDF Symbol Issues
**Problem:** Rupee symbol (₹) shows weird spacing or ¹ characters

**Solution:** Use "Rs." notation instead of ₹ symbol
- ✅ `Rs. 100.00` (works in PDF)
- ❌ `₹100.00` (font rendering issues)

### Fare Showing Long Decimals
**Problem:** Fare displays as `₹0.050000000071`

**Solution:** Apply `.toFixed(2)` on display:
```javascript
// Display in UI
<span>{(ride.fare || 0).toFixed(2)}</span>

// Store in database (backend)
fare = Math.round(fare * 100) / 100
```

---

## 🚧 Roadmap

- [x] Backend API with all endpoints
- [x] Database models and relationships
- [x] JWT authentication with role-based access
- [x] Geospatial queries with GeoJSON Point format
- [x] Admin fleet management with location search
- [x] Charging stations management
- [x] Sustainability reports with analytics
- [x] Reward points system (10% cashback)
- [x] Wallet payment system
- [x] Frontend React app with all pages
- [x] PDF invoice generation (GST-compliant)
- [x] Account management (delete account)
- [x] Privacy Policy & Terms of Service
- [x] About Us page
- [ ] Real-time tracking with Socket.io
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Mobile app (React Native)

---

## 📦 Deliverables

✅ **Full-Stack MERN Application** - Complete frontend + backend  
✅ **MongoDB with GeoJSON** - Geospatial indexes for location queries  
✅ **JWT Authentication** - Secure login with bcrypt password hashing  
✅ **Role-Based Access Control** - User and Admin roles  
✅ **Wallet System** - Rs. 100 welcome bonus, automatic payments  
✅ **Reward Points** - 10% cashback, auto-redemption  
✅ **PDF Invoice Generation** - GST-compliant with jsPDF  
✅ **Payment Flow** - Reward points → Wallet → Cashback  
✅ **Geospatial Search** - Find vehicles within 5km radius  
✅ **Real EV Database** - 16 brands with accurate specs (Ather, Ola, Simple, TVS, etc.)  
✅ **Admin Fleet Management** - Add/edit vehicles with map interface  
✅ **Location Search** - OpenStreetMap Nominatim API integration  
✅ **Charging Stations** - GPS-based station management  
✅ **Sustainability Dashboard** - CO2 savings, fleet utilization, revenue  
✅ **Carbon Calculator** - 0.15kg CO2 saved per km (research-based)  
✅ **Account Management** - Profile editing, password change, account deletion  
✅ **Legal Pages** - Privacy Policy, Terms of Service, About Us  
✅ **Professional UI/UX** - Tailwind CSS, Framer Motion animations, glassmorphism  
✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **Comprehensive Documentation** - Setup guides, API docs, README  

---

## 🎯 Technical Highlights

### Advanced Features Implemented

1. **Precise Fare Calculation**
   - All amounts rounded to 2 decimals: `Math.round(value * 100) / 100`
   - Separate storage of baseFare, distanceFare for detailed invoices
   - 18% GST calculation and display

2. **GeoJSON Location Handling**
   - Proper `type: 'Point'` field for all locations
   - MongoDB 2dsphere index for geospatial queries
   - Support for both map click and manual lat/lng entry

3. **Payment Architecture**
   - Smart auto-redemption: reward points → wallet → cashback
   - Transaction tracking in ride documents
   - Wallet balance protection (cannot go negative)

4. **Invoice System**
   - Professional PDF layout with company branding
   - BILL TO section with user address
   - Fare breakdown table (Base, Distance, GST, Total)
   - Payment details (Points Redeemed, Wallet Used, Cashback)
   - "Rs." notation instead of ₹ for PDF font compatibility

5. **Location Search**
   - Nominatim API integration with debouncing (800ms)
   - Dropdown results with full address display
   - Click map or search or manual coordinates
   - Real-time location detection with browser GPS

6. **Security Features**
   - Password hashing with bcrypt (10 rounds)
   - JWT tokens with 7-day expiration
   - Password confirmation for profile updates
   - Password verification for account deletion
   - Data loss warning modal before deletion

---

## 🙏 Acknowledgments

Inspired by real-world eco-mobility platforms:
- Yulu (India) 🇮🇳
- Bounce (India) 🛵
- Lime (Global) 🛴
- Bird (Global) 🛴

Vehicle data sourced from official manufacturer specifications (2024-2025 models).

---

## 👨‍💻 Development

**Backend Status:** ✅ Complete & Production Ready  
**Frontend Status:** ✅ Complete & Production Ready  
**Testing:** ✅ Fully Functional & Demo Ready  
**Documentation:** ✅ Comprehensive Setup & API Guides  

---

## 📞 Support

For issues or questions about the project, check the documentation in `backend/README.md`.

---

**Built with 💚 for sustainable urban mobility**
