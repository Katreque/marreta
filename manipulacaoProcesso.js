const cp = require('child_process');

var encerrarProcessoDll = function() {
  return new Promise((resolve, reject) => {
    cp.exec("dllEnder.bat", function(err, stdout, stderr){
      if (!!err) {
        return reject("Processo já encerrado!");
      }

      return resolve("Recarregue a extensão e clique em Analisar novamente!")
    })
  })
}

module.exports = {
  encerrarProcessoDll: encerrarProcessoDll
}
