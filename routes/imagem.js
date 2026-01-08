const controllerImagem = require('../controllers/imagem.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.post(
    '/image/logo/upload',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerImagem.controllers().uploadLogo(req);
      res.send(200, result);
    },
  );

  server.post(
    '/image/logo/remove',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerImagem.controllers().removerLogo(req);
      res.send(200, result);
    },
  );

  server.post(
    '/image/produto/upload/:idproduto',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerImagem
        .controllers()
        .uploadImagemProduto(req);
      res.send(200, result);
    },
  );

  server.post(
    '/image/produto/remove',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerImagem
        .controllers()
        .removerImagemProduto(req);
      res.send(200, result);
    },
  );
};
