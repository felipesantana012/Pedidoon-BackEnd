const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');


const controllers = () => {

    const obterDadosCompletos = async (req) => {
       
    try {
        var ComandoSql = await readCommandSql.retornaStringSql('obterDadosCompletos', 'empresa');
        var result = await db.Query(ComandoSql);

        return{
            status: 'success',
            data: result
        }
    } catch (error) {
        console.log('Erro ao obter dados da empresa: ', error);
        return{
            status: 'error',
            message: 'Erro ao obter dados da empresa.'
        }
        
    }

    };

     const salvarDadosSobre = async (req) => {
       
    try {

        let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
        if (!empresaId) {
            return {
                status: 'error',
                message: 'Id da empresa null ou vazio'
            };
        }
        req.body.idempresa = empresaId;

        var ComandoSql = await readCommandSql.retornaStringSql('salvarDadosSobre', 'empresa');
        await db.Query(ComandoSql, req.body);

        return{
            status: 'success',
            message: 'Dados atualizados com sucesso!'
        }
    } catch (error) {
        console.log('Erro ao obter dados da empresa: ', error);
        return{
            status: 'error',
            message: 'Falha ao atualizar dados.'
        }
        
    }

    };

      const salvarEndereco = async (req) => {
       
    try {

        let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
        if (!empresaId) {
            return {
                status: 'error',
                message: 'Id da empresa null ou vazio'
            };
        }
        req.body.idempresa = empresaId;

        var ComandoSql = await readCommandSql.retornaStringSql('salvarEndereco', 'empresa');
        await db.Query(ComandoSql, req.body);

        return{
            status: 'success',
            message: 'Endereco atualizado com sucesso!'
        }
    } catch (error) {
        console.log('Erro ao atualizar endereco da empresa: ', error);
        return{
            status: 'error',
            message: 'Falha ao atualizar endereco.'
        }
        
    }

    };

    return Object.create({
        obterDadosCompletos,
        salvarDadosSobre,
        salvarEndereco
    });
}

module.exports = Object.assign({controllers});