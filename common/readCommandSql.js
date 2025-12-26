var fs = require('fs');
const path = require('path');

module.exports = class ReadCommandSql{

    async retornaStringSql(chave, controller)
    {
        var commandRegex = '';

        try {
            await new Promise (async (resolve) => {
                const caminhoArquivo = path.join(__dirname, '..', '/scripts', `${controller}.sql`);
                await fs.readFile(caminhoArquivo, 'utf8', (err, buf) => {
                    if (err) {
                        console.error('Erro ao ler o arquivo SQL:', err);
                        resolve();
                    }
                    var str = buf.toString();
                    var regex = new RegExp(`^--INIT#${chave}#(.*?)^--END#${chave}#`, 'sm');

                    commandRegex = str.match(regex);
                    commandRegex = commandRegex[0].toString().replace(`--INIT#${chave}#`, '').replace(`--END#${chave}#`, '');

                    resolve();

                });

            });
        } catch (error) {
            
        }

        return commandRegex;
    }

}