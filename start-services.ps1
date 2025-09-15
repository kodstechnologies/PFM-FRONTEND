# PriyaFreshMeat Service Starter (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PriyaFreshMeat Service Starter" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd ../pfm_Backend; npm start"

Write-Host "Waiting 5 seconds for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Starting Frontend Development Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "Waiting 3 seconds for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "Starting Socket Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run server"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All services are starting..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Backend: http://localhost:8000" -ForegroundColor White
Write-Host "Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "Socket: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Services started successfully!" -ForegroundColor Green
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
