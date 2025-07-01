# CloudStore Environment Setup Script for PowerShell
Write-Host "Setting up CloudStore Environment Variables..." -ForegroundColor Green

# Set Java Home (adjust path to your Java installation)
$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"

# Set Maven Home (adjust path to your Maven installation)
$env:MAVEN_HOME = "C:\Program Files\Apache\maven"

# Add to PATH
$env:PATH += ";$env:JAVA_HOME\bin;$env:MAVEN_HOME\bin"

# Set CloudStore specific environment variables
$env:MAIL_USERNAME = "Akombea77@gmail.com"
$env:MAIL_PASSWORD = "rmqjdtgdydbmbsqc"
$env:JWT_SECRET = "your-secret-key-here-make-it-long-and-secure-in-production-change-this-in-production"
$env:FILE_UPLOAD_DIR = "./uploads"
$env:SERVER_PORT = "8080"

# Database variables (if you want to override defaults)
$env:DB_URL = "jdbc:postgresql://localhost:5432/cloudstore_db"
$env:DB_USERNAME = "postgres"
$env:DB_PASSWORD = "cloudstore"

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Current settings:" -ForegroundColor Yellow
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "MAVEN_HOME: $env:MAVEN_HOME"
Write-Host "MAIL_USERNAME: $env:MAIL_USERNAME"
Write-Host "SERVER_PORT: $env:SERVER_PORT"
Write-Host ""
Write-Host "You can now run: mvn spring-boot:run" -ForegroundColor Cyan 