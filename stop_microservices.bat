
@echo off
echo WARNING: This will kill ALL Java processes on your machine.
echo This is the fastest way to stop all microservices.
echo.
set /P c=Are you sure you want to continue? [Y/N]?
if /I "%c%" EQU "Y" goto :kill
goto :eof

:kill
echo Killing Java processes...
taskkill /F /IM java.exe
echo Done.
pause
