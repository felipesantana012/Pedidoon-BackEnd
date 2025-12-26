const AcessoDados = require('../db/acessodados');
const db = new AcessoDados();

const ReadCommandSql = require('../common/readCommandSql');
const readCommandSql = new ReadCommandSql();

const Acesso = require('../common/protecaoAcesso.js');

const mv = require('mv');
const fs = require('fs');
const path = require('path');

const controllers = () => {

    
    const uploadLogo = async (req) => {
       
    try {

         let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
        if (!empresaId) {
            return {
                status: 'error',
                message: 'Id da empresa null ou vazio'
            };
        }

        const imagem = req.files.image;
        let name = imagem.name.split('.');
        const extension = name[name.length - 1];
        const new_path = path.join(__dirname, '..', `/public/images/empresa/${name[0]}.${extension}`);
        mv(imagem.path, new_path, {
            mkdirp: true
        },(err, result) => {
            if (err) {
                console.log('Erro ao mover a imagem: ', err);
                return false;
            }
        })

        var ComandoSql = await readCommandSql.retornaStringSql('adicionarImagem', 'empresa');
        await db.Query(ComandoSql, {
            idempresa: empresaId,
            logotipo: `${name[0]}.${extension}`
        });

        return{
            status: 'success',
            message: 'Imagem atualizada com sucesso!',
            logotipo: `${name[0]}.${extension}`
        }
    } catch (error) {
        console.log('Falha ao salvar imagem: ', error);
        return{
            status: 'error',
            message: 'Falha ao salvar imagem. Tente novamente mais tarde.'
        }
        
    }

    };

     const removerLogo = async (req) => {
       
    try {

         let empresaId = Acesso.retornarCodigoTokenAcesso('idempresa', req);
        if (!empresaId) {
            return {
                status: 'error',
                message: 'Id da empresa null ou vazio'
            };
        }

        if (req.body.imagem == undefined || req.body.imagem == '' || req.body.imagem == null) {
            return{
                status: 'error',
                message: 'Imagem inválida.'
            }
            
        }
        const imagem = req.body.imagem;
       
        const filePath = path.join(__dirname, '..', `/public/images/empresa/${imagem}`);
        fs.unlinkSync(filePath)
       
        var ComandoSql = await readCommandSql.retornaStringSql('removerImagem', 'empresa');
        await db.Query(ComandoSql, {
            idempresa: empresaId
        });

        return{
            status: 'success',
            message: 'Imagem removida com sucesso!'
        }
    } catch (error) {
        console.log('Falha ao remover imagem: ', error);
        return{
            status: 'error',
            message: 'Falha ao remover imagem.'
        }
        
    }

    };

       return Object.create({
        uploadLogo,
        removerLogo
    });
}

module.exports = Object.assign({controllers});
