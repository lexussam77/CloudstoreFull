# CloudStore Startup Script
# This script sets up all environment variables and starts both backend and frontend

Write-Host "🚀 Starting CloudStore Application..." -ForegroundColor Green
Write-Host ""

# Set Java Home
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"
Write-Host "✅ Java Home set to: $env:JAVA_HOME" -ForegroundColor Cyan

# Set Maven Home
$env:MAVEN_HOME = "C:\Users\ANGEL\Desktop\apache-maven-3.9.9-bin\apache-maven-3.9.9"
Write-Host "✅ Maven Home set to: $env:MAVEN_HOME" -ForegroundColor Cyan

# Add to PATH
$env:PATH = "$env:JAVA_HOME\bin;$env:MAVEN_HOME\bin;" + $env:PATH
Write-Host "✅ PATH updated with Java and Maven" -ForegroundColor Cyan

# Set CloudStore Environment Variables
$env:MAIL_USERNAME = "Akombea77@gmail.com"
$env:MAIL_PASSWORD = "rmqjdtgdydbmbsqc"
$env:JWT_SECRET = "your-secret-key-here-make-it-long-and-secure-in-production-change-this-in-production"
$env:FILE_UPLOAD_DIR = "./uploads"
$env:SERVER_PORT = "8080"

Write-Host "✅ Environment variables configured" -ForegroundColor Cyan
Write-Host ""

# Verify Java and Maven
Write-Host "🔍 Verifying installations..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✅ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found!" -ForegroundColor Red
    exit 1
}

try {
    $mavenVersion = mvn -version 2>&1 | Select-String "Apache Maven"
    Write-Host "✅ Maven: $mavenVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Current Configuration:" -ForegroundColor Yellow
Write-Host "   Backend URL: http://localhost:8080/api" -ForegroundColor White
Write-Host "   Frontend URL: http://localhost:19006" -ForegroundColor White
Write-Host "   Email: $env:MAIL_USERNAME" -ForegroundColor White
Write-Host ""

Write-Host "🎯 Choose an option:" -ForegroundColor Yellow
Write-Host "   1. Start Backend only" -ForegroundColor White
Write-Host "   2. Start Frontend only" -ForegroundColor White
Write-Host "   3. Start Both (Backend + Frontend)" -ForegroundColor White
Write-Host "   4. Test Backend compilation" -ForegroundColor White
Write-Host "   5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host "🚀 Starting Backend..." -ForegroundColor Green
        Set-Location "backend"
        mvn spring-boot:run
    }
    "2" {
        Write-Host "🚀 Starting Frontend..." -ForegroundColor Green
        Set-Location "frontend"
        npm start
    }
    "3" {
        Write-Host "🚀 Starting Both Backend and Frontend..." -ForegroundColor Green
        Write-Host "   This will open two PowerShell windows" -ForegroundColor Yellow
        
        # Start Backend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\backend'; `$env:JAVA_HOME='C:\Program Files\Java\jdk-21'; `$env:MAVEN_HOME='C:\Users\ANGEL\Desktop\apache-maven-3.9.9-bin\apache-maven-3.9.9'; `$env:PATH='`$env:JAVA_HOME\bin;`$env:MAVEN_HOME\bin;' + `$env:PATH; `$env:MAIL_USERNAME='Akombea77@gmail.com'; `$env:MAIL_PASSWORD='rmqjdtgdydbmbsqc'; `$env:JWT_SECRET='your-secret-key-here-make-it-long-and-secure-in-production-change-this-in-production'; `$env:FILE_UPLOAD_DIR='./uploads'; `$env:SERVER_PORT='8080'; Write-Host '🚀 Starting Backend...' -ForegroundColor Green; mvn spring-boot:run"
        
        # Start Frontend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PWD\frontend'; Write-Host '🚀 Starting Frontend...' -ForegroundColor Green; npm start"
        
        Write-Host "✅ Both applications started in separate windows" -ForegroundColor Green
        Write-Host "   Backend: http://localhost:8080/api" -ForegroundColor Cyan
        Write-Host "   Frontend: http://localhost:19006" -ForegroundColor Cyan
    }
    "4" {
        Write-Host "🔍 Testing Backend compilation..." -ForegroundColor Yellow
        Set-Location "backend"
        mvn clean compile
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend compilation successful!" -ForegroundColor Green
        } else {
            Write-Host "❌ Backend compilation failed!" -ForegroundColor Red
        }
    }
    "5" {
        Write-Host "👋 Goodbye!" -ForegroundColor Green
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice. Please run the script again." -ForegroundColor Red
    }
} 