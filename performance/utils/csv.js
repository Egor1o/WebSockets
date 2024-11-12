"use strict"
const fs = require("fs")
const path = require("path")

module.exports = {
  deleteResults,
  createFileName,
  saveToCSV,
}

function deleteResults(context, events, done) {
  console.log("PROTOKOLAAAAAAAuuuuuuuuuuENGINEE", context.scenario.engine)
  
  switch (context.scenario.engine) {
    case "socketio": {
      fs.rmSync(path.join(__dirname, "../results/websocket"), { recursive: true, force: true })
      done()
      break
    }
    case "http": {
      done()
      break
    }
  }
}

function createFileName(file) {
  let name = file.split("/").at(-1).split(".").at(0)
  const fileName = `results_${name}.csv`
  return fileName
}

function saveToCSV(fileName, message, timeTaken, started, ended, protocol) {
  console.log("PROTOKOLAAAAAAA", protocol, fileName)
  const folderName = path.join(__dirname, "../results", protocol)

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, { recursive: true })
    }
  } catch (err) {
    console.error(err)
  }

  const csvFilePath = path.join(folderName, fileName)
  if (!fs.existsSync(csvFilePath)) {
    fs.writeFileSync(csvFilePath, `"message","time","started","ended"\n`)
  }
  const csvLine = `"${message}","${timeTaken}","${started}","${ended}"\n`
  fs.appendFileSync(csvFilePath, csvLine, (err) => {})
}
