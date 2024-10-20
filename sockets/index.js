const express = require("express")
const { createServer } = require("node:http")
const { join } = require("node:path")
const { Server } = require("socket.io")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")
const fs = require('fs');
const path = require('path');

async function main() {
  // open the database file
  const db = await open({
    filename: "./sockets/chat.db",
    driver: sqlite3.Database,
  })

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `)

  const app = express()
  const server = createServer(app)
  const io = new Server(server, {
    connectionStateRecovery: {},
  })

  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"))
  })

  io.on("connection", async (socket) => {
    socket.on("chat message", async (msg, clientOffset) => {
      let result
      try {
        // store the message in the database
        result = await db.run(
          "INSERT INTO messages (content, client_offset) VALUES (?, ?)",
          msg,
          clientOffset
        )
      } catch (e) {
        if (e.errno === 19 /* SQLITE_CONSTRAINT */) {
          // the message was already inserted, so we notify the client
          //callback()
        } else {
          // nothing to do, just let the client retry
        }
        return
      }
      // include the offset with the message
      io.emit("chat message", msg, result.lastID)
      // acknowledge the event
      //callback()
      if (!socket.recovered) {
        // if the connection state recovery was not successful
        try {
          await db.each(
            "SELECT id, content FROM messages WHERE id > ?",
            [socket.handshake.auth.serverOffset || 0],
            (_err, row) => {
              socket.emit("chat message", row.content, row.id)
            }
          )
        } catch (e) {
          // something went wrong
        }
      }
    })

    socket.on("upload", (file, callback) => {
      console.log(file);
      
      const uploadPath = path.join(__dirname, '../resources', 'uploaded_image.png'); 
    
      fs.mkdirSync(path.dirname(uploadPath), { recursive: true });

      fs.writeFile(uploadPath, file, (err) => {
        if (err) {
          console.error(err);
          callback({ message: "failure" });
        } else {
          console.log('File successfully saved');
          callback({ message: "success" });
        }
      });
    });

  })

  server.listen(3000, () => {
    console.log("server running at http://localhost:3000")
  })
}

main()
