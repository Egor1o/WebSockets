"use strict"
const fs = require("fs")
const path = require("path")
const { deleteResults, createFileName, saveToCSV } = require("../csv")

module.exports = {
  setMessage: setMessage,
  setImage: setImage,
  deleteResults,
}

let clientOffset = -1

function markEndTime(startedAt) {
  let endedAt = process.hrtime(startedAt)
  let delta = endedAt[0] * 1e9 + endedAt[1] //nanoseconds
  //console.log("time taken", delta / 1e9)
  return delta / 1e6
}

async function setMessage(context, events) {
  let message = "Artillery"
  let startedAt = process.hrtime()
  let startTime = new Date().toISOString()
  await fetch("http://localhost:3001", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: `${message}` }),
  }).catch((err) => console.log(err))
  clientOffset++

  return processSender(context, events, message, startedAt, startTime)
}

//need adjustments for different sizes. Use Artillery variables pls.
function setImage(context, events, done) {
  //console.log(context)
  const filePath = path.join(__dirname, context.vars.file)
  const stream = ss.createStream()
  let startedAt = process.hrtime()
  let startTime = new Date().toISOString()

  //this one emulates client uploading data.
  ss(context.sockets[""]).emit("upload", stream, (res) => {
    console.log(res.message)
    const delta = markEndTime(startedAt)
    const endTime = new Date().toISOString()
    const fileName = createFileName(context.vars.file)
    saveToCSV(fileName, "kuva", delta, startTime, endTime)
    return done()
  })
  fs.createReadStream(filePath).pipe(stream)
}

async function processSender(context, events, message, startedAt, startTime) {
try {
  const res = await fetch(`http://localhost:3001/messages?clientOffset=${clientOffset}`)
  await res.json()
    const delta = markEndTime(startedAt)
    let endTime = new Date().toISOString()
    //console.log(`Time taken ${delta}`);
    saveToCSV("results_chat.csv", message, delta, startTime, endTime, "http")
} catch(err) {
  console.log(err)
}



}
