const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');


const controllers = () => {

    const obterHorarios = async (req) => {
       
    try {
        let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
        if (!empresaId) {
            return {
                status: 'error',
                message: 'Id da empresa null ou vazio'
            };
        }
        req.body.idempresa = empresaId;
        var ComandoSql = await readCommandSql.retornaStringSql('obterHorarios', 'horario');
        var result = await db.Query(ComandoSql, {
            idempresa: empresaId
        });
        return{
            status: 'success',
            data: result
        }
    } catch (error) {
        console.log('Erro ao obter os horarios da empresa: ', error);
        return{
            status: 'error',
            message: 'Erro ao obter os horarios da empresa.'
        }
        
    }

    };

    return Object.create({
        obterHorarios,
    });
}

module.exports = Object.assign({controllers});