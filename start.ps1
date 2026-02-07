# Quick Start Script for Windows PowerShell
# Run this script to start both frontend and backend servers

Write-Host "🚀 Starting Cosmic Watch Application..." -ForegroundColor Cyan
Write-Host ""

# Check if backend .env exists
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Backend .env file not found!" -ForegroundColor Yellow
    Write-Host "📝 Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host ""
    Write-Host "🔑 IMPORTANT: Edit backend\.env file with your Google OAuth credentials" -ForegroundColor Red
    Write-Host "   - Get credentials from: https://console.cloud.google.com/" -ForegroundColor Yellow
    Write-Host "   - See AUTHENTICATION_SETUP.md for detailed instructions" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter after you've configured the .env file"
}

# Start backend server in new window
Write-Host "🖥️  Starting Backend Server (Port 5000)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start frontend server in new window
Write-Host "🌐 Starting Frontend Server (Port 5173)..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "✅ Servers are starting in separate windows..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📌 Access the application at: http://localhost:5173" -ForegroundColor Yellow
Write-Host "📌 Backend API running at: http://localhost:5000" -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  Make sure you've configured Google OAuth credentials in backend\.env" -ForegroundColor Red
Write-Host "📖 See AUTHENTICATION_SETUP.md for setup instructions" -ForegroundColor Cyan
