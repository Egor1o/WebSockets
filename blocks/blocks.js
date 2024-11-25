"use strict";

import express from 'express';
import { WebSocketServer } from 'ws';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, "blocks.html"));
})

app.get('/http_test', (req, res) => {
  res.send("http_test_response");
  console.log(`Received HTTP request to: ${req.originalUrl}`);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})

const wss = new WebSocketServer({ port: 8081 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    if (data.toString('utf8') === 'ws_test') {
      ws.send("ws_test_response");
    }
    else if (data.toString('utf8') === 'ws_test_continuous') {
      ws.send("ws_test_continuous_response");
    }
    console.log(`Received WebSocket data: ${data}`);
  });
  ws.send('WebSocket connection established');
});
