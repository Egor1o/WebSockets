"use strict"
const fs = require("fs")
const path = require("path")

module.exports = {
  deleteResults,
  createFileName,
  saveToCSV,
}

function deleteResults(context, events, done) {
  fs.rmSync(path.join(__dirname, "../results"), { recursive: true, force: true })
  done()
}

function createFileName(file) {
  let name = file.split("/").at(-1).split(".").at(0)
  const fileName = `../results/results_${name}.csv`
  return fileName
}

function saveToCSV(fileName,protocol, message, timeTaken, started, ended) {
  const folderName = path.join(__dirname, "../results", protocol)
  
  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName, {recursive: true})
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
