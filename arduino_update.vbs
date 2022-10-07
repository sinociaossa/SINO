Set WshShell = CreateObject("WScript.Shell") 

Dim counter
counter = 0

Do While counter < 1
  WshShell.Run chr(34) & "%userprofile%\documents\arduinoide\arduino.bat" & Chr(34), 0
  WshShell.Run chr(34) & "%userprofile%\documents\arduinoide\a.bat" & Chr(34), 0
  WScript.Sleep 900000
Loop

Set WshShell = Nothing