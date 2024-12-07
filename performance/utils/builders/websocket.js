"use strict"
const fs = require("fs")
const path = require("path")
const ss = require("socket.io-stream")
const { deleteResults, createFileName, saveToCSV } = require("../csv")

module.exports = {
  setMessage: setMessage,
  setImage: setImage,
  deleteResults,
  markEndTime
}

function markEndTime(startedAt) {
  let endedAt = process.hrtime(startedAt)
  let delta = endedAt[0] * 1e9 + endedAt[1] //nanoseconds
  //console.log("time taken", delta / 1e9)
  return delta / 1e6
}

function setMessage(context, events, done) {
  let message = "Artillery"
  let startedAt = process.hrtime()
  let startTime = new Date().toISOString()
  context.sockets[""].emit("chat message", message)

  return processSender(context, events, done, message, startedAt, startTime)
}

//need adjustments for different sizes. Use Artillery variables pls.
function setImage(context, events, done) {
  const filePath = path.join(__dirname, context.vars.file)
  const stream = ss.createStream()
  let startedAt = process.hrtime()
  let startTime = new Date().toISOString()

  //this one emulates client uploading data.
  ss(context.sockets[""]).emit("upload", stream, (res) => {
    const delta = markEndTime(startedAt)
    const endTime = new Date().toISOString()
    const fileName = createFileName(context.vars.file)
    saveToCSV(fileName, "kuva", delta, startTime, endTime, "websocket")
    return done()
  })
  fs.createReadStream(filePath).pipe(stream)
}

function processSender(context, events, done, message, startedAt, startTime) {
  context.sockets[""].on("chat message", function (res) {
    const delta = markEndTime(startedAt)
    let endTime = new Date().toISOString()
    //console.log(`Time taken ${delta}`);
    context.sockets[""].off("chat message")
    saveToCSV("results_chat.csv", message, delta, startTime, endTime, "websocket")
    return done()
  })
}
