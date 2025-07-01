# PowerShell script to clean up ports 8080 and 8081, then start the backend

Write-Host "Killing any process using port 8080..."
$pid8080 = (netstat -ano | Select-String ":8080" | ForEach-Object { $_.ToString().Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)[4] }) | Select-Object -Unique
foreach ($pid in $pid8080) { 
    try { Stop-Process -Id $pid -Force; Write-Host "Killed PID $pid on port 8080" } catch { }
}

Write-Host "Killing any process using port 8081..."
$pid8081 = (netstat -ano | Select-String ":8081" | ForEach-Object { $_.ToString().Split(" ", [System.StringSplitOptions]::RemoveEmptyEntries)[4] }) | Select-Object -Unique
foreach ($pid in $pid8081) { 
    try { Stop-Process -Id $pid -Force; Write-Host "Killed PID $pid on port 8081" } catch { }
}

Write-Host "Starting backend..."
cd backend
mvn spring-boot:run 