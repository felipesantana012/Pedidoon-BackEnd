const controllerEntrega = require('../controllers/entrega.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.get('/entrega/tipo', async (req, res) => {
    const result = await controllerEntrega.controllers().obterTiposEntrega(req);
    res.send(200, result);
  });

  server.post(
    '/entrega/tipo/ativar',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerEntrega
        .controllers()
        .ativarTipoEntrega(req);
      res.send(200, result);
    },
  );

  server.post(
    '/entrega/tipo/salvar',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerEntrega
        .controllers()
        .salvarTipoEntrega(req);
      res.send(200, result);
    },
  );
};
