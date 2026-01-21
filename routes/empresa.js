const controllerEmpresa = require('../controllers/empresa.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.get('/empresa', async (req, res) => {
    const result = await controllerEmpresa.controllers().obterDados(req);
    res.send(200, result);
  });

  server.get('/empresa/sobre', async (req, res) => {
    const result = await controllerEmpresa
      .controllers()
      .obterDadosCompletos(req);
    res.send(200, result);
  });

  server.get('/empresa/open', async (req, res) => {
    const result = await controllerEmpresa
      .controllers()
      .validarEmpresaAberta(req);
    res.send(200, result);
  });

  server.post('/empresa/sobre', Acesso.validarTokenAcesso, async (req, res) => {
    const result = await controllerEmpresa.controllers().salvarDadosSobre(req);
    res.send(200, result);
  });

  server.post(
    '/empresa/endereco',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerEmpresa.controllers().salvarEndereco(req);
      res.send(200, result);
    },
  );
};
