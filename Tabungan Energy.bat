@echo off
echo Menjalankan Apache dan MySQL...
start "" /B "C:\xampp\apache\bin\httpd.exe"
start "" /B "C:\xampp\mysql\bin\mysqld.exe"

echo Menjalankan Node-RED...
powershell -WindowStyle Hidden -Command ^
"Start-Process 'C:\Users\MINI S\AppData\Roaming\npm\node-red.cmd' -WorkingDirectory 'C:\Users\MINI S\AppData\Roaming\npm' -WindowStyle Hidden"

echo Menjalankan Laravel server...
powershell -WindowStyle Hidden -Command ^
"Start-Process php 'artisan serve' -WorkingDirectory '%cd%' -WindowStyle Hidden"

echo Menjalankan WebSocket Python (Modbus)...
powershell -WindowStyle Hidden -Command ^
"Start-Process python 'ws_realtime.py --port COM5 --unit 1 --ws-port 8765' -WorkingDirectory 'C:\xampp\htdocs\py-modbus-data' -WindowStyle Hidden"

echo Menunggu server siap...
powershell -WindowStyle Hidden -Command "Start-Sleep -Seconds 60"

echo Membuka Microsoft Edge (maximize)...
start "" msedge --start-maximized http://localhost:8000

pause
