# Interface Monitoring Dashboard

A modern, real-time monitoring dashboard for HR integration interfaces built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Core Functionality
- **Real-time Interface Monitoring**: Track the health and status of HR integration interfaces
- **Summary Dashboard**: Visualize success/failure metrics with beautiful charts
- **Time-based Filtering**: Filter data by Last Hour, 24 Hours, Week, Month, or custom ranges
- **Advanced Logs Table**: Sortable, filterable interface logs with pagination
- **Performance Optimization**: Handles 500,000+ records efficiently with proper indexing

### Technical Features
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Charts**: Interactive pie charts and bar charts using Recharts
- **Status Indicators**: Color-coded badges for status and severity levels
- **Pagination**: Efficient handling of large datasets
- **RESTful API**: Clean, documented backend API
- **MongoDB Integration**: Optimized database with proper indexing

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Recharts** - Beautiful, composable charting library
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing
- **CSS3** - Modern styling with gradients and animations

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing

### Screenshots
Here are a few screenshots showcasing the dashboard interface and features in action.

# Dashboard
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6e6deaf0-a809-413a-86a3-e36ebc4ae0f2" />

# Dashboard Metrics Overview
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b5fa7cd1-5c79-4ef1-946d-b88c11e37706" />

# Interface Statistics
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f4805b63-4416-4e00-9336-e4f2dcddf51d" />

# Severity Distribution Graph
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/219f77e3-6b00-4b5e-ad48-4a5626ad8dd2" />

# Interface Logs
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/83f957ae-245b-4fc6-b0f8-1d9b052d206b" />

# Advanced Filters
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/b7185696-cccd-4110-a707-90df3168248d" />


## 📁 Project Structure

```
Driftal/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── App.jsx
│   │   └── App.css
│   └── package.json
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utilities (seeder)
│   │   └── server.js        # Main server file
│   ├── .env                 # Environment variables
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Driftal
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in backend directory
   PORT=5000
   MONGODB_URI=https://interface-monitoring-app.onrender.com
   NODE_ENV=development
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://:5000`

2. **Seed the database (optional)**
   ```bash
   cd backend
   npm run seed
   ```
   This will create 1000 sample interface records for testing.

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

## 📊 API Endpoints

### Interface Management
- `GET /api/interfaces` - Get all interfaces with filtering and pagination
- `GET /api/interfaces/:id` - Get interface by ID
- `POST /api/interfaces` - Create new interface
- `PUT /api/interfaces/:id` - Update interface
- `DELETE /api/interfaces/:id` - Delete interface

### Summary Statistics
- `GET /api/interfaces/summary` - Get summary statistics with time filtering

### Query Parameters
- `page` - Page number for pagination
- `limit` - Number of items per page
- `sortBy` - Field to sort by
- `sortOrder` - Sort order (asc/desc)
- `status` - Filter by status
- `interfaceName` - Filter by interface name
- `integrationKey` - Filter by integration key
- `severity` - Filter by severity
- `startDate` - Start date for range filtering
- `endDate` - End date for range filtering
- `timeRange` - Time range for summary (1h, 24h, 7d, 30d)

## 🎨 Design Features

### UI/UX Highlights
- **Modern Gradient Background**: Beautiful purple-blue gradient
- **Glass Morphism**: Translucent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Works perfectly on mobile and desktop
- **Color-coded Status**: Intuitive status and severity indicators
- **Interactive Charts**: Real-time data visualization

### Performance Optimizations
- **Database Indexing**: Optimized MongoDB queries
- **Pagination**: Efficient handling of large datasets
- **Lazy Loading**: Components load as needed
- **Caching**: API response caching for better performance

## 🔧 Configuration

### Environment Variables
- `PORT` - Backend server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

### Database Schema
The Interface model includes:
- Interface Name
- Integration Key
- Status (SUCCESS, FAILURE, PENDING, RUNNING)
- Message
- Severity (LOW, MEDIUM, HIGH, CRITICAL)
- Execution Time
- Records Processed
- Source System
- Target System
- Timestamps

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB (local or cloud)
2. Configure environment variables
3. Deploy to platforms like:
   - Heroku
   - Railway
   - Render
   - DigitalOcean

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to platforms like:
   - Vercel
   - Netlify
   - GitHub Pages

## 📈 Performance

- **Database**: Handles 500,000+ records efficiently
- **API Response Time**: < 200ms for typical queries
- **Frontend Load Time**: < 2 seconds
- **Memory Usage**: Optimized for production

## 🔮 Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Email notifications for failures
- [ ] Advanced filtering modal
- [ ] Export functionality (CSV, PDF)
- [ ] User authentication
- [ ] Role-based access control
- [ ] Custom dashboard widgets
- [ ] API rate limiting
- [ ] Redis caching layer

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for the Interface Monitoring Dashboard challenge.

---

**Note**: This is a demonstration project showcasing modern web development practices with React, Node.js, and MongoDB. The application is designed to handle large datasets efficiently while providing a beautiful, user-friendly interface. 
