# GreenMove Backend

Backend API for GreenMove - Eco-friendly electric vehicle rental platform.

## Setup

```bash
npm install
```

Create `.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greenmove
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
BASE_FARE=10
PER_MINUTE_CHARGE=2
PER_KM_CHARGE=5
```

## Run

```bash
npm run dev
```

## Key Features

- JWT Auth + Geospatial Queries
- Ride Management + Carbon Tracking  
- Admin Dashboard + Analytics
- Fare: ₹10 + (mins × ₹2) + (km × ₹5)
- Carbon: distance × 0.108 kg CO₂
