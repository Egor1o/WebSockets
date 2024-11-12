const express = require("express")
const multer = require("multer")
const { createServer } = require("http")
const { join } = require("path")
const { sql } = require("../common/database") // Adjust the path to `database.js` if needed
const { log } = require("console")

const app = express()
const server = createServer(app)

async function main() {
  app.use(express.json()) // `express.json()` replaces bodyParser.json()

  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"))
  })

  app.get("/messages", async (req, res) => {
    try {
      const offset = req.query.clientOffset || 0
      const messages = await sql`
        SELECT id, content 
        FROM messages 
        WHERE id > ${offset};
      `
      res.json(messages)
    } catch (error) {
      console.error("Error fetching messages:", error)
      res.sendStatus(500)
    }
  })

  app.post("/", async (req, res) => {
    try {
      const msg = req.body.message
      await sql`
        INSERT INTO messages (content) 
        VALUES (${msg});
      `
      res.sendStatus(200)
    } catch (error) {
      console.error("Error inserting message:", error)
      res.sendStatus(500)
    }
  })

  const upload = multer({ dest: "./uploads" }).single("file")

  app.post("/file", function (req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err)
        // A Multer error occurred when uploading.
      } else if (err) {
        console.log(err)
      }
      res.status(200).contentType("text/plain").end("File uploaded!")
    })
  })

  server.listen(3001, () => {
    console.log("Listening on http://localhost:3001")
  })
}

main()
