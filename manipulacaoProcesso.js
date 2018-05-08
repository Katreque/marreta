const cp = require('child_process');
const fs = require('fs');
const xml2js = require('xml2js');
const parseString = xml2js.parseString;

const DLL_CONFIG = "C:\\Program Files (x86)\\Alterdata\\Nimbus\\Koopon-e\\Host\\NFeasy2.Plugin.Navegador.exe.config";

var encerrarProcessoDll = function() {
  return new Promise((resolve, reject) => {
    cp.exec("dllEnder.bat", function(err, stdout, stderr){
      if (!!err) {
        return reject("Processo já encerrado!");
      }

      return resolve("Processo encerrado!");
    })
  })
}

var iniciarProcessoDll = function() {
  return new Promise((resolve, reject) => {
    cp.exec("openChromeExtension.bat", function(err, stdout, stderr){
      if (!!err) {
        return reject("Erro ao abrir!");
      }

      return resolve()
    })
  })
}

var _ajusteXmlParaDebug = function(data) {
  let _data = data;
  console.log(_data);
  _data.configuration.log4net[0].root[0].level[0].$.value = "DEBUG";

  var builder = new xml2js.Builder();
  var xml = builder.buildObject(_data);
  return xml;
}

var ativarDebugModeDll = function() {
  fs.readFile(DLL_CONFIG, (err, data) => {
    parseString(data, function(err, res) {
      let _xmlRetorno = _ajusteXmlParaDebug(res);
      fs.writeFile(DLL_CONFIG, _xmlRetorno, function(err) {
        if (!!err) {
          return alert(err);
        }
      })
    })
  })
}

module.exports = {
  iniciarProcessoDll: iniciarProcessoDll,
  encerrarProcessoDll: encerrarProcessoDll,
  ativarDebugModeDll: ativarDebugModeDll
}
