# PowerShell script to set JAVA_HOME permanently
# Run this script as Administrator

Write-Host "Setting JAVA_HOME permanently..." -ForegroundColor Green

# Set JAVA_HOME for the current user (doesn't require admin)
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-21", "User")

Write-Host "JAVA_HOME has been set to: C:\Program Files\Java\jdk-21" -ForegroundColor Green
Write-Host "This change will take effect in new terminal sessions." -ForegroundColor Yellow
Write-Host ""
Write-Host "To verify, please:" -ForegroundColor Cyan
Write-Host "1. Close this terminal" -ForegroundColor White
Write-Host "2. Open a new terminal" -ForegroundColor White
Write-Host "3. Run: echo `$env:JAVA_HOME" -ForegroundColor White
Write-Host "4. Run: mvn -version" -ForegroundColor White

# Also set it for the current session
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"

Write-Host ""
Write-Host "JAVA_HOME is now set for the current session: $env:JAVA_HOME" -ForegroundColor Green 