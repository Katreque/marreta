const fs = require('fs');

const LOCAL_TXT = 'C:\\ProgramData\\Local\\Temp\\.nfeasy-cache\\host-log.txt';

var lerLog = function() {
  return new Promise((resolve, reject) => {
    fs.readFile(LOCAL_TXT, 'latin1', ((err, data) => {
      if (!!err) {
        return reject(err);
      }

      return resolve(data);
    }));
  })
}

var deletarLog = function() {
  return new Promise((resolve, reject) => {
    fs.unlinkSync(LOCAL_TXT, function(err){
      if (!!err) {
        return reject(err);
      }

      return resolve();
    })
  })
}

module.exports = {
  lerLog: lerLog,
  deletarLog: deletarLog
}
