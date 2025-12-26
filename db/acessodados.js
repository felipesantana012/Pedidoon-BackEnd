var mysql = require('mysql2');
const config = require('../config'); 

module.exports = class AcessoDados{
    async Query (SqlQuery, parametros){

        try{
            var SqlQueryUp = SqlQuery;
            var retorno;
            var connection = mysql.createConnection(config.database);

            if(parametros && parametros !=undefined ){
                for(let key in parametros){                    
                    if (parametros.hasOwnProperty(key)) {
                        let campo = key;
                        let valor = parametros[key];    
                        
                        SqlQueryUp = SqlQueryUp.replace('@' + campo, `'${valor}'`);
                    }
                }
            }

            connection.connect();

            await new Promise((resolve, reject) => {
                connection.query(SqlQueryUp, function (error, results, fields) {
                    if (error) {
                        reject(error);
                        throw error;
                    } 
                        retorno = results;
                        resolve();
                    
                });
            }); 

            connection.end();
            return retorno;

        }catch(error){
            console.log('Erro ao criar conexão com o banco de dados: ', error);
            throw error;
        }

    }
}