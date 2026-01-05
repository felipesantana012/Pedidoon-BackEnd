const controllerProduto = require('../controllers/produto.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.get(
    '/produto/categoria/:id',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerProduto
        .controllers()
        .obterProdutosCategoria(req);
      res.send(200, result);
    },
  );
};
