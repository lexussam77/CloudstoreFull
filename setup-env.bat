@echo off
echo Setting up CloudStore Environment Variables...

REM Set Java Home (adjust path to your Java installation)
set JAVA_HOME=C:\Program Files\Java\jdk-17

REM Set Maven Home (adjust path to your Maven installation)
set MAVEN_HOME=C:\Program Files\Apache\maven

REM Add to PATH
set PATH=%PATH%;%JAVA_HOME%\bin;%MAVEN_HOME%\bin

REM Set CloudStore specific environment variables
set MAIL_USERNAME=Akombea77@gmail.com
set MAIL_PASSWORD=rmqjdtgdydbmbsqc
set JWT_SECRET=your-secret-key-here-make-it-long-and-secure-in-production-change-this-in-production
set FILE_UPLOAD_DIR=./uploads
set SERVER_PORT=8080

REM Database variables
set DB_URL=jdbc:postgresql://localhost:5432/cloudstore_db
set DB_USERNAME=postgres
set DB_PASSWORD=cloudstore

echo Environment variables set successfully!
echo.
echo Current settings:
echo JAVA_HOME: %JAVA_HOME%
echo MAVEN_HOME: %MAVEN_HOME%
echo MAIL_USERNAME: %MAIL_USERNAME%
echo SERVER_PORT: %SERVER_PORT%
echo.
echo You can now run: mvn spring-boot:run
pause 