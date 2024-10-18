const express = require("express")
const app = express()
const http = require("http")
const sqlite3 = require("sqlite3")
const { open } = require("sqlite")
const bodyParser = require("body-parser")
const server = http.createServer(app)

async function main() {
  app.use(bodyParser.json())
  const db = await open({
    filename: "./http/chat.db",
    driver: sqlite3.Database,
  })

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT
    );
  `)

  app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
  })

  app.get("/messages", async (req, res) => {
    const offset = req.query.clientOffset
    res.json((await db.all("SELECT id, content FROM messages WHERE id > ?", offset)) || [])
  })

  app.post("/", async (req, res) => {
    let result
    try {
      // store the message in the database
      const msg = req.body.message
      result = await db.run("INSERT INTO messages (content) VALUES (?)", msg)
      res.sendStatus(200)
    } catch (e) {
      console.error(e)
      res.sendStatus(500)
    }
  })

  server.listen(3000, () => {
    console.log("listening on *:3000")
  })
}

main()
