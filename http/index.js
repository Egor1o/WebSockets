const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html")
})

app.post("/", (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
})

server.listen(3000, () => {
  console.log("listening on *:3000")
})
