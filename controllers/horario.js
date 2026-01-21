const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const controllers = () => {
  const obterHorarios = async (req) => {
    try {
      var ComandoSql = await readCommandSql.retornaStringSql(
        'obterHorarios',
        'horario',
      );
      var result = await db.Query(ComandoSql, {
        idempresa: 1,
      });
      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      console.log('Erro ao obter os horarios da empresa: ', error);
      return {
        status: 'error',
        message: 'Erro ao obter os horarios da empresa.',
      };
    }
  };

  const salvarHorarios = async (req) => {
    try {
      let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
      if (!empresaId) {
        return {
          status: 'error',
          message: 'Id da empresa null ou vazio',
        };
      }

      var ComandoSqlRemove = await readCommandSql.retornaStringSql(
        'removerHorarios',
        'horario',
      );
      await db.Query(ComandoSqlRemove, {
        idempresa: empresaId,
      });

      var ComandoSql = await readCommandSql.retornaStringSql(
        'salvarHorario',
        'horario',
      );
      const sleep = (m) => new Promise((r) => setTimeout(r, m));
      await Promise.all(
        req.body.map(async (horario) => {
          horario.idempresa = empresaId;
          await db.Query(ComandoSql, horario);
          await sleep(400);
        }),
      );

      return {
        status: 'success',
        message: 'Horarios atualizados com sucesso!',
      };
    } catch (error) {
      console.log('Erro ao salvar os horarios da empresa: ', error);
      return {
        status: 'error',
        message: 'Erro ao salvar os horarios da empresa.',
      };
    }
  };

  return Object.create({
    obterHorarios,
    salvarHorarios,
  });
};

module.exports = Object.assign({ controllers });
