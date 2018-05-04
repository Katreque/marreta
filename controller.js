const $ = require('jquery');
const fs = require('fs');
const readline = require('readline');

var log = function() {
  fs.readFile('C:\\ProgramData\\Local\\Temp\\.nfeasy-cache\\host-log.txt', 'latin1', ((err, data) => {
    if (err) {
      $('#containerInfo').text(err.toString());
    }

    $('#containerInfo').text(data);
    verificaInicializacao(data);
  }));
}

var verificaInicializacao = function(data) {
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

var retornarTopo = function() {
  return document.documentElement.scrollTop = 0;
}

$('#iniciarProcessamento').on('click', log);
$('#retornaAoTopo').on('click', retornarTopo);
