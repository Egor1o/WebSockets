# WebSockets

This is the code for the 2024 project of the course WWW Applications.
Our goal is to analyze the performance of different communication 
protocols, with a main focus on the WebSocket protocol


## Start development
Before starting development, please ensure that Docker and Node.js are installed on your device.

### Development in docker
1. In the root folder, run following command to build project
```
docker compose build
```
2. Then, start the project
```
docker compose up
```
Use `docker compose down`  to stop containers, remove container, networks, volumes, and images created by `up`.

### Local development 
Local development is still in progress (needs adjustments), but for now, check protocols/common/database.js and then run:
```
npm install
npm run dev
```

## Running tests
Navigate to the performance folder and run
```
npm run install
```
After the installation check scenarios from the `scenarios` folder. You can either directly run:
```
npx artillery run scenarios/:scenario-name
```
or use:
```
npm run performance:scenario-name
```