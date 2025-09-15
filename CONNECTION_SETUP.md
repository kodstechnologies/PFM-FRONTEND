# Frontend-Backend Connection Setup Guide

## 🚀 Quick Setup

### 1. Backend Setup
```bash
cd pfm_Backend
npm install
npm start
```
Backend will run on: `http://localhost:8000`

### 2. Frontend Setup
```bash
cd PriyaFreshMeat
npm install
npm run dev
```
Frontend will run on: `http://localhost:5173`

### 3. Socket Server Setup
```bash
cd PriyaFreshMeat
npm run server
```
Socket server will run on: `http://localhost:3001`

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the `PriyaFreshMeat` directory:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:3001
VITE_APP_NAME=PriyaFreshMeat
VITE_APP_VERSION=1.0.0
```

**Note**: If no `.env` file is created, the application will use default values:
- API Base URL: `http://localhost:8000`
- Socket URL: `http://localhost:3001`

## 📡 Connection Test

### Automatic Test
The application automatically tests connections on startup. Check the browser console for connection status.

### Manual Test
```typescript
import ConnectionTest from './src/utils/connectionTest';

const connectionTest = new ConnectionTest();
await connectionTest.testAllConnections();
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend Connection Failed**
   - Ensure backend is running on port 8000
   - Check if MongoDB is connected
   - Verify CORS configuration

2. **Socket Connection Failed**
   - Ensure socket server is running on port 3001
   - Check if port 3001 is available

3. **CORS Errors**
   - Backend CORS is configured for: `localhost:5173`, `localhost:3000`, `localhost:3001`
   - Frontend runs on port 5173 by default

### Port Configuration

| Service | Port | Purpose |
|---------|------|---------|
| Backend API | 8000 | Main API endpoints |
| Frontend Dev | 5173 | React development server |
| Socket Server | 3001 | Real-time communication |

## ✅ Verification

### Backend Health Check
```bash
curl http://localhost:8000/
# Expected: "Server is running! 22-08-2025 3.36pm"
```

### Socket Health Check
```bash
curl http://localhost:3001/health
# Expected: JSON response with status and connected clients
```

### Frontend Console
Check browser console for:
- ✅ Backend connection successful
- ✅ Socket connection successful
- 🎉 All connections successful! Frontend and backend are properly connected.

## 🚨 Important Notes

1. **Order of Startup**: Start backend first, then frontend
2. **Port Availability**: Ensure ports 8000, 5173, and 3001 are not in use
3. **Environment Variables**: `.env` file is optional but recommended for production
4. **CORS**: Backend is configured to accept requests from frontend ports

## 🔄 Updates Made

- ✅ Created centralized API configuration
- ✅ Added environment configuration with defaults
- ✅ Updated CORS settings for proper frontend-backend communication
- ✅ Added connection testing utilities
- ✅ Created comprehensive setup documentation
