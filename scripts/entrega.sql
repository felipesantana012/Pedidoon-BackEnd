--INIT#obterTiposEntrega#
SELECT
   *
from 
    tipoentrega
--END#obterTiposEntrega#

--INIT#ativarTipoEntrega#
UPDATE 
    tipoentrega
SET
    ativo = @ativo
WHERE
    idtipoentrega = @idtipoentrega
--END#ativarTipoEntrega#

--INIT#salvarTipoEntrega#
UPDATE 
    tipoentrega
SET
    tempominimo = @tempominimo,
    tempomaximo = @tempomaximo
WHERE
    idtipoentrega = @idtipoentrega
--END#salvarTipoEntrega#

