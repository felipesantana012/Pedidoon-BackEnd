const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const controllers = () => {
  const obterDados = async (req) => {
    try {
      var ComandoSql = await readCommandSql.retornaStringSql(
        'obterDados',
        'empresa',
      );
      var result = await db.Query(ComandoSql);

      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      console.log('Erro ao obter dados da empresa: ', error);
      return {
        status: 'error',
        message: 'Erro ao obter dados da empresa.',
      };
    }
  };

  const obterDadosCompletos = async (req) => {
    try {
      var ComandoSql = await readCommandSql.retornaStringSql(
        'obterDadosCompletos',
        'empresa',
      );
      var result = await db.Query(ComandoSql);

      return {
        status: 'success',
        data: result,
      };
    } catch (error) {
      console.log('Erro ao obter dados da empresa: ', error);
      return {
        status: 'error',
        message: 'Erro ao obter dados da empresa.',
      };
    }
  };

  const salvarDadosSobre = async (req) => {
    try {
      let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
      if (!empresaId) {
        return {
          status: 'error',
          message: 'Id da empresa null ou vazio',
        };
      }
      req.body.idempresa = empresaId;

      var ComandoSql = await readCommandSql.retornaStringSql(
        'salvarDadosSobre',
        'empresa',
      );
      await db.Query(ComandoSql, req.body);

      return {
        status: 'success',
        message: 'Dados atualizados com sucesso!',
      };
    } catch (error) {
      console.log('Erro ao obter dados da empresa: ', error);
      return {
        status: 'error',
        message: 'Falha ao atualizar dados.',
      };
    }
  };

  const salvarEndereco = async (req) => {
    try {
      let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
      if (!empresaId) {
        return {
          status: 'error',
          message: 'Id da empresa null ou vazio',
        };
      }
      req.body.idempresa = empresaId;

      var ComandoSql = await readCommandSql.retornaStringSql(
        'salvarEndereco',
        'empresa',
      );
      await db.Query(ComandoSql, req.body);

      return {
        status: 'success',
        message: 'Endereco atualizado com sucesso!',
      };
    } catch (error) {
      console.log('Erro ao atualizar endereco da empresa: ', error);
      return {
        status: 'error',
        message: 'Falha ao atualizar endereco.',
      };
    }
  };

  const validarEmpresaAberta = async (req) => {
    try {
      const comandoSql = await readCommandSql.retornaStringSql(
        'obterHorarios',
        'horario',
      );
      const horarios = await db.Query(comandoSql);

      if (!horarios || horarios.length === 0) {
        return { status: 'error', message: 'Horários não configurados.' };
      }

      const agora = new Date();
      const diaSemanaAtual = agora.getDay();
      const horaAtualMinutos = agora.getHours() * 60 + agora.getMinutes();

      const converterParaMinutos = (horaString) => {
        if (!horaString || horaString.trim() === '') return null;
        const partes = horaString.split(':');
        return parseInt(partes[0]) * 60 + parseInt(partes[1]);
      };

      let estaAberto = false;

      for (const h of horarios) {
        // Normalizar nomes das propriedades (garantir que pega mesmo se for diainicio ou diaInicio)
        const dInicio = h.diainicio ?? h.diaInicio;
        const dFim = h.diafim ?? h.diaFim;
        const h1Inicio = h.iniciohorarioum ?? h.inicioHorarioUm;
        const h1Fim = h.fimhorarioum ?? h.fimHorarioUm;

        // 1. Validar se o dia atual está no range
        let diaValido = false;
        if (dInicio <= dFim) {
          diaValido = diaSemanaAtual >= dInicio && diaSemanaAtual <= dFim;
        } else {
          diaValido = diaSemanaAtual >= dInicio || diaSemanaAtual <= dFim;
        }

        if (diaValido) {
          const inicio1 = converterParaMinutos(h1Inicio);
          const fim1 = converterParaMinutos(h1Fim);

          if (inicio1 !== null && fim1 !== null) {
            if (horaAtualMinutos >= inicio1 && horaAtualMinutos <= fim1) {
              estaAberto = true;
              break;
            }
          }

          // Repetir para o turno 2 se houver
          const h2Inicio = h.iniciohorariodois ?? h.inicioHorarioDois;
          const h2Fim = h.fimhorariodois ?? h.fimHorarioDois;
          const inicio2 = converterParaMinutos(h2Inicio);
          const fim2 = converterParaMinutos(h2Fim);

          if (inicio2 !== null && fim2 !== null) {
            if (horaAtualMinutos >= inicio2 && horaAtualMinutos <= fim2) {
              estaAberto = true;
              break;
            }
          }
        }
      }

      if (estaAberto) {
        return { status: 'success', data: true };
      } else {
        return { status: 'error', message: 'Loja fechada.' };
      }
    } catch (error) {
      console.error('ERRO CRÍTICO:', error);
      return { status: 'error', message: 'Erro interno.' };
    }
  };

  return Object.create({
    obterDadosCompletos,
    salvarDadosSobre,
    salvarEndereco,
    validarEmpresaAberta,
    obterDados,
  });
};

module.exports = Object.assign({ controllers });
