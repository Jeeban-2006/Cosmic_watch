# COSMIC Watch - Near-Earth Object Monitoring System

A full-stack web application that tracks and analyzes Near-Earth Objects (NEOs) using real-time data from NASA's API, providing intelligent risk assessment and personalized alerts for potential asteroid threats.

---

## 📋 Problem Statement

Understanding asteroid threats requires specialized knowledge of orbital mechanics, astronomical units, and complex datasets. Most people lack the expertise to interpret raw space agency data, making it difficult to:

- Assess which asteroids pose actual risk
- Track specific objects of concern over time
- Receive timely notifications about close approaches
- Understand the scale and urgency of potential threats

---

## 💡 Solution Overview

**NEO Watch** democratizes space hazard awareness by transforming complex NASA datasets into actionable intelligence. The platform:

- **Simplifies** astronomical data into clear, visual risk indicators
- **Automates** monitoring of potentially hazardous asteroids
- **Personalizes** alerts based on user-selected objects of interest
- **Calculates** risk scores using velocity, proximity, and size metrics
- **Visualizes** close-approach events through intuitive dashboards

Users can register, browse current asteroid data, add objects to their watchlist, and receive notifications when tracked asteroids approach Earth—all without understanding orbital mechanics.

---

## 🏗️ System Architecture

### High-Level Overview

The application follows a **three-tier architecture**:

1. **Frontend Layer (React)**: Single-page application providing responsive UI, data visualization, and user interaction handling
2. **Backend Layer (Express)**: RESTful API server managing business logic, authentication, data processing, and risk calculation
3. **Data Layer (PostgreSQL)**: Relational database storing user accounts, watchlists, historical data, and alert configurations

### Data Flow

```
NASA NeoWs API → Backend (Data Ingestion) → Risk Analysis Engine → PostgreSQL Database
                                                                            ↓
User Browser ← Frontend (React) ← Backend API (Express) ← Database Query Results
```

**Key Processes:**

- **Authentication**: JWT-based token system secures endpoints and sessions
- **Data Sync**: Scheduled jobs fetch latest NEO data from NASA's API
- **Risk Scoring**: Custom algorithm evaluates threat level using multi-factor analysis
- **Alert System**: Background process monitors watchlist items and triggers notifications

---

## ✨ Features

### Core Functionality

- 🔐 **User Authentication & Authorization** - Secure registration, login, and session management with JWT
- 🌌 **Live Asteroid Data** - Real-time NEO information from NASA's Near-Earth Object Web Service
- ⚠️ **Risk Analysis Engine** - Automated scoring based on velocity, miss distance, and diameter
- 📊 **Interactive Dashboard** - Visual analytics with charts, graphs, and sortable tables
- ⭐ **Personal Watchlist** - Save and track specific asteroids of interest
- 🔔 **Automated Alerts** - Notifications for close-approach events of tracked objects
- 📱 **Responsive Design** - Mobile-friendly interface using Tailwind CSS
- 🐳 **Containerized Deployment** - Docker Compose for one-command setup

### User Experience

- Browse asteroid catalog with filtering and search
- View detailed object information (size, velocity, trajectory)
- Risk scores displayed with color-coded indicators
- Historical close-approach data and upcoming events
- User profile management and notification preferences

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Component-based UI framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing
- **Chart.js / Recharts** - Data visualization

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Node-cron** - Task scheduling for data fetching

### External APIs
- **NASA NeoWs API** - Near-Earth Object data source

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** (optional) - Reverse proxy and static file serving

---

## 📁 Folder Structure

```
neo-watch/
├── client/                    # Frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── pages/           # Page-level components
│   │   ├── services/        # API integration layer
│   │   ├── utils/           # Helper functions
│   │   ├── context/         # React Context for state
│   │   ├── App.jsx          # Root component
│   │   └── main.jsx         # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── server/                   # Backend application
│   ├── controllers/         # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API route definitions
│   ├── middleware/          # Auth, validation, error handling
│   ├── services/            # Business logic (NASA API, risk scoring)
│   ├── config/              # Configuration files
│   ├── utils/               # Helper functions
│   ├── app.js               # Express app setup
│   ├── server.js            # Server entry point
│   ├── package.json
│   └── Dockerfile
├── database/                # Database scripts
│   ├── init.sql            # Schema initialization
│   └── seed.sql            # Sample data
├── docker-compose.yml       # Multi-container orchestration
├── .env.example            # Environment variable template
├── .gitignore
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Docker & Docker Compose** (for containerized setup)
- **NASA API Key** - Get yours free at [NASA API Portal](https://api.nasa.gov/)

### Option 1: Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/neo-watch.git
cd neo-watch
```

#### 2. Database Setup
```bash
# Start PostgreSQL service
# Create database
createdb neo_watch

# Run migration scripts
psql -d neo_watch -f database/init.sql
```

#### 3. Backend Setup
```bash
cd server
npm install

# Create .env file (see Environment Variables section)
cp ../.env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

#### 4. Frontend Setup
```bash
cd client
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

#### 5. Access Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

### Option 2: Docker Setup (Recommended)

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/neo-watch.git
cd neo-watch
```

#### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your NASA API key and other settings
```

#### 3. Build and Run
```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

#### 4. Access Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- Database: `localhost:5432`

#### 5. Useful Commands
```bash
# Stop all services
docker-compose down

# Rebuild specific service
docker-compose build client

# Access database
docker-compose exec db psql -U postgres -d neo_watch

# View service logs
docker-compose logs backend
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

### Backend Configuration
```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=neo_watch
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Authentication
JWT_SECRET=your_jwt_secret_key_min_32_characters
JWT_EXPIRE=7d

# NASA API
NASA_API_KEY=your_nasa_api_key
NASA_API_URL=https://api.nasa.gov/neo/rest/v1

# Data Fetching
FETCH_INTERVAL=3600000  # 1 hour in milliseconds
ALERT_CHECK_INTERVAL=300000  # 5 minutes

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration
```env
# API Endpoint
VITE_API_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=NEO Watch
```

### Docker Override (docker-compose.yml)
```env
# Database (in docker-compose.yml)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=neo_watch
```

**Security Note**: Never commit `.env` files to version control. Use `.env.example` as a template.

---

## 🛰️ API Integration Details

### NASA NeoWs API

The application integrates with NASA's **Near-Earth Object Web Service** (NeoWs) to fetch asteroid data.

#### Base URL
```
https://api.nasa.gov/neo/rest/v1
```

#### Key Endpoints Used

1. **Feed Endpoint** - Get NEOs by date range
   ```
   GET /feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&api_key=YOUR_KEY
   ```

2. **Lookup Endpoint** - Get specific asteroid details
   ```
   GET /neo/{asteroid_id}?api_key=YOUR_KEY
   ```

3. **Browse Endpoint** - Paginated list of all NEOs
   ```
   GET /neo/browse?api_key=YOUR_KEY
   ```

#### Data Sync Strategy

- **Initial Load**: Fetch 7 days of historical data on first run
- **Scheduled Sync**: Hourly updates using node-cron
- **Rate Limiting**: Respects NASA API limits (1000 requests/hour)
- **Caching**: Stores data in PostgreSQL to reduce API calls
- **Error Handling**: Exponential backoff on failures

#### Sample API Response Structure
```json
{
  "links": { "next": "...", "prev": "...", "self": "..." },
  "element_count": 25,
  "near_earth_objects": {
    "2026-02-07": [
      {
        "id": "2001036",
        "name": "1036 Ganymed (A924 UB)",
        "absolute_magnitude_h": 9.45,
        "estimated_diameter": {
          "kilometers": { "estimated_diameter_min": 31.2, "estimated_diameter_max": 69.8 }
        },
        "is_potentially_hazardous_asteroid": false,
        "close_approach_data": [{
          "close_approach_date": "2026-02-07",
          "relative_velocity": { "kilometers_per_second": "19.71" },
          "miss_distance": { "kilometers": "87654321.0" }
        }]
      }
    ]
  }
}
```

---

## 📐 Risk Scoring Logic

The risk analysis engine calculates a **Risk Score (0-100)** for each asteroid using multiple factors:

### Formula Overview

```
Risk Score = (Velocity Factor × 0.3) + (Distance Factor × 0.4) + (Size Factor × 0.3)
```

### Factor Calculations

#### 1. Velocity Factor (30% weight)
- **Input**: Relative velocity in km/s
- **Calculation**: `(velocity / 100) × 100`
- **Cap**: Maximum 100

*Rationale*: Faster objects have less warning time and higher impact energy.

#### 2. Distance Factor (40% weight)
- **Input**: Miss distance in kilometers
- **Calculation**: `100 - (log10(distance) × 10)`
- **Range**: Normalized 0-100

*Rationale*: Closer approaches present higher risk. Logarithmic scale accounts for vast distance ranges.

#### 3. Size Factor (30% weight)
- **Input**: Estimated diameter in kilometers
- **Calculation**: `(diameter / 2) × 100`
- **Cap**: Maximum 100

*Rationale*: Larger objects cause more destruction on impact.

### Risk Categories

| Score | Category | Color Code | Description |
|-------|----------|------------|-------------|
| 80-100 | Critical | 🔴 Red | Immediate attention required |
| 60-79 | High | 🟠 Orange | Significant potential threat |
| 40-59 | Moderate | 🟡 Yellow | Worth monitoring |
| 20-39 | Low | 🟢 Green | Minimal concern |
| 0-19 | Negligible | ⚪ Gray | Safe passing |

### Additional Considerations

- **Hazardous Flag**: NASA's `is_potentially_hazardous_asteroid` adds +10 bonus
- **Historical Data**: Previous close approaches influence trend analysis
- **Uncertainty**: Scores include confidence intervals where available

---

## 📸 Screenshots

> *Coming soon - Add screenshots of your application here*

**Recommended Screenshots:**
1. Homepage / Landing Page
2. Dashboard with live NEO data
3. Detailed asteroid view with risk score
4. User watchlist
5. Alert/notification system
6. Mobile responsive view

---

## 🚀 Future Enhancements

### Planned Features
- [ ] **Email/SMS Notifications** - Multi-channel alert system
- [ ] **Advanced Filtering** - Custom search queries and saved filters
- [ ] **Impact Simulation** - Interactive 3D visualization of potential impacts
- [ ] **Historical Trends** - Long-term analysis and pattern recognition
- [ ] **Social Features** - Share watchlists and comment on asteroids
- [ ] **Machine Learning** - Predictive risk modeling using historical data
- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Multi-language Support** - Internationalization (i18n)
- [ ] **Data Export** - CSV/JSON export for research purposes
- [ ] **Integration with Other APIs** - ESA, JAXA space agency data

### Technical Improvements
- [ ] GraphQL API for flexible querying
- [ ] Redis caching layer for performance
- [ ] Elasticsearch for advanced search
- [ ] WebSocket for real-time updates
- [ ] Comprehensive test coverage (Jest, Cypress)
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Kubernetes deployment configuration
- [ ] API rate limiting and throttling

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 NEO Watch

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/neo-watch/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/neo-watch/discussions)
- **Email**: support@neowatch.example.com

---

## 🙏 Acknowledgments

- **NASA** - For providing open access to Near-Earth Object data through NeoWs API
- **Open Source Community** - For the amazing tools and libraries that made this possible
- **Contributors** - Thank you to everyone who has contributed to this project

---

**Built with ❤️ for asteroid awareness and space safety**
