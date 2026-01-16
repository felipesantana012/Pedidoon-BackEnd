const controllerTaxaEntrega = require('../controllers/taxaentrega.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.get(
    '/taxaentregatipo',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerTaxaEntrega
        .controllers()
        .obterTaxaEntregaTipo(req);
      res.send(200, result);
    },
  );

  server.post(
    '/taxaentregatipo/ativar',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerTaxaEntrega
        .controllers()
        .ativarTaxaEntregaTipo(req);
      res.send(200, result);
    },
  );

  server.get(
    '/taxaentregatipo/taxaunica',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerTaxaEntrega
        .controllers()
        .obterTaxaUnica(req);
      res.send(200, result);
    },
  );

  server.post(
    '/taxaentregatipo/taxaunica',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerTaxaEntrega
        .controllers()
        .salvarTaxaUnica(req);
      res.send(200, result);
    },
  );

  server.get(
    '/taxaentregatipo/taxapordistancia',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerTaxaEntrega
        .controllers()
        .obterTaxaPorDistancia(req);
      res.send(200, result);
    },
  );

  server.post(
    '/taxaentregatipo/taxapordistancia',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerTaxaEntrega
        .controllers()
        .salvarTaxaDistancia(req);
      res.send(200, result);
    },
  );

  server.post(
    '/taxaentregatipo/taxapordistancia/ativar',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerTaxaEntrega
        .controllers()
        .ativarTaxaDistancia(req);
      res.send(200, result);
    },
  );
  server.post(
    '/taxaentregatipo/taxapordistancia/remover',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerTaxaEntrega
        .controllers()
        .removerTaxaDistancia(req);
      res.send(200, result);
    },
  );
};
