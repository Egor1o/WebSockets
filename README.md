# WebSocket

Analyzing the performance of WebSockets

- Install dependencies:

```sh
   npm install
```

## Start docker
To start docker run this shell command in the root folder
```sh
   docker compose up
```
If you are going to modify existing migrations, please remove volumes and rerun the container. Otherwise, add new migration into flyway/sql according to V${Number}__name.sql. For example V1__initial.sql


## To run and test socket server

- Start server:

```sh
  npm run dev:sockets
```
- Run tests:
```sh
  npm run performance
```

## or to run and test http server

- Start server:

```sh
  npm run dev:http
```

- Run tests:
```sh
  npm run performance:http
```

## To plot results, make sure you have a Python compiler and Matplotlib installed. Then, in the root folder, run:

```sh
   python3 plotter.py
```
