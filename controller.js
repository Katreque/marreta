const $ = require('jquery');
const fs = require('fs');
const readline = require('readline');

const ManipulacaoLog = require('./manipulacaoLog.js');
const ManipulacaoProcesso = require('./manipulacaoProcesso');

ManipulacaoProcesso.ativarDebugModeDll();

var analisarlog = function() {
    $('#containerInfo').text("Carregando...");
    ManipulacaoLog.lerLog()
      .then((data) => {
        $('#containerInfo').text(data);
        verificarInicializacao(data);
      })
      .catch((err) => {
        $('#containerInfo').text(err);
      })
}

var verificarInicializacao = function(data) {
  $('#extensaoConexaoDllContainer').remove();

  if (data.indexOf(`"retorno":1,"mensagem":"Inicialização completa."`) !== -1) {
    $('#extensaoConexaoDll').append(`
        <div id="extensaoConexaoDllContainer">
          <i class="fa fa-check-circle-o fa-lg" aria-hidden="true"></i>
          <span>Extensão conectada a DLL</span>
        </div>
      `);
    return;
  }

  $('#extensaoConexaoDll').append(`
      <div id="extensaoConexaoDllContainer">
        <i class="fa fa-times-circle-o fa-lg" aria-hidden="true"></i>
        <span>Extensão conectada a DLL</span>
      </div>
    `);
  return;
}

var iniciarProcessoDll = function() {
  $('#containerInfo').text("Inicializando...");
  ManipulacaoProcesso.iniciarProcessoDll()
    .then((res) => {
      $('#containerInfo').text("Inicializada.");
    })
    .catch((err) => {
      $('#containerInfo').text(err.toString());
    })
}

var encerrarProcessoDll = function() {
  ManipulacaoProcesso.encerrarProcessoDll()
    .then((res) => {
      ManipulacaoLog.deletarLog();
      return $('#containerInfo').text(res);
    })
    .catch((err) => {
      return $('#containerInfo').text(err);
    })
}

var retornarTopo = function() {
  return document.getElementById("containerScroll").scrollTop = 0;
}

$('#iniciarProcessamento').on('click', analisarlog);
$('#encerrarProcessoDll').on('click', encerrarProcessoDll);
$('#iniciarProcessoDll').on('click', iniciarProcessoDll);
$('#retornaAoTopo').on('click', retornarTopo);
