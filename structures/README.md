# 🚑 Real-Time Accident Reporting System


## 📖 Overview

This project is a real-time humanitarian accident reporting system built to help emergency authorities respond faster to accidents.

**User Capabilities:**
- 📸 Upload accident photos
- 📍 Send incident location
- 🚨 Specify number of injured people

All information is instantly transmitted to the emergency dashboard via WebSocket. Once confirmed by an authorized officer, the system uses Esri ArcGIS APIs to determine the nearest ambulance and fastest route to the hospital.

## ✨ Core Features

- 📡 Real-time Communication via Socket.IO
- 🗺️ Map Visualization using Esri ArcGIS
- 🏥 Closest Facility Routing (Ambulance → Accident → Hospital)
- 🧭 Geospatial Queries with PostGIS
- 💾 Data Management with Sequelize ORM
- 🧰 RESTful API with Express.js & Node.js

## 🏗️ Tech Stack

| Category | Technologies |
|----------|---|
| Backend | Node.js, Express.js |
| Database | PostgreSQL + PostGIS |
| ORM | Sequelize |
| Frontend | HTML, CSS, JavaScript |
| Real-Time | Socket.IO |
| Mapping | Esri ArcGIS APIs |

## 📁 Project Structure

```
accident-reporting-system/
├── public/              # Frontend files
│   ├── user.html        # Report interface
│   ├── dashboard.html   # Authority interface
│   ├── main.js          # Map & WebSocket logic
│   └── style.css
├── models/              # Sequelize models
├── routes/              # Express routes
├── services/             # controllers of app
├── dataBase/            # Database configuration
├── server.js            # Backend entry point
└── package.json
```

## 🔄 How It Works

1. **User:** Reports accident with photo, location, and injury count
2. **Server:** Receives data via WebSocket and stores in PostgreSQL
3. **Dashboard:** Displays real-time accidents on map
4. **Officer:** Confirms report → System computes optimal ambulance route

## 🗄️ Database Schema

- **accidents** (id, images, injured_count, geom)
- **hospitals** (id, name, capacity, geom)
- **ambulances** (id, station_name, geom)

All geometries use PostGIS with SRID 4326.

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Ahmedhesham970/Emergency-Response-System/
cd accident-reporting-system

# Install dependencies
npm install

# Create .env file with database credentials
DB_NAME=your_db
DB_USER=your_user
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=5432
PORT=2511

# Run migrations
npx sequelize db:migrate

# Start server
npm start
```

Access at:
- User interface: http://localhost:2511/user.html
- Dashboard: http://localhost:2511/dashboard.html

## 🎯 Future Enhancements

- Authentication for dashboard users
- AI-based accident image analysis
- Historical accident hotspot analytics

## 👨‍💻 Author

**Ahmed Hesham** - Backend Developer (Node.js, Express,NestJS ,PostgreSQL, PostGIS, Sequelize)

