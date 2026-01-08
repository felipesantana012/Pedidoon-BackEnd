const controllerCategoria = require('../controllers/categoria.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {
  server.get('/categoria', async (req, res) => {
    const result = await controllerCategoria.controllers().listarTodas(req);
    res.send(200, result);
  });

  server.post('/categoria', Acesso.validarTokenAcesso, async (req, res) => {
    const result = await controllerCategoria.controllers().salvarDados(req);
    res.send(200, result);
  });

  server.post(
    '/categoria/ordenar',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerCategoria
        .controllers()
        .ordenarCategorias(req);
      res.send(200, result);
    },
  );

  server.post(
    '/categoria/remove',
    Acesso.validarTokenAcesso,
    async (req, res) => {
      const result = await controllerCategoria
        .controllers()
        .removerCategoria(req);
      res.send(200, result);
    },
  );
};
