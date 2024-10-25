const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const { sql } = require("../database/dash"); // Adjust path to your database module

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
    socket.on("chat message", async (msg, clientOffset) => {
      io.emit("chat message", msg, result.lastID);
      if (!socket.recovered) {
        try {
          const messages = await sql`SELECT id, content FROM messages WHERE id > ${socket.handshake.auth.serverOffset || 0}`;
          messages.forEach((row) => {
            socket.emit("chat message", row.content, row.id);
          });
        } catch (e) {
        }
      }
    });

    socket.on("upload", async (file, callback) => {
      try {
        const result = await sql`INSERT INTO images (image_name, image_data) VALUES ('uploaded_image.png', ${file})`;
        callback({ message: process.hrtime() });
      } catch (err) {
        callback({ message: "failure" });
      }
    });
  });

  server.listen(3000, () => {
    console.log("server running at http://localhost:3001");
  });
}

main();
