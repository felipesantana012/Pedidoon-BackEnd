const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const crypto = require('crypto');

const controllers = () => {

    const login = async (req) => {
       
        var password = req.body.senha;
        try {
             var ComandoSql = await readCommandSql.retornaStringSql('logar', 'login');
        var usuarioBanco = await db.Query(ComandoSql, req.body);
        var hashSenha = crypto.createHmac('sha256', password).digest('hex');

        if(usuarioBanco.length == 0 || usuarioBanco == undefined || usuarioBanco[0].senha !== hashSenha){
           return { 
            status: 'error', 
            message: 'Usuário ou senha inválidos.' 
                };
        }

        

        return {
            status: 'success',
            tokenAcesso: Acesso.gerarTokenAcesso(usuarioBanco[0]),
            nome: usuarioBanco[0].nome,
            email: usuarioBanco[0].email,
            logo: usuarioBanco[0].logotipo

        }
            
        } catch (error) {
            console.log('Erro no login: ', error);
            return { 
                status: 'error', 
                message: 'Falha ao realizar login. Tente novamente mais tarde.' 
                    };
            
        }
       


    };

    return Object.create({
        login,
    });
}

module.exports = Object.assign({controllers});