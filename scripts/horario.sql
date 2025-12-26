--INIT#obterHorarios#
SELECT 
    diainicio,
    diafim,
    iniciohorarioum,
    fimhorarioum,
    iniciohorariodois,
    fimhorariodois
from 
    horario
WHERE 
    idempresa = @idempresa;
--END#obterHorarios#