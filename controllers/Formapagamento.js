const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const controllers = () => {
  const obterFormapagamento = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterFormapagamento',
        'formapagamento',
      );
      const result = await db.Query(ComandoSql);

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter as Formas de pagamento: ', error);
      return {
        status: 'error',
        message: 'Falha ao obter as Formas de pagamento.',
      };
    }
  };

  const salvarFormaPagamento = async (req) => {
    try {
      const { idformapagamento, ativo } = req.body;
      const ComandoSql = await readCommandSql.retornaStringSql(
        'salvarFormaPagamento',
        'formapagamento',
      );
      const result = await db.Query(ComandoSql, {
        idformapagamento,
        ativo,
      });

      return {
        status: 'success',
        message: 'Forma de pagamento salva com sucesso.',
      };
    } catch (error) {
      console.log('Erro ao salvar as Formas de pagamento: ', error);
      return {
        status: 'error',
        message: 'Falha ao salvar as Formas de pagamento.',
      };
    }
  };

  return {
    obterFormapagamento,
    salvarFormaPagamento,
  };
};

module.exports = { controllers };
