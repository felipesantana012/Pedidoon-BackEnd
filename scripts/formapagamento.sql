--INIT#obterFormapagamentoAtiva#
SELECT
   idformapagamento,
   nome
from 
    formapagamento
WHERE
    ativo = 1
--END#obterFormapagamentoAtiva#


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