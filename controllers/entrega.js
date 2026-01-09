const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const controllers = () => {
  const obterTiposEntrega = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterTiposEntrega',
        'entrega',
      );
      const result = await db.Query(ComandoSql);

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter os tipos entrega: ', error);
      return { status: 'error', message: 'Falha ao obter os tipos entrega.' };
    }
  };

  const ativarTipoEntrega = async (req) => {
    try {
      const { idtipoentrega, ativo } = req.body;

      const ComandoSql = await readCommandSql.retornaStringSql(
        'ativarTipoEntrega',
        'entrega',
      );

      await db.Query(ComandoSql, { idtipoentrega, ativo });

      return {
        status: 'success',
        message: 'Tipo de entrega atualizado com sucesso.',
      };
    } catch (error) {
      console.log('Erro ao ativar/desativar tipo de entrega: ', error);
      return {
        status: 'error',
        message: 'Falha ao atualizar o tipo de entrega.',
      };
    }
  };

  const salvarTipoEntrega = async (req) => {
    try {
      const { idtipoentrega, tempominimo, tempomaximo } = req.body;

      const ComandoSql = await readCommandSql.retornaStringSql(
        'salvarTipoEntrega',
        'entrega',
      );

      await db.Query(ComandoSql, { idtipoentrega, tempominimo, tempomaximo });

      return {
        status: 'success',
        message: 'Configurações do tipo de entrega salvas com sucesso.',
      };
    } catch (error) {
      console.log('Erro ao salvar configurações do tipo de entrega: ', error);
      return {
        status: 'error',
        message: 'Falha ao salvar as configurações do tipo de entrega.',
      };
    }
  };

  return {
    obterTiposEntrega,
    ativarTipoEntrega,
    salvarTipoEntrega,
  };
};

module.exports = { controllers };
