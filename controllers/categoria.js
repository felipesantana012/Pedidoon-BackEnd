require('dotenv').config();
const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');
const imagemController = require('../controllers/imagem.js');

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

  const removerCategoria = async (req) => {
    try {
      const { idcategoria } = req.body;

      // 1. PRIMEIRO: Obtemos a lista de produtos desta categoria
      // (Isso deve ser feito enquanto eles ainda não estão marcados como apagados)
      const ComandoSqlSelectProdutos = await readCommandSql.retornaStringSql(
        'obterPorCategoriaIdSemOrdenacao',
        'produto',
      );
      const produtos_categoria = await db.Query(ComandoSqlSelectProdutos, {
        idcategoria: idcategoria,
      });

      // 2. SEGUNDO: Removemos as imagens físicas de cada produto
      // Usamos um loop for...of ou Promise.all antes de apagar do banco
      const promisesImagens = produtos_categoria.map(async (elem) => {
        if (elem.imagem && elem.imagem !== 'null') {
          const requisicao = {
            body: { idproduto: elem.idproduto },
          };
          return imagemController
            .controllers()
            .removerImagemProduto(requisicao);
        }
      });
      await Promise.all(promisesImagens);

      // 3. TERCEIRO: Agora que os arquivos sumiram, apagamos os produtos no Banco
      const ComandoSqlRemoveProdutos = await readCommandSql.retornaStringSql(
        'removePorCategoriaId',
        'produto',
      );
      await db.Query(ComandoSqlRemoveProdutos, { idcategoria: idcategoria });

      // 4. QUARTO: Por fim, removemos a categoria
      const ComandoSqlRemoveCategoria = await readCommandSql.retornaStringSql(
        'removerPorId',
        'categoria',
      );
      await db.Query(ComandoSqlRemoveCategoria, { idcategoria: idcategoria });

      return {
        status: 'success',
        message: 'Categoria e produtos removidos com sucesso.',
      };
    } catch (error) {
      console.error('Erro na operação de categoria: ', error);
      return { status: 'error', message: 'Falha ao remover categoria.' };
    }
  };

  return {
    listarTodas,
    salvarDados,
    ordenarCategorias,
    removerCategoria,
  };
};

module.exports = { controllers };
