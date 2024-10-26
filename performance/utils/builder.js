'use strict';
const fs = require('fs');
const path = require('path');
const ss = require('socket.io-stream')

module.exports = {
  setMessage: setMessage,
  setImage: setImage
};

const csvFilePath = path.join(__dirname, '../results.csv');

if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, `"message","time","started","ended"\n`);
}

function markEndTime(startedAt) {
  let endedAt = process.hrtime(startedAt);
  let delta = (endedAt[0] * 1e9) + endedAt[1]; //nanoseconds 
  console.log('time taken', delta / 1e9)
  return delta / 1e6; 
}

function setMessage(context, events, done) {
  let message = 'Artillery';
  let startedAt = process.hrtime(); 
  let startTime = new Date().toISOString();
  context.sockets[''].emit('chat message', message);

  return processSender(context, events, done, message, startedAt, startTime);
}

//need adjustments for different sizes. Use Artillery variables pls.
function setImage(context, events, done) {
  const filePath = path.join(__dirname, '../../resources/10MB.bin');
  const stream = ss.createStream()
  let startedAt = process.hrtime();
  let startTime = new Date().toISOString();

  console.log('trying to do something')

  //this one emulates client uploading data.
  ss(context.sockets['']).emit('upload', stream, (res) => {
    console.log(res.message);
    const delta = markEndTime(startedAt);
    const endTime = new Date().toISOString(); 
    saveToCSV('kuva', delta, startTime, endTime);
    return done()
  })
  fs.createReadStream(filePath).pipe(stream);
}

function processSender(context, events, done, message, startedAt, startTime) {
  context.sockets[""].on("chat message", function (res) {
    const delta = markEndTime(startedAt);
    let endTime = new Date().toISOString(); 
    //console.log(`Time taken ${delta}`); 
    saveToCSV(message, delta, startTime, endTime);
    context.sockets[""].off("chat message"); 
    return done();
  });
}

function saveToCSV(message, timeTaken, started, ended) {
  const csvLine = `"${message}","${timeTaken}","${started}","${ended}"\n`;
  fs.appendFileSync(csvFilePath, csvLine, (err) => {
  });
}
