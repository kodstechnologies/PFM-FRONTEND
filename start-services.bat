@echo off
echo ========================================
echo    PriyaFreshMeat Service Starter
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd ../pfm_Backend && npm start"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend Dev Server" cmd /k "npm run dev"

echo Waiting 3 seconds for frontend to start...
timeout /t 3 /nobreak > nul

echo Starting Socket Server...
start "Socket Server" cmd /k "npm run server"

echo.
echo ========================================
echo All services are starting...
echo ========================================
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo Socket: http://localhost:3001
echo.
echo Press any key to close this window...
pause > nul
