const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { sql } = require("../common/database"); // Adjust the path to `database.js` if needed

const app = express();
const server = createServer(app);

async function main() {
  app.use(express.json()); // `express.json()` replaces bodyParser.json()

  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
  });

  app.get("/messages", async (req, res) => {
    try {
      const offset = req.query.clientOffset || 0;
      const messages = await sql`
        SELECT id, content 
        FROM messages 
        WHERE id > ${offset};
      `;
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.sendStatus(500);
    }
  });

  app.post("/", async (req, res) => {
    try {
      const msg = req.body.message;
      await sql`
        INSERT INTO messages (content) 
        VALUES (${msg});
      `;
      res.sendStatus(200);
    } catch (error) {
      console.error("Error inserting message:", error);
      res.sendStatus(500);
    }
  });

  server.listen(3001, () => {
    console.log("Listening on http://localhost:3001");
  });
}

main();
