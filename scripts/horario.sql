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
    idempresa = 1;
--END#obterHorarios#

--INIT#removerHorarios#
DELETE FROM 
    horario
WHERE 
    idempresa = 1;
--END#removerHorarios#

--INIT#salvarHorario#
INSERT INTO horario
(
    idempresa,
    diainicio,
    diafim,
    iniciohorarioum,
    fimhorarioum,
    iniciohorariodois,
    fimhorariodois
)
VALUES
(
    @idempresa,
    @diainicio,
    @diafim,
    @iniciohorarioum,
    @fimhorarioum,
    @iniciohorariodois,
    @fimhorariodois
);
--END#salvarHorario#