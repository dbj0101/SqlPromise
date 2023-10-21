# SqlPromise
javascript library that uses tedious and dotenv to allow SQL and SQL Stored Procedures to be executed as promises
## Setup Instructions
1. Move the .git file to the root directory of the project
2. Highly advise to add .git file and SqlPromise directory to .gitignore file
3. Install Tedious from node npm, this is used to connect to SQL Server
```
npm install tedious
```
4. Install dotenv from node npm, this is used to pull connection string from .git file
```
npm install dotenv
```
5. Edit the .git file to setup your connection strings. Replace appropriate Values but leave the Names the same
