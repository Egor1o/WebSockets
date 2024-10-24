'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  setMessage: setMessage,
  setImage: setImage
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
  //console.log('start', startedAt);

  return processSender(context, events, done, message, startedAt, startTime);
}

function setImage(context, events, done) {

  const filePath = path.join(__dirname, '../resources/image.jpeg');

    fs.readFile(filePath, (err, data) => {

      let startedAt = process.hrtime();
      let startTime = new Date().toISOString();
      context.sockets[''].emit('upload', data, (res) => {
        const delta = markEndTime(startedAt)
        const endTime = new Date().toISOString(); 
        saveToCSV('kuva', delta, startTime, endTime);
      });

      //somwhow works only if this one is included 🧐
      context.sockets[''].on("upload", (file, callback) => {
        context('print smthing')
        return done();
      });
  });
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
