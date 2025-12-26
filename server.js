// Pedidoon - BackEnd/server.js
const restify = require('restify');
const path = require('path');
const recursiveReaddir = require('recursive-readdir');

// IMPORTANTE: Importa o config corretamente para uma constante
const config = require('./config'); 
const { exit } = require('process');

// Cria o servidor
const server = restify.createServer({
    name: 'Pedidoon-BackEnd',
    version: '1.0.0'
});

// Plugins do Restify
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.urlEncodedBodyParser());

// CONFIGURAÇÃO DE ROTAS
// __dirname garante que ele pegue a pasta onde este arquivo server.js está, 
// e procure a pasta routes dentro dela.
const pathFiles = path.join('../Pedidoon - BackEnd/', 'routes');

// Verifica se a pasta existe antes de tentar ler (opcional, mas evita crash se a pasta routes estiver vazia/inexistente)
try {
    recursiveReaddir(pathFiles, ['!*.js'], (err, files) => {
        if (err) {
            console.error('⚠️  Aviso: Nenhuma rota encontrada ou erro ao ler pasta routes:', err.message);
            exit(1);
        } else {
            files.forEach((file) => {
                require(file)(server);
            });
        }
    });
} catch (e) {
    console.error('Erro ao carregar rotas');
}

// CORS
server.use(function nocache(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('pragma', 'no-cache');
    next();
});

// Rota publica no server para imagens
server.get('/public/*', restify.plugins.serveStatic({
    directory: __dirname
}));

// Tratamento de Erros
server.on('restifyError', function (req, res, err, callback) {
    err.toJSON = function customToJSON() {
        return {
            Erro: 'Pagina não encontrada :/',
            message: err.message,
            code: err.code,
            statusCode: err.statusCode
        };
    };
    return callback();
});

// Exporta o objeto corretamente
module.exports = { server, restify, config };