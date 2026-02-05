require('dotenv').config();
const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const controllers = () => {
  const obterOpcionaisProduto = async (req) => {
    try {
      let id = req.params.idproduto;
      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterOpcionaisProduto',
        'opcional',
      );
      const result = await db.Query(ComandoSql, { idproduto: id });

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter os opcionais do produto: ', error);
      return {
        status: 'error',
        message: 'Falha ao obter os opcionais do produtos.',
      };
    }
  };

  return {
    obterOpcionaisProduto,
  };
};

module.exports = { controllers };
