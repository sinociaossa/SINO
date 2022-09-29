ping 8.8.8.8 /n 2

tasklist /fi "ImageName eq mshta.exe" /fo csv 2>NUL | find /I "mshta.exe">NUL 
if "%ERRORLEVEL%"=="0" taskkill /im mshta.exe /f && taskkill /im cmd.exe /f
