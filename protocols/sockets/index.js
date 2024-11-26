const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { sql } = require("../common/database");
var ss = require('socket.io-stream');
const fs = require('fs')
const path = require('path')

async function main() {
  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    connectionStateRecovery: {},
  });

  app.get("/", async (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
    const dataCheck = await sql`SELECT * FROM messages`;
    console.log(dataCheck);
  });

  io.on("connection", async (socket) => {
    if (socket.recovered) {      
      try {
        const messages = await sql`SELECT id, content FROM messages WHERE id > ${socket.handshake.auth.serverOffset || 0}`;
        messages.forEach((row) => {          
          socket.emit("chat message", row.content, row.id);
        });
      } catch (e) {
      }
    }

    //u can use this one to check any upcoming event that is unhandled
    /*socket.onAny((eventName, ...args) => {
      console.log(`Unhandled event: ${eventName} with arguments:`, args);
    });*/

    socket.on("chat message", async (msg, clientOffset) => {
      io.emit("chat message", msg);
      await sql`INSERT INTO messages (content, client_offset) VALUES (${msg}, ${clientOffset})`    
    });

    ss(socket).on('upload', (stream, callback) =>  {

      // removed db functionality from here, since it is not a good idea to store big files in db.
      const filePath = path.join(__dirname, 'bobik.bin');
      stream.pipe(fs.createWriteStream(filePath)).on('finish', () => {
        stream.end()
        callback({message: process.hrtime()})
      })
    })
    
  });

  server.listen(3000, () => {
    console.log("server running at http://localhost:3000");
  });
}

main();
