const jwt = require('jsonwebtoken');
const config = require('../config');

const UsuarioAcessoToken = {
    extrairToken: (req) => {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return null;
        return authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
    },

    gerarTokenAcesso: (dados) => {
        try {
            return jwt.sign({
                'email': dados.email,
                'idempresa': dados.idempresa,
                'nome': dados.nome
            }, config.jwt_secret, { expiresIn: '1d' });
        } catch (error) {
            console.log('Erro ao gerar token de acesso: ', error);
            throw error;
        }
    },

    validarTokenAcesso: (req, res, next) => {
        const token = UsuarioAcessoToken.extrairToken(req);
        if (!token) {
            return res.send(401, { status: 'error', message: 'Token não fornecido.' });
        }
        try {
            jwt.verify(token, config.jwt_secret);
            next();
        } catch (error) {
            res.send(401, { status: 'error', message: 'Token inválido ou expirado.' });
        }
    },

    retornarCodigoTokenAcesso: (valor, req) => {
        const token = UsuarioAcessoToken.extrairToken(req);
        if (!token) return undefined;
        try {
            const decoded = jwt.decode(token);
            return decoded && decoded[valor] ? decoded[valor] : undefined;
        } catch (err) {
            return undefined;
        }
    }
};

module.exports = UsuarioAcessoToken;