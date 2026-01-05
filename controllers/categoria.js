require('dotenv').config();
const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const controllers = () => {
  const listarTodas = async (req) => {
    try {
      // Pega o idempresa do Token para garantir que ele só veja as categorias DELE
      const empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);

      const ComandoSql = await readCommandSql.retornaStringSql(
        'listarTodas',
        'categoria',
      );
      const result = await db.Query(ComandoSql, {
        idempresa: empresaId, // Usa o ID do token em vez do process.env fixo
      });

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter as categorias: ', error);
      return { status: 'error', message: 'Falha ao obter as categorias.' };
    }
  };

  const salvarDados = async (req) => {
    try {
      const empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
      const { idcategoria } = req.body;

      const acao =
        idcategoria > 0 ? 'atualizarCategoria' : 'adicionarCategoria';
      const comandoSql = await readCommandSql.retornaStringSql(
        acao,
        'categoria',
      );

      // SOLUÇÃO: Espalha o body e adiciona o idempresa do Token
      await db.Query(comandoSql, {
        ...req.body,
        idempresa: empresaId,
      });

      return {
        status: 'success',
        message:
          idcategoria > 0
            ? 'Categoria atualizada com sucesso'
            : 'Categoria criada com sucesso',
      };
    } catch (error) {
      console.error('Erro na operação de categoria: ', error);
      return { status: 'error', message: 'Falha ao salvar categoria.' };
    }
  };

  const ordenarCategorias = async (req) => {
    try {
      const empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
      const lista = req.body; // Array de { idcategoria, ordem }

      const comandoSql = await readCommandSql.retornaStringSql(
        'atualizarOrdenarCategoria',
        'categoria',
      );

      // Correção da lógica de Promises
      const promises = lista.map(async (elem) => {
        return db.Query(comandoSql, {
          idcategoria: elem.idcategoria,
          ordem: elem.ordem,
          idempresa: empresaId, // Injeta o idempresa em cada update para segurança
        });
      });

      await Promise.all(promises);

      return { status: 'success', message: 'Categorias ordenadas com sucesso' };
    } catch (error) {
      console.error('Erro na operação de categoria: ', error);
      return { status: 'error', message: 'Falha ao ordenar categoria.' };
    }
  };

  return {
    listarTodas,
    salvarDados,
    ordenarCategorias,
  };
};

module.exports = { controllers };
