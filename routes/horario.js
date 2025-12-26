
const controllerHorario = require('../controllers/horario.js');
const Acesso = require('../common/protecaoAcesso.js');

module.exports = (server) => {


    server.get('/empresa/horario', async (req, res) => {
        const result = await controllerHorario.controllers().obterHorarios(req);
        res.send(200, result);
    });

}