const $ = require('jquery');
const fs = require('fs');
const readline = require('readline');

const ManipulacaoLog = require('./manipulacaoLog.js');
const ManipulacaoProcesso = require('./manipulacaoProcesso');

var possuiFrontLocal = false;

class kappa{
  
};

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
  ManipulacaoProcesso.iniciarProcessoDll(possuiFrontLocal, $('#valorPortaFrontLocal').val())
    .then((res) => {
      $('#containerInfo').text("Inicializada.");
    })
    .catch((err) => {
      $('#containerInfo').text(err.toString());
    })
}

var encerrarProcessoDll = function() {
  // Finally não é aceito no es5? :wutface:
  ManipulacaoProcesso.encerrarProcessoDll()
    .then((res) => {
      ManipulacaoLog.deletarLog()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      return $('#containerInfo').text(res);
    })
    .catch((err) => {
      ManipulacaoLog.deletarLog()
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      })
      return $('#containerInfo').text(err);
    })
}

var togglePossuiFrontLocal = function() {
  possuiFrontLocal = !possuiFrontLocal;
  if (!($('#valorPortaFrontLocal').val())) {
    $('#valorPortaFrontLocal').val(7777);
  }
  return possuiFrontLocal?$('#portaFrontLocal').show(1000):$('#portaFrontLocal').hide(1000);
}

var retornarTopo = function() {
  return document.getElementById("containerScroll").scrollTop = 0;
}

//onCreate
ManipulacaoProcesso.ativarDebugModeDll();
togglePossuiFrontLocal();

$('#iniciarProcessamento').on('click', analisarlog);
$('#encerrarProcessoDll').on('click', encerrarProcessoDll);
$('#iniciarProcessoDll').on('click', iniciarProcessoDll);
$('#frontLocal').on('change', togglePossuiFrontLocal);
$('#retornaAoTopo').on('click', retornarTopo);
