# WebSockets

This is the code for the 2024 project of the course WWW Applications.
Our goal is to analyze the performance of different communication
protocols, with a main focus on the WebSocket protocol


## Start development
Before starting development, please ensure that Docker and Node.js are installed on your device.

### Development in docker
1. In the root folder, run following command to build project.
```
docker compose build
```
2. Then, start the project.
```
docker compose up
```
Use `docker compose down`  to stop containers, remove container, networks, volumes, and images created by `up`.

### Local development (http and websockets)
For local development, you will still need Docker to start the database.
First, in the root folder, run:
```
docker compose -f docker-compose-db-only.yml up
```
Then navigate to `/protocols` and run:
```
npm install
npm run dev
```

### Local development grpc


Navigate to `/protocols/gRPC`. Then, install dependencies and start the server with:
```
npm install
node stream_server.js
```

We also have a simple implementation of the client which can be run by:
```
node stream_client.js
```


## Running tests
As a side note, check the resources for tests. You can add a blob binary of different sizes, for example, from https://myjob.page/tools/test-files.

Navigate to the `/performance` folder and run
```
npm install
```
After the installation check scenarios from the `scenarios` folder. You can either directly run:
```
npx artillery run scenarios/:<scenario-name>
```
or use:
```
npm run performance:<scenario-name>
```
### Testing gRPC

Ensure that gRPC serer is running. Then, navigate to `/performance/gRPC`.
Install k6 testing library. Then, run:
```
k6 run test.js
```

## Results plotting
Make sure you have Python/Python3 and Matplotlib installed on your device,
and that there is data available for plotting
(meaning the performance tests have been run).
Then, navigate to the `/plotters` directory and run:

```
python3 plotter.py <protocol>
```

## Blocks Visualization
Navigate to the `/blocks` folder

Then run:
```
npm install
npm run blockserver
```
Open `http://localhost:8080/` in a browser.

Click stuff!