const controllerProduto = require('../controllers/produto.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.get('/produto', async (req, res) => {
    const result = await controllerProduto.controllers().obterProdutos(req);
    res.send(200, result);
  });

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

  server.post('/produto', Acesso.validarTokenAcesso, async (req, res) => {
    const result = await controllerProduto.controllers().salvarDados(req);
    res.send(200, result);
  });

  server.post(
    '/produto/ordenar',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerProduto.controllers().ordenarProdutos(req);
      res.send(200, result);
    },
  );

  server.post(
    '/produto/remove',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerProduto.controllers().removerProduto(req);
      res.send(200, result);
    },
  );

  server.post(
    '/produto/duplicar',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerProduto.controllers().duplicarProduto(req);
      res.send(200, result);
    },
  );
};
