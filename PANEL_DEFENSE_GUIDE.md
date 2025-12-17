# 🎓 GreenMove Panel Defense Guide - Full Stack MERN Explained

## 📚 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack Explained](#tech-stack-explained)
3. [How React Works (Basics)](#how-react-works-basics)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Design](#database-design)
7. [Key Features Explained](#key-features-explained)
8. [Interview Questions & Answers](#interview-questions--answers)

---

## Project Overview

**What is GreenMove?**
An electric vehicle rental platform (like Yulu/Bounce) where users can:
- Find nearby electric scooters/bikes on a map
- Reserve and rent vehicles
- Pay using wallet/reward points
- Track carbon savings
- Admins manage fleet and view analytics

**Problem Statement:** Urban pollution from petrol vehicles. Solution: Make EVs accessible via rentals.

---

## Tech Stack Explained

### 🎨 Frontend (What Users See)

**React.js** - A JavaScript library for building user interfaces
- Think of it like Lego blocks for websites
- You build small pieces (components) and combine them
- Example: A button is one component, a form is another

**Why React?**
- **Reusable Components** - Write once, use everywhere
- **Fast** - Only updates what changes (Virtual DOM)
- **Popular** - Huge community, lots of help available

**Other Frontend Tools:**
- **Vite** - Dev server (makes your code run in browser)
- **Tailwind CSS** - Styling (makes things look pretty)
- **Axios** - Talks to backend (sends/receives data)
- **React Router** - Page navigation (/map, /dashboard, /rides)
- **Leaflet** - Interactive maps with vehicle markers
- **Framer Motion** - Smooth animations

### ⚙️ Backend (Brain of the App)

**Node.js + Express** - JavaScript on the server
- Node.js = JavaScript outside browser
- Express = Framework to build APIs easily

**What's an API?**
Think of it like a waiter in a restaurant:
1. Frontend (you) asks: "Get me nearby vehicles"
2. Backend (waiter) goes to database (kitchen)
3. Backend brings back data (your food)

**MongoDB** - Database (where all data is stored)
- NoSQL database (stores data as JSON-like documents)
- Flexible, easy to work with JavaScript
- Example: User data, vehicle data, ride history

**Mongoose** - Makes talking to MongoDB easy
- Like a translator between your code and database

### 🔐 Security

**JWT (JSON Web Tokens)** - Authentication
- When you login, you get a "token" (like a movie ticket)
- You show this token to access protected pages
- Token expires after 7 days

**bcrypt** - Password encryption
- Never store passwords as plain text
- Converts "password123" → gibberish hash
- Even if database is hacked, passwords are safe

---

## How React Works (Basics)

### Components (Building Blocks)

A component is a reusable piece of UI. Example:

```javascript
// Simple component
function Button() {
  return <button>Click Me</button>;
}

// You can use it anywhere
<Button />
<Button />
<Button />
```

### Props (Passing Data)

Props are like function arguments:

```javascript
function Greeting(props) {
  return <h1>Hello {props.name}!</h1>;
}

<Greeting name="John" />  // Shows: Hello John!
<Greeting name="Sarah" /> // Shows: Hello Sarah!
```

### State (Memory)

State is component's memory (data that changes):

```javascript
const [count, setCount] = useState(0);

// count = current value
// setCount = function to update it

<button onClick={() => setCount(count + 1)}>
  Clicked {count} times
</button>
```

### useEffect (Side Effects)

Runs code when component loads or updates:

```javascript
useEffect(() => {
  // Fetch data from API when page loads
  fetchVehicles();
}, []); // Empty array = run once on load
```

### Example: Complete Component

```javascript
import { useState, useEffect } from 'react';

function VehicleList() {
  // State: store vehicles
  const [vehicles, setVehicles] = useState([]);
  
  // Effect: fetch on load
  useEffect(() => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => setVehicles(data));
  }, []);
  
  // Render UI
  return (
    <div>
      <h1>Available Vehicles</h1>
      {vehicles.map(vehicle => (
        <div key={vehicle._id}>
          {vehicle.brand} {vehicle.model}
        </div>
      ))}
    </div>
  );
}
```

---

## Frontend Architecture

### File Structure

```
frontend/src/
├── components/       # Reusable UI pieces
│   └── Navbar.jsx   # Top navigation bar
├── pages/           # Full pages
│   ├── MapPage.jsx      # Map with vehicles
│   ├── Dashboard.jsx    # User stats
│   ├── RidesPage.jsx    # Ride history
│   └── AdminFleetPage.jsx
├── context/         # Global state
│   └── AuthContext.jsx  # User login state
├── utils/           # Helper functions
│   └── invoiceGenerator.js
└── App.jsx          # Main app entry
```

### Key Concepts

**React Router (Navigation)**
```javascript
<Routes>
  <Route path="/map" element={<MapPage />} />
  <Route path="/dashboard" element={<Dashboard />} />
</Routes>
```

**Context (Global State)**
- Instead of passing user data to every component
- Store it globally and access anywhere
- Example: `const { user } = useAuth();`

**Protected Routes**
- Some pages only for logged-in users
- Check if user exists, else redirect to login

---

## Backend Architecture

### REST API Design

**CRUD Operations:**
- **C**reate - POST request
- **R**ead - GET request
- **U**pdate - PUT request
- **D**elete - DELETE request

### Example Routes

```javascript
// User routes
POST   /api/auth/register  - Create account
POST   /api/auth/login     - Login
GET    /api/auth/me        - Get current user

// Vehicle routes
GET    /api/vehicles/nearby?lat=19.03&lng=73.06  - Find vehicles
POST   /api/vehicles/:id/reserve  - Reserve vehicle

// Ride routes
POST   /api/rides/start    - Start ride
PUT    /api/rides/:id/end  - End ride
GET    /api/rides/history  - Get ride history
```

### Middleware

Middleware = Functions that run before your main code

**Auth Middleware:**
```javascript
// Checks if user is logged in
const protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Not authorized' });
  
  // Verify token
  const user = jwt.verify(token);
  req.user = user;  // Add user to request
  next();  // Continue to actual route
};
```

**Usage:**
```javascript
router.get('/dashboard', protect, getDashboard);
// First runs protect, then getDashboard
```

---

## Database Design

### Collections (Tables)

**Users Collection:**
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  walletBalance: 100,
  rewardPoints: 0,
  role: "user"
}
```

**Vehicles Collection:**
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  vehicleNumber: "MH12EV8836",
  brand: "Ather",
  model: "450X",
  battery: 100,
  range: 105,
  status: "available",
  location: {
    type: "Point",
    coordinates: [73.063, 19.036]  // [lng, lat]
  }
}
```

**Rides Collection:**
```javascript
{
  _id: "507f1f77bcf86cd799439013",
  userId: "507f1f77bcf86cd799439011",
  vehicleId: "507f1f77bcf86cd799439012",
  startTime: "2025-12-17T10:00:00Z",
  endTime: "2025-12-17T10:15:00Z",
  distance: 3.2,  // km
  duration: 15,   // minutes
  fare: 66.08,
  pointsRedeemed: 20,
  cashbackEarned: 5,
  carbonSaved: 0.48,  // kg CO2
  status: "completed"
}
```

### GeoJSON (Location Data)

MongoDB has special support for location searches:

```javascript
// Find vehicles within 5km
Vehicle.find({
  location: {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [73.063, 19.036]
      },
      $maxDistance: 5000  // meters
    }
  }
})
```

**Why GeoJSON format?**
- `type: 'Point'` tells MongoDB it's a location
- `coordinates: [lng, lat]` (longitude first!)
- Enables fast location-based queries

---

## Key Features Explained

### 1. User Registration & Login

**Flow:**
1. User fills form (name, email, password)
2. Frontend sends POST to `/api/auth/register`
3. Backend hashes password with bcrypt
4. Saves user to MongoDB
5. User gets Rs. 100 welcome bonus in wallet
6. Backend creates JWT token
7. Frontend stores token in localStorage
8. User is logged in!

**Code (Backend):**
```javascript
// Register
const password = await bcrypt.hash(req.body.password, 10);
const user = await User.create({
  name: req.body.name,
  email: req.body.email,
  password,
  walletBalance: 100  // Welcome bonus
});

const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
res.json({ token, user });
```

### 2. Finding Nearby Vehicles

**Frontend (MapPage.jsx):**
```javascript
useEffect(() => {
  // Get user's location from browser
  navigator.geolocation.getCurrentPosition((position) => {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    
    // Fetch nearby vehicles
    fetchVehicles(lat, lng);
  });
}, []);

const fetchVehicles = async (lat, lng) => {
  const { data } = await axios.get(
    `/vehicles/nearby?lat=${lat}&lng=${lng}&radius=5`
  );
  setVehicles(data.data);
};
```

**Backend (vehicleController.js):**
```javascript
const vehicles = await Vehicle.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [lng, lat] },
      $maxDistance: 5000  // 5km in meters
    }
  },
  status: 'available',
  battery: { $gte: 20 }  // At least 20% battery
});
```

### 3. Ride Flow (Complete Journey)

**Step 1: Reserve Vehicle**
```javascript
// Frontend
await axios.post(`/vehicles/${vehicleId}/reserve`);

// Backend
vehicle.status = 'reserved';
const ride = await Ride.create({
  userId,
  vehicleId,
  status: 'reserved'
});

// Auto-cancel after 5 minutes
setTimeout(() => {
  if (ride.status === 'reserved') {
    ride.status = 'cancelled';
    vehicle.status = 'available';
  }
}, 5 * 60 * 1000);
```

**Step 2: Start Ride**
```javascript
// Backend
ride.status = 'active';
ride.startTime = new Date();
ride.startLocation = { type: 'Point', coordinates: [lng, lat] };
vehicle.status = 'in-use';
```

**Step 3: End Ride & Calculate Fare**
```javascript
// Backend
const duration = (new Date() - ride.startTime) / 1000 / 60; // minutes
const distance = calculateDistance(startLocation, endLocation); // km

// Fare calculation
const baseFare = 10;
const timeFare = duration * 2;      // Rs. 2/min
const distanceFare = distance * 5;   // Rs. 5/km
const subtotal = baseFare + timeFare + distanceFare;
const gst = subtotal * 0.18;         // 18% GST
const totalFare = subtotal + gst;

// Round to 2 decimals
ride.fare = Math.round(totalFare * 100) / 100;
```

**Step 4: Payment Processing**
```javascript
// Auto-redeem reward points
const pointsToRedeem = Math.min(user.rewardPoints, ride.fare);
const remainingAmount = ride.fare - pointsToRedeem;

// Deduct from wallet
user.walletBalance -= remainingAmount;

// 10% cashback
const cashback = Math.round(remainingAmount * 0.1);
user.rewardPoints += cashback;

ride.pointsRedeemed = pointsToRedeem;
ride.cashbackEarned = cashback;
```

**Step 5: Carbon Savings**
```javascript
const carbonSaved = distance * 0.15; // 0.15 kg CO2 per km
ride.carbonSaved = carbonSaved;
user.carbonSaved += carbonSaved;
```

### 4. PDF Invoice Generation

**Frontend (invoiceGenerator.js):**
```javascript
import jsPDF from 'jspdf';

export const generateInvoice = (ride, user) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('GreenMove', 20, 20);
  
  // BILL TO
  doc.text('BILL TO:', 20, 50);
  doc.text(user.name, 20, 60);
  doc.text(user.address, 20, 70);
  
  // Fare Breakdown Table
  doc.text('Base Fare', 20, 100);
  doc.text(`Rs. ${ride.baseFare.toFixed(2)}`, 150, 100);
  
  doc.text('Distance Charges', 20, 110);
  doc.text(`Rs. ${ride.distanceFare.toFixed(2)}`, 150, 110);
  
  doc.text('GST (18%)', 20, 120);
  doc.text(`Rs. ${(ride.fare * 0.18).toFixed(2)}`, 150, 120);
  
  // Total
  doc.text('TOTAL', 20, 140);
  doc.text(`Rs. ${ride.fare.toFixed(2)}`, 150, 140);
  
  // Download
  doc.save(`invoice-${ride._id}.pdf`);
};
```

**Why "Rs." instead of ₹?**
- PDF fonts don't support Unicode symbols well
- "Rs." renders perfectly in all cases

### 5. Admin Fleet Management

**Adding a Vehicle:**
```javascript
// Frontend form data
const vehicleData = {
  vehicleNumber: 'MH12EV8836',
  type: 'scooter',
  brand: 'Ather',
  model: '450X',
  battery: 100,
  range: 105,
  status: 'available',
  location: {
    type: 'Point',
    coordinates: [73.063, 19.036]  // From map click or search
  }
};

// Backend creates vehicle
const vehicle = await Vehicle.create(vehicleData);
```

**Location Search (Nominatim API):**
```javascript
// User types "MG Road, Bangalore"
const response = await fetch(
  `https://nominatim.openstreetmap.org/search?q=MG Road Bangalore&format=json`
);
const results = await response.json();

// Show dropdown with results
// When user clicks, set coordinates
```

---

## Interview Questions & Answers

### General Questions

**Q1: What is your project about?**
> "GreenMove is a full-stack EV rental platform like Yulu. Users can find nearby electric vehicles on a map, rent them, and pay via wallet/reward points. Admins manage the fleet and view sustainability reports. It's built with MERN stack - MongoDB, Express, React, and Node.js."

**Q2: Why did you choose MERN stack?**
> "All JavaScript - same language for frontend and backend. React for dynamic UI, Node.js for scalable backend, MongoDB for flexible data storage (especially good for geospatial queries). Plus huge community support."

**Q3: What problem does this solve?**
> "Urban pollution from petrol vehicles. GreenMove makes EVs accessible via rentals instead of expensive ownership. Users save money, reduce carbon footprint, and get last-mile connectivity."

### React Questions

**Q4: What is React and why use it?**
> "React is a JavaScript library for building UIs using reusable components. It's fast (Virtual DOM), has a huge ecosystem, and makes complex UIs manageable by breaking them into small pieces."

**Q5: What are React Hooks?**
> "Hooks let you use state and lifecycle in function components. Main ones I used:
> - useState: Store component data (like vehicles list)
> - useEffect: Run code on mount/update (like API calls)
> - useContext: Access global state (like logged-in user)"

**Q6: Explain useState with example**
```javascript
const [count, setCount] = useState(0);
// count = current value (0)
// setCount = function to update it
// When you call setCount(1), component re-renders with new value
```

**Q7: What is useEffect?**
> "It runs side effects - API calls, timers, subscriptions. The dependency array controls when it runs. Empty array means run once on mount. If you put variables, it runs when they change."

**Q8: What is React Router?**
> "It handles navigation between pages without page reload. I used it for /map, /dashboard, /rides routes. Also have protected routes that redirect to login if not authenticated."

**Q9: What is Context API?**
> "It's for global state management. Instead of passing user data through every component (prop drilling), I store it in AuthContext and access anywhere with useAuth() hook."

### Backend Questions

**Q10: Explain the backend architecture**
> "RESTful API with Express.js. Routes handle HTTP requests (GET/POST/PUT/DELETE), controllers have business logic, models define database schemas, middleware handles auth/validation."

**Q11: How does authentication work?**
> "JWT tokens. User logs in, backend verifies password (bcrypt), creates a signed token, sends to frontend. Frontend stores it and sends with every request. Backend middleware verifies token before allowing access to protected routes."

**Q12: What is middleware?**
> "Functions that run before route handlers. I use auth middleware to verify JWT tokens, error middleware to handle errors consistently."

**Q13: How do you handle passwords securely?**
> "Never store plain text. Use bcrypt to hash passwords with salt rounds. Even if database is compromised, attackers can't reverse the hash."

### Database Questions

**Q14: Why MongoDB?**
> "NoSQL, flexible schema (no migrations), works naturally with JavaScript (JSON-like documents), great for geospatial queries with GeoJSON support."

**Q15: What is Mongoose?**
> "ODM (Object Data Modeling) library for MongoDB. It provides schemas, validation, middleware hooks, and makes queries easier with a cleaner API."

**Q16: Explain geospatial queries**
> "MongoDB supports location-based searches. I store vehicle locations as GeoJSON Points with coordinates. Then use $near operator to find vehicles within 5km radius of user's location."

**Q17: What is GeoJSON?**
```javascript
location: {
  type: 'Point',  // Required for MongoDB geospatial index
  coordinates: [longitude, latitude]  // Note: lng first!
}
```

### Feature-Specific Questions

**Q18: How does the map work?**
> "I use Leaflet.js library. Get user's GPS location with navigator.geolocation, fetch nearby vehicles from backend with geospatial query, display as markers on OpenStreetMap tiles. Click marker to see vehicle details."

**Q19: Explain the fare calculation**
```javascript
baseFare = 10
timeFare = duration × 2  // Rs. 2/min
distanceFare = distance × 5  // Rs. 5/km
subtotal = baseFare + timeFare + distanceFare
gst = subtotal × 0.18  // 18%
totalFare = subtotal + gst
// All rounded to 2 decimals
```

**Q20: How does the payment system work?**
> "Three-tier system: 
> 1. Reward points auto-redeemed first (1 point = Rs. 1)
> 2. Remaining from wallet balance
> 3. Earn 10% cashback as reward points
> All transactions stored in ride document for invoice generation."

**Q21: How do you generate invoices?**
> "Using jsPDF library. Create PDF with company details, bill to (user address), ride details, fare breakdown table, payment info. Use 'Rs.' notation instead of ₹ symbol for proper PDF rendering."

**Q22: What's the reward points logic?**
```javascript
// At ride end
pointsUsed = min(user.rewardPoints, fare)
amountFromWallet = fare - pointsUsed
cashback = round(amountFromWallet × 0.1)
user.rewardPoints -= pointsUsed
user.rewardPoints += cashback
```

**Q23: How do you calculate carbon savings?**
> "Research shows EVs save 0.15kg CO2 per km vs petrol vehicles. So: carbonSaved = distance × 0.15. Track per ride and cumulative for user."

### Technical Deep Dives

**Q24: Explain the complete ride flow**
> "1. Reserve (5 min timer), 2. Start (record time/location), 3. Active (real-time tracking), 4. End (calculate fare/distance), 5. Payment (points→wallet→cashback), 6. Update stats (carbon, rides, distance), 7. Generate invoice"

**Q25: How do you handle concurrent reservations?**
> "Database-level check. When reserving, query checks if vehicle status is 'available'. If two users reserve simultaneously, only first one succeeds due to MongoDB atomic operations."

**Q26: Why round battery to whole numbers?**
> "UX - nobody shows battery as 99.86%. Also fixes HTML5 input validation (step='1' only allows integers). Round on display AND when editing."

**Q27: What's the difference between Points and Rupees?**
> "Points are loyalty rewards (earned via cashback). 1 Point = Rs. 1 discount value. But you can't withdraw points - only redeem on rides."

### Admin Features

**Q28: What can admins do?**
> "Fleet management (add/edit vehicles with location search), Station management (charging locations), Sustainability reports (CO2 saved, revenue, fleet utilization, most-used vehicles)."

**Q29: How does location search work?**
> "Integrated OpenStreetMap Nominatim API. User types location, debounced search (800ms delay), show results dropdown, click to set coordinates. Also supports manual lat/lng entry and browser GPS."

**Q30: What are stations used for?**
> "Currently infrastructure planning. Admins can add charging stations with GPS coordinates, track capacity, and plan fleet distribution. Future: enforce station-based returns like bike-sharing systems."

### Code Quality

**Q31: How do you handle errors?**
> "Try-catch blocks in async functions, centralized error middleware in backend, user-friendly messages in frontend, console logging for debugging."

**Q32: How do you validate data?**
> "Frontend: HTML5 validation + React state checks. Backend: Mongoose schema validation (required fields, min/max, regex patterns)."

**Q33: What about security?**
> "JWT auth, bcrypt passwords, protected routes, CORS config, input validation, password confirmation for sensitive actions (delete account), no sensitive data in tokens."

### Challenges & Solutions

**Q34: What challenges did you face?**
> "1. GeoJSON format - needed 'type: Point' field for MongoDB queries
> 2. Decimal precision - used Math.round(val × 100) / 100 for money
> 3. PDF rupee symbol - switched to 'Rs.' for compatibility
> 4. Payment flow - ensuring points→wallet→cashback logic is atomic"

**Q35: How did you test?**
> "Manual testing: Created test accounts, booked rides, tested all user flows, checked admin features, verified invoices download correctly, tested on different screen sizes."

### Future Improvements

**Q36: What would you add next?**
> "Real-time tracking with Socket.io, Razorpay payment gateway, station-based returns (enforce parking at stations), mobile app with React Native, push notifications, ride sharing, vehicle health monitoring."

---

## Quick Reference Cheat Sheet

### React Basics
```javascript
// Component
function MyComponent() { return <div>Hello</div>; }

// Props
<Greeting name="John" />

// State
const [value, setValue] = useState(0);

// Effect
useEffect(() => { fetchData(); }, []);

// Context
const { user } = useAuth();
```

### Backend Patterns
```javascript
// Route
router.get('/path', controller);

// Controller
exports.handler = async (req, res) => {
  try {
    const data = await Model.find();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware
const auth = (req, res, next) => {
  // Check token
  next();
};
```

### Database Queries
```javascript
// Find all
await User.find();

// Find one
await User.findById(id);

// Create
await User.create({ name: 'John' });

// Update
await User.findByIdAndUpdate(id, { name: 'Jane' });

// Delete
await User.findByIdAndDelete(id);

// Geospatial
await Vehicle.find({
  location: {
    $near: {
      $geometry: { type: 'Point', coordinates: [lng, lat] },
      $maxDistance: 5000
    }
  }
});
```

---

## 🎯 Final Tips for Panel

1. **Be Confident:** You built a working full-stack app!
2. **Know Your Flow:** Explain user journey (register → find → reserve → ride → pay)
3. **Show, Don't Just Tell:** Demo the app live
4. **Admit Gaps:** "I'd implement X in production" is better than faking knowledge
5. **Focus on Logic:** Understand WHY, not just HOW
6. **Use Simple Words:** Don't over-complicate explanations
7. **Highlight Unique Features:** Reward points, PDF invoices, geospatial queries, GeoJSON
8. **Mention Scalability:** "Could add caching, load balancing, microservices"
9. **Real-World Connection:** Compare to Yulu/Bounce/Lime
10. **Be Honest:** If you don't know something, say "I'll learn that next"

---

## 🚀 You Got This!

Remember:
- You have a **WORKING** full-stack application
- You understand the **FLOW** even if not every line of code
- You can **EXPLAIN** the problem it solves
- You can **DEMO** key features
- You know the **TECH STACK** components

**The professor cares more about UNDERSTANDING than memorizing syntax!**

Good luck! 🍀💚

---

**Last Updated:** December 17, 2025
**Project:** GreenMove - EV Rental Platform
**Stack:** MongoDB + Express + React + Node.js (MERN)
