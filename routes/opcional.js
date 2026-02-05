const controllerOpcional = require('../controllers/opcional.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.get('/opcional/produto/:idproduto', async (req, res) => {
    const result = await controllerOpcional
      .controllers()
      .obterOpcionaisProduto(req);
    res.send(200, result);
  });
};
