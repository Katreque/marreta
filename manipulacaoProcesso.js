const cp = require('child_process');
const fs = require('fs');
const xml2js = require('xml2js');
const parseString = xml2js.parseString;

//Motivo: https://github.com/electron-userland/electron-builder/issues/1120
require ('hazardous');
const regedit = require('regedit');

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

var _caminhoArquivoConfigExtensao = function() {
  return new Promise((resolve, reject) => {
    regedit.list(['HKCU\\SOFTWARE\\GOOGLE\\CHROME\\NATIVEMESSAGINGHOSTS\\BR.COM.ALTERDATA.KOOPON'], function(err, result) {
      if (!!err) {
        return reject(err);
      }

      let _resultadoParseado = result['HKCU\\SOFTWARE\\GOOGLE\\CHROME\\NATIVEMESSAGINGHOSTS\\BR.COM.ALTERDATA.KOOPON'];
      return resolve((_resultadoParseado.values[""].value).toString());
    })
  })
}

var _obterIdArquivoConfigExtensao = function(localArquivoConfig) {
  return new Promise((resolve, reject) => {
    fs.readFile(localArquivoConfig, 'latin1', (err, data) => {
      if (err) {
        return reject(err);
      }
      data = JSON.parse(data);
      return resolve(data.allowed_origins[0]);
    })
  })
}

var _criaBatOpenChromeExtension = function(idArquivoConfig, possuiFrontLocal, portaFrontLocal){
  var AMB_KOOPON = "";

  if (!!possuiFrontLocal) {
    AMB_KOOPON = "https://koopon-dev.alterdata.com.br:" + portaFrontLocal.toString();
  } else {
    AMB_KOOPON = "https://koopon-dev.alterdata.com.br";
  }

  return new Promise((resolve, reject) => {
    let arquivoEscrita =
    `
    @echo off
    start chrome --new-window `+idArquivoConfig+`views/popup.html `+AMB_KOOPON+`
    :exit
    `;

    fs.writeFile('openChromeExtension.bat', arquivoEscrita, function(err) {
      if (!!err) {
        return reject(err);
      }

      resolve();
    })
  })
}

var iniciarProcessoDll = function(possuiFrontLocal, portaFrontLocal) {
  return new Promise((resolve, reject) => {
    _caminhoArquivoConfigExtensao()
      .then((localArquivo) => {
        return _obterIdArquivoConfigExtensao(localArquivo);
      })
      .then((idArquivoConfig) => {
        return _criaBatOpenChromeExtension(idArquivoConfig, possuiFrontLocal, portaFrontLocal);
      })
      .then(() => {
        cp.exec("openChromeExtension.bat", function(err, stdout, stderr){
          if (!!err) {
            return reject("Erro ao abrir openChromeExtension.bat!");
          }

          return resolve()
        })
      })
      .catch((err) => {
        throw(err);
      })
    })
}

var _ajusteXmlParaDebug = function(data) {
  let _data = data;
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
