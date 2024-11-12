"use strict"
const fs = require("fs")
const path = require("path")
const { deleteResults, createFileName, saveToCSV } = require("../csv")

module.exports = {
  setMessage: setMessage,
  deleteResults,
  testImages,
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

async function testImages(context, events) {
  let startedAt = process.hrtime()
  let startTime = new Date().toISOString()
  const form = new FormData()
  const filePath = path.join(__dirname, context.vars.file)
  const file = await fs.openAsBlob(filePath)
  form.append("file", file)
  await fetch("http://localhost:3001/file", {
    method: "POST",
    body: form,
  }).catch((err) => console.log(err))

  const delta = markEndTime(startedAt)
  const endTime = new Date().toISOString()
  const fileName = createFileName(context.vars.file)
  saveToCSV(fileName, "kuva", delta, startTime, endTime, "http")
}

async function processSender(context, events, message, startedAt, startTime) {
  try {
    const res = await fetch(`http://localhost:3001/messages?clientOffset=${clientOffset}`)
    await res.json()
    const delta = markEndTime(startedAt)
    let endTime = new Date().toISOString()
    //console.log(`Time taken ${delta}`);
    saveToCSV("results_chat.csv", message, delta, startTime, endTime, "http")
  } catch (err) {
    console.log(err)
  }
}
