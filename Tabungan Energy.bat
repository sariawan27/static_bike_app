@echo off
echo Menjalankan apache dan mysql...
start "" /B "C:\xampp\apache\bin\httpd.exe"
start "" /B "C:\xampp\mysql\bin\mysqld.exe"

echo Menjalankan server di jendela baru...
powershell -WindowStyle Hidden -Command "Start-Process 'php' 'artisan serve'"

echo Menunggu server siap...
powershell -WindowStyle Hidden -c "Start-Sleep -Seconds 60"

echo Membuka Microsoft Edge...
start msedge http://localhost:8000

pause
