require('dotenv').config();
const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const controllers = () => {
  const obterProdutosCategoria = async (req) => {
    try {
      let { id } = req.params;

      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterProdutosCategoria',
        'produto',
      );
      const result = await db.Query(ComandoSql, {
        idcategoria: id,
      });

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter os produtos: ', error);
      return { status: 'error', message: 'Falha ao obter os produtos.' };
    }
  };

  return {
    obterProdutosCategoria,
  };
};

module.exports = { controllers };
