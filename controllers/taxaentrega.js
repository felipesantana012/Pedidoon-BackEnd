const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const controllers = () => {
  const obterTaxaEntregaTipo = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterTaxaEntregaTipo',
        'taxaentrega',
      );
      const result = await db.Query(ComandoSql);

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter os tipos de taxa de entrega: ', error);
      return {
        status: 'error',
        message: 'Falha ao obter os tipos de taxa de entrega',
      };
    }
  };

  const ativarTaxaEntregaTipo = async (req) => {
    try {
      const { semtaxa, taxaunica, taxapordistancia } = req.body;

      const ComandoSqlSemTaxa = await readCommandSql.retornaStringSql(
        'ativarTaxaEntregaTipo',
        'taxaentrega',
      );
      await db.Query(ComandoSqlSemTaxa, {
        idtaxaentregatipo: 1,
        ativo: semtaxa,
      });

      const ComandoSqlTaxaUnica = await readCommandSql.retornaStringSql(
        'ativarTaxaEntregaTipo',
        'taxaentrega',
      );
      await db.Query(ComandoSqlTaxaUnica, {
        idtaxaentregatipo: 2,
        ativo: taxaunica,
      });
      const ComandoSqlTaxaPorDistancia = await readCommandSql.retornaStringSql(
        'ativarTaxaEntregaTipo',
        'taxaentrega',
      );
      await db.Query(ComandoSqlTaxaPorDistancia, {
        idtaxaentregatipo: 3,
        ativo: taxapordistancia,
      });

      return { status: 'success', message: 'Taxa selecionada com sucesso' };
    } catch (error) {
      console.log('Erro ao ativar o tipo de taxa de entrega: ', error);
      return {
        status: 'error',
        message: 'Falha ao ativar o tipo de taxa de entrega',
      };
    }
  };

  const obterTaxaUnica = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterTaxaUnica',
        'taxaentrega',
      );
      const result = await db.Query(ComandoSql);

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter a taxa unica: ', error);
      return {
        status: 'error',
        message: 'Falha ao obter a taxa unica:',
      };
    }
  };

  const salvarTaxaUnica = async (req) => {
    try {
      const dados = req.body;
      const { idtaxaentrega } = dados;

      // 1. Se existir taxa anterior, validar
      if (idtaxaentrega > 0) {
        const sqlBuscar = await readCommandSql.retornaStringSql(
          'obterTaxaUnicaPorId',
          'taxaentrega',
        );

        const [taxaExistente] = await db.Query(sqlBuscar, {
          idtaxaentrega,
        });

        // Se encontrou a taxa
        if (taxaExistente) {
          const houveAlteracao =
            taxaExistente.valor !== dados.valor ||
            taxaExistente.tempominimo !== dados.tempominimo ||
            taxaExistente.tempomaximo !== dados.tempomaximo;

          // Se não houve mudança, não faz nada
          if (!houveAlteracao) {
            return {
              status: 'success',
              message: 'Taxa única já está atualizada',
            };
          }

          // Se mudou, desativa a taxa antiga
          const sqlDesativar = await readCommandSql.retornaStringSql(
            'desativarTaxaUnicaPorId',
            'taxaentrega',
          );

          await db.Query(sqlDesativar, { idtaxaentrega });
        }
      }

      // 2. Sempre salva uma nova taxa
      const sqlSalvar = await readCommandSql.retornaStringSql(
        'salvarTaxaUnicaPorId',
        'taxaentrega',
      );

      await db.Query(sqlSalvar, {
        idtaxaentregatipo: 2,
        valor: dados.valor,
        tempominimo: dados.tempominimo,
        tempomaximo: dados.tempomaximo,
      });

      return {
        status: 'success',
        message: 'Taxa única cadastrada com sucesso',
      };
    } catch (error) {
      console.error('Erro ao salvar a taxa única:', error);
      return {
        status: 'error',
        message: 'Falha ao salvar a taxa única',
      };
    }
  };

  const obterTaxaPorDistancia = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterTaxaPorDistancia',
        'taxaentrega',
      );
      const result = await db.Query(ComandoSql);

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter a taxas por distancia: ', error);
      return {
        status: 'error',
        message: 'Falha ao obter taxas por distancia:',
      };
    }
  };

  const salvarTaxaDistancia = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'adicionarTaxaDistancia',
        'taxaentrega',
      );
      await db.Query(ComandoSql, req.body);

      return {
        status: 'success',
        message: 'Taxa por distância adicionada com sucesso',
      };
    } catch (error) {
      console.log('Erro ao adicionar a taxas por distancia: ', error);
      return {
        status: 'error',
        message: 'Falha ao adicionar taxas por distancia:',
      };
    }
  };

  const ativarTaxaDistancia = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'ativarTaxaDistancia',
        'taxaentrega',
      );
      await db.Query(ComandoSql, req.body);

      return {
        status: 'success',
        message: 'Taxa por distância atualizada com sucesso',
      };
    } catch (error) {
      console.log('Erro ao atualizar a taxa por distancia: ', error);
      return {
        status: 'error',
        message: 'Falha ao atualizar a taxa por distancia:',
      };
    }
  };

  const removerTaxaDistancia = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'removerTaxaDistancia',
        'taxaentrega',
      );
      await db.Query(ComandoSql, req.body);

      return {
        status: 'success',
        message: 'Taxa por distância removida com sucesso',
      };
    } catch (error) {
      console.log('Erro ao remover a taxas por distancia: ', error);
      return {
        status: 'error',
        message: 'Falha ao remover taxas por distancia:',
      };
    }
  };

  return {
    obterTaxaEntregaTipo,
    ativarTaxaEntregaTipo,
    obterTaxaUnica,
    salvarTaxaUnica,
    obterTaxaPorDistancia,
    salvarTaxaDistancia,
    ativarTaxaDistancia,
    removerTaxaDistancia,
  };
};

module.exports = { controllers };
