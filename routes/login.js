
const controllerLogin = require('../controllers/login.js');

module.exports = (server) => {
    server.post('/login', async (req, res) => {
        const result = await controllerLogin.controllers().login(req);
        res.send(200, result);
    });
}