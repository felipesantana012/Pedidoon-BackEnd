const controllerFormapagamento = require('../controllers/Formapagamento.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.get('/formapagamento/ativa', async (req, res) => {
    const result = await controllerFormapagamento
      .controllers()
      .obterFormapagamentoAtiva(req);
    res.send(200, result);
  });

  server.get('/formapagamento', Acesso.validarTokenAcesso, async (req, res) => {
    const result = await controllerFormapagamento
      .controllers()
      .obterFormapagamento(req);
    res.send(200, result);
  });

  server.post(
    '/formapagamento',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerFormapagamento
        .controllers()
        .salvarFormaPagamento(req);
      res.send(200, result);
    },
  );
};
