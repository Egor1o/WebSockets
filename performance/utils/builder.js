"use strict"
const fs = require("fs")
const path = require("path")
const ss = require("socket.io-stream")

module.exports = {
  setMessage: setMessage,
  setImage: setImage,
  deleteResults,
}

//mock

function deleteResults(context, events, done) {
  fs.rmSync(path.join(__dirname, "../results"), { recursive: true, force: true })
  done()
}

function markEndTime(startedAt) {
  let endedAt = process.hrtime(startedAt)
  let delta = endedAt[0] * 1e9 + endedAt[1] //nanoseconds
  console.log("time taken", delta / 1e9)
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
  //console.log(context)
  const filePath = path.join(__dirname, context.vars.file)
  const stream = ss.createStream()
  let startedAt = process.hrtime()
  let startTime = new Date().toISOString()

  console.log("trying to do something")

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

function processSender(context, events, done, message, startedAt, startTime) {
  context.sockets[""].on("chat message", function (res) {
    const delta = markEndTime(startedAt)
    let endTime = new Date().toISOString()
    //console.log(`Time taken ${delta}`);
    saveToCSV("../results/results_chat.csv", message, delta, startTime, endTime)
    context.sockets[""].off("chat message")
    return done()
  })
}

function createFileName(file) {
  let name = file.split("/").at(-1).split(".").at(0)
  const fileName = `../results/results_${name}.csv`
  return fileName
}

function saveToCSV(fileName, message, timeTaken, started, ended) {
  const csvFilePath = path.join(__dirname, fileName)
  const folderName = path.join(__dirname, "../results")

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }
  } catch (err) {
    console.error(err)
  }

  if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, `"message","time","started","ended"\n`)
  }
  const csvLine = `"${message}","${timeTaken}","${started}","${ended}"\n`
  fs.appendFileSync(csvFilePath, csvLine, (err) => {})
}
