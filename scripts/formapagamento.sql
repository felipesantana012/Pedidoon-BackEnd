--INIT#obterFormapagamento#
SELECT
   *
from 
    formapagamento
--END#obterFormapagamento#

--INIT#salvarFormaPagamento#
UPDATE 
    formapagamento
SET
    ativo = @ativo
WHERE
    idformapagamento = @idformapagamento
--END#salvarFormaPagamento#