// index.js (Na raiz do projeto)
require('dotenv').config(); // Carrega as variáveis aqui no topo!

const { server, config, restify } = require('./server.js');

// Frontend estático
// Ajuste: __dirname ajuda a garantir que ele ache a pasta FrontEnd
const path = require('path');
server.get('/*', restify.plugins.serveStatic({ 
    directory: '../Pedidoon - FrontEnd/', 
    default: 'index.html' 
}));

// Sobe o servidor
server.listen(config.port, () => { 
    console.log(`✅ SERVIDOR RODANDO`);
    console.log(`AMBIENTE: ${config.ambiente}`);
    console.log(`URL:      ${config.url}`);
    console.log(`PORTA:    ${config.port}`);
});