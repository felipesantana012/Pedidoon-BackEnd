const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const mv = require('mv');
const fs = require('fs');
const path = require('path');

const controllers = () => {
  const copyFile = async (imagemOld, idImagemNovo) => {
    try {
      // 1. Validação básica de string
      if (!imagemOld || imagemOld === 'null' || imagemOld === '') {
        return false;
      }

      const pathOld = path.join(
        __dirname,
        '..',
        `/public/images/cardapio/${imagemOld}`,
      );
      const extension = imagemOld.split('.').pop();
      const nameOnly = imagemOld.split('.')[0];
      const newName = `${idImagemNovo}-${nameOnly}.${extension}`;
      const pathNew = path.join(
        __dirname,
        '..',
        `/public/images/cardapio/${newName}`,
      );

      // 2. Verifica se o arquivo físico realmente existe no disco
      if (!fs.existsSync(pathOld)) {
        console.log('Arquivo original não encontrado para cópia:', pathOld);
        return false;
      }

      // 3. Copia o arquivo (usando streams ou copyFileSync para evitar o erro de read)
      fs.copyFileSync(pathOld, pathNew);

      return newName; // Retorna o novo nome para salvar no banco
    } catch (error) {
      console.error('Erro ao copiar arquivo:', error);
      return false;
    }
  };

  const uploadLogo = async (req) => {
    try {
      let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
      if (!empresaId) {
        return {
          status: 'error',
          message: 'Id da empresa null ou vazio',
        };
      }

      const imagem = req.files.image;
      let name = imagem.name.split('.');
      const extension = name[name.length - 1];
      const new_path = path.join(
        __dirname,
        '..',
        `/public/images/empresa/${name[0]}.${extension}`,
      );
      mv(
        imagem.path,
        new_path,
        {
          mkdirp: true,
        },
        (err, result) => {
          if (err) {
            console.log('Erro ao mover a imagem: ', err);
            return false;
          }
        },
      );

      var ComandoSql = await readCommandSql.retornaStringSql(
        'adicionarImagem',
        'empresa',
      );
      await db.Query(ComandoSql, {
        idempresa: empresaId,
        logotipo: `${name[0]}.${extension}`,
      });

      return {
        status: 'success',
        message: 'Imagem atualizada com sucesso!',
        logotipo: `${name[0]}.${extension}`,
      };
    } catch (error) {
      console.log('Falha ao salvar imagem: ', error);
      return {
        status: 'error',
        message: 'Falha ao salvar imagem. Tente novamente mais tarde.',
      };
    }
  };

  const removerLogo = async (req) => {
    try {
      let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
      if (!empresaId) {
        return {
          status: 'error',
          message: 'Id da empresa null ou vazio',
        };
      }

      if (
        req.body.imagem == undefined ||
        req.body.imagem == '' ||
        req.body.imagem == null
      ) {
        return {
          status: 'error',
          message: 'Imagem inválida.',
        };
      }
      const imagem = req.body.imagem;

      const filePath = path.join(
        __dirname,
        '..',
        `/public/images/empresa/${imagem}`,
      );
      fs.unlinkSync(filePath);

      var ComandoSql = await readCommandSql.retornaStringSql(
        'removerImagem',
        'empresa',
      );
      await db.Query(ComandoSql, {
        idempresa: empresaId,
      });

      return {
        status: 'success',
        message: 'Imagem removida com sucesso!',
      };
    } catch (error) {
      console.log('Falha ao remover imagem: ', error);
      return {
        status: 'error',
        message: 'Falha ao remover imagem.',
      };
    }
  };

  const uploadImagemProduto = async (req) => {
    try {
      const idproduto = req.params.idproduto;

      const idImagemNovo = new Date().valueOf();
      const imagem = req.files.image;
      let name = imagem.name.split('.');
      const extension = name[name.length - 1];
      const new_path = path.join(
        __dirname,
        '..',
        `/public/images/cardapio/${idImagemNovo}-${name[0]}.${extension}`,
      );
      mv(
        imagem.path,
        new_path,
        {
          mkdirp: true,
        },
        (err, result) => {
          if (err) {
            console.log('Erro ao mover a imagem: ', err);
            return false;
          }
        },
      );

      var ComandoSql = await readCommandSql.retornaStringSql(
        'adicionarImagemProduto',
        'produto',
      );
      await db.Query(ComandoSql, {
        idproduto: idproduto,
        imagem: `${idImagemNovo}-${name[0]}.${extension}`,
      });

      return {
        status: 'success',
        message: 'Imagem atualizada com sucesso!',
        logotipo: `${name[0]}.${extension}`,
      };
    } catch (error) {
      console.log('Falha ao salvar imagem: ', error);
      return {
        status: 'error',
        message: 'Falha ao salvar imagem. Tente novamente mais tarde.',
      };
    }
  };

  const removerImagemProduto = async (req) => {
    try {
      const idproduto = req.body.idproduto;

      const ComandoSqlObterPorId = await readCommandSql.retornaStringSql(
        'obterPorId',
        'produto',
      );
      const dados_produto = await db.Query(ComandoSqlObterPorId, {
        idproduto: idproduto,
      });

      // VALIDAÇÃO CRUCIAL: Só tenta deletar se houver um nome de imagem válido no banco
      if (
        dados_produto &&
        dados_produto.length > 0 &&
        dados_produto[0].imagem
      ) {
        const nomeImagem = dados_produto[0].imagem;

        // Evita tentar deletar se o valor for a string "null" ou vazio
        if (nomeImagem !== 'null' && nomeImagem !== '') {
          const filePath = path.join(
            __dirname,
            '..',
            `/public/images/cardapio/${nomeImagem}`,
          );

          // Verifica se o arquivo físico existe no disco antes de apagar
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }

      // Mesmo que o arquivo não exista no disco, removemos a referência no Banco de Dados
      var ComandoSql = await readCommandSql.retornaStringSql(
        'removerImagemProduto',
        'produto',
      );
      await db.Query(ComandoSql, {
        idproduto: idproduto,
      });

      return {
        status: 'success',
        message: 'Imagem removida com sucesso!',
      };
    } catch (error) {
      console.log('Falha ao remover imagem: ', error);
      // Retornamos sucesso aqui para que a remoção do produto continue
      // mesmo que a exclusão do arquivo físico falhe
      return {
        status: 'error',
        message: 'Falha ao remover arquivo físico, mas o banco foi atualizado.',
      };
    }
  };

  return Object.create({
    uploadLogo,
    removerLogo,
    uploadImagemProduto,
    removerImagemProduto,
    copyFile,
  });
};

module.exports = Object.assign({ controllers });
