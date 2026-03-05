@echo off
echo Starting Redis Infrastructure...
docker-compose -f docker-compose-redis.yml up -d
echo.
echo Redis should now be running on port 6379.
echo You can now run start_microservices.bat
pause
