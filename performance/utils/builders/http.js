"use strict"
const fs = require("fs")
const path = require("path")
const { deleteResults, createFileName, saveToCSV } = require("../csv")

module.exports = {
  setMessage: setMessage,
  deleteResults,
  testImages,
  clearIntervals,
}

const intervalIDs = []

function clearIntervals(context, events, done) {
  intervalIDs.forEach(clearInterval)
  done()
}

function markEndTime(startedAt) {
  let endedAt = process.hrtime(startedAt)
  let delta = endedAt[0] * 1e9 + endedAt[1] //nanoseconds
  //console.log("time taken", delta / 1e9)
  return delta / 1e6
}

function setMessage(context, events, done) {
  let startedAt = process.hrtime()
  fetch("http://localhost:3001", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: startedAt, startTime: new Date().toISOString() }),
  }).catch((err) => console.log(err))
  return httpPoller(context, events, done)
}

async function fetchMessage(clientOffset) {
  try {
    const res = await fetch(`http://localhost:3001/messages?clientOffset=${clientOffset}`)
    const messages = await res.json()
    if (messages.length === 0) return clientOffset
    const latest = messages.at(-1)
    const delta = markEndTime(latest.content.split(",").map(parseFloat))
    let endTime = new Date().toISOString()
    //console.log(`Time taken ${delta}`);
    if (clientOffset !== 0) {
      saveToCSV("results_chat.csv", latest.content, delta, latest.content, endTime, "http")
    }
    return messages.length + clientOffset
  } catch (err) {
    console.log(err)
  }
}

async function httpPoller(context, events, done) {
  let clientOffset = 0
  intervalIDs.push(
    setInterval(
      async () => {
        clientOffset = await fetchMessage(clientOffset)
      },
      200,
    )
  )
  done()
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
