@echo off

echo **********************INSTALL LIB**************************

call cd ./client

call npm i --legacy-peer-deps
call npx browserslist@latest --update-db
call cd ../server

call npm i

pause