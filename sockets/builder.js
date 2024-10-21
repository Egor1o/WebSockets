'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  setMessage: setMessage
};

const csvFilePath = path.join(__dirname, 'message_times.csv');

if (!fs.existsSync(csvFilePath)) {
  fs.writeFileSync(csvFilePath, `"message","time","started","ended"\n`);
}

function markEndTime(startedAt) {
  let endedAt = process.hrtime(startedAt);
  let delta = (endedAt[0] * 1e9) + endedAt[1]; //nanoseconds 
  return delta / 1e6; 
}

function setMessage(context, events, done) {
  let message = 'Artillery';
  let startedAt = process.hrtime(); 
  let startTime = new Date().toISOString();
  
  context.sockets[''].emit('chat message', message);
  console.log('start', startedAt);

  return processSender(context, events, done, message, startedAt, startTime);
}

function processSender(context, events, done, message, startedAt, startTime) {
  context.sockets[""].on("chat message", function (res) {

    const delta = markEndTime(startedAt);
    let endTime = new Date().toISOString(); 
    
    console.log(`Time taken ${delta}`); 


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
