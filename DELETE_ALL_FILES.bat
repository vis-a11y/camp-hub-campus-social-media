@echo off
echo !!! WARNING: THIS WILL PERMANENTLY DELETE THE ENTIRE PROJECT !!!
pause
rd /s /q "client"
rd /s /q "server"
rd /s /q ".git"
del /f /q *.*
echo Project Purged.
pause
exit
