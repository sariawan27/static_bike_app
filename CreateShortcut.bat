@echo off
setlocal

REM ==== Nama file Anda ====
set BATFILE=%~dp0Tabungan Energy.bat
set ICONFILE=%~dp0Tabungan Energy.ico
set SHORTCUT=%~dp0Tabungan Energy.lnk

REM ==== Buat shortcut ====
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%temp%\shortcut.vbs"
echo Set oLink = oWS.CreateShortcut("%SHORTCUT%") >> "%temp%\shortcut.vbs"
echo oLink.TargetPath = "%BATFILE%" >> "%temp%\shortcut.vbs"
echo oLink.IconLocation = "%ICONFILE%" >> "%temp%\shortcut.vbs"
echo oLink.WorkingDirectory = "%~dp0" >> "%temp%\shortcut.vbs"
echo oLink.Save >> "%temp%\shortcut.vbs"

REM ==== Jalankan CSCRIPT dengan path lengkap ====
"%SystemRoot%\System32\cscript.exe" //nologo "%temp%\shortcut.vbs"

del "%temp%\shortcut.vbs"

echo Shortcut created:
echo %SHORTCUT%
pause