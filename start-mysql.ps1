# Start dedicated MySQL instance for Raghavendra Engineers (port 3307)
$basedir = "C:\Program Files\MySQL\MySQL Server 8.0"
$datadir = Join-Path $PSScriptRoot "mysql-data"
$mysql = Join-Path $basedir "bin\mysqld.exe"

if (-not (Test-Path $datadir)) {
  Write-Host "Initializing MySQL data directory..."
  New-Item -ItemType Directory -Path $datadir -Force | Out-Null
  & (Join-Path $basedir "bin\mysqld.exe") --initialize-insecure --datadir="$datadir" --basedir="$basedir"
  Start-Sleep -Seconds 3
  & (Join-Path $basedir "bin\mysql.exe") -h 127.0.0.1 -P 3307 -u root -e "ALTER USER 'root'@'localhost' IDENTIFIED BY 'Meghana@09'; CREATE DATABASE IF NOT EXISTS raghavendra_enge_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
}

$existing = Get-Process mysqld -ErrorAction SilentlyContinue | Where-Object { $_.Path -eq $mysql }
if ($existing) {
  Write-Host "MySQL already running on port 3307 (PID $($existing.Id))"
  exit 0
}

Start-Process -FilePath $mysql -ArgumentList "--datadir=`"$datadir`"","--basedir=`"$basedir`"","--port=3307" -WindowStyle Hidden
Start-Sleep -Seconds 3
Write-Host "MySQL started on port 3307"
Write-Host "Database: raghavendra_enge_db"
Write-Host "User: root"
Write-Host "Password: Meghana@09"
