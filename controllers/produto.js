require('dotenv').config();
const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');
const controllerImagem = require('../controllers/imagem.js');

const controllers = () => {
  const obterProdutos = async (req) => {
    try {
      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterProdutos',
        'produto',
      );
      const result = await db.Query(ComandoSql);

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter os produtos: ', error);
      return { status: 'error', message: 'Falha ao obter os produtos.' };
    }
  };

  const obterProdutoPorId = async (req) => {
    try {
      let id = req.params.idproduto;
      const ComandoSql = await readCommandSql.retornaStringSql(
        'obterProdutoPorId',
        'produto',
      );
      const result = await db.Query(ComandoSql, { idproduto: id });

      return { status: 'success', data: result };
    } catch (error) {
      console.log('Erro ao obter os produtos: ', error);
      return { status: 'error', message: 'Falha ao obter o produto.' };
    }
  };

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

  const ordenarProdutos = async (req) => {
    try {
      const lista = req.body;

      const comandoSql = await readCommandSql.retornaStringSql(
        'atualizarOrdemProduto',
        'produto',
      );

      // Correção da lógica de Promises
      const promises = lista.map(async (elem) => {
        return db.Query(comandoSql, {
          idproduto: elem.idproduto,
          ordem: elem.ordem,
        });
      });

      await Promise.all(promises);

      return {
        status: 'success',
        message: 'Produtos ordenados com sucesso',
      };
    } catch (error) {
      console.error('Erro na operação de Produtos: ', error);
      return { status: 'error', message: 'Falha ao ordenar Produtos.' };
    }
  };

  const salvarDados = async (req) => {
    try {
      const { idcategoria, idproduto } = req.body;

      const acao = idproduto > 0 ? 'atualizarProduto' : 'adicionarProduto';
      const comandoSql = await readCommandSql.retornaStringSql(acao, 'produto');

      // SOLUÇÃO: Espalha o body e adiciona o idempresa do Token
      await db.Query(comandoSql, {
        ...req.body,
        idcategoria: idcategoria,
      });

      return {
        status: 'success',
        message:
          idproduto > 0
            ? 'Produto atualizado com sucesso'
            : 'Produto criado com sucesso',
      };
    } catch (error) {
      console.error('Erro na operação de produto: ', error);
      return { status: 'error', message: 'Falha ao salvar produto.' };
    }
  };

  const removerProduto = async (req) => {
    try {
      var idproduto = req.body.idproduto;

      if (idproduto) {
        // Chamamos a remoção de imagem
        await controllerImagem
          .controllers()
          .removerImagemProduto({ body: { idproduto: idproduto } });

        // Prosseguimos para remover o produto independente do resultado da imagem acima
        const comandoSqlRemover = await readCommandSql.retornaStringSql(
          'removerProduto',
          'produto',
        );
        await db.Query(comandoSqlRemover, { idproduto: idproduto });

        return { status: 'success', message: 'Produto removido com sucesso' };
      }
    } catch (error) {
      console.error('Erro na operação de produto: ', error);
      return { status: 'error', message: 'Falha ao remover produto.' };
    }
  };

  const duplicarProduto = async (req) => {
    try {
      var idproduto = req.body.idproduto;
      const idImagemNovo = new Date().valueOf();

      const comandoSqlProduto = await readCommandSql.retornaStringSql(
        'obterPorId',
        'produto',
      );
      const dados_produto = await db.Query(comandoSqlProduto, {
        idproduto: idproduto,
      });

      if (!dados_produto || dados_produto.length === 0) {
        return { status: 'error', message: 'Produto não encontrado.' };
      }

      let produtoDuplicado = { ...dados_produto[0] };

      const imagemOld = produtoDuplicado.imagem;

      produtoDuplicado.nome = `${produtoDuplicado.nome} (Cópia)`;

      // Só tenta copiar se imagemOld não for nula/vazia
      if (imagemOld && imagemOld !== 'null' && imagemOld !== '') {
        const resultadoCopia = await controllerImagem
          .controllers()
          .copyFile(imagemOld, idImagemNovo);

        if (resultadoCopia) {
          produtoDuplicado.imagem = resultadoCopia;
        } else {
          produtoDuplicado.imagem = null; // Se falhou a cópia física, a cópia do produto fica sem imagem
        }
      } else {
        produtoDuplicado.imagem = null; // Garante que se a original for null, a nova também seja
      }

      const comandoSqlAddProduto = await readCommandSql.retornaStringSql(
        'adicionarProdutoDuplicado',
        'produto',
      );

      // Remove IDs ou campos que o banco gera automaticamente para não dar conflito
      delete produtoDuplicado.idproduto;

      await db.Query(comandoSqlAddProduto, produtoDuplicado);

      return { status: 'success', message: 'Produto duplicado com sucesso' };
    } catch (error) {
      console.error('Erro na operação de duplicar produto: ', error);
      return { status: 'error', message: 'Falha ao duplicar produto.' };
    }
  };

  return {
    obterProdutos,
    obterProdutoPorId,
    obterProdutosCategoria,
    ordenarProdutos,
    salvarDados,
    removerProduto,
    duplicarProduto,
  };
};

module.exports = { controllers };
