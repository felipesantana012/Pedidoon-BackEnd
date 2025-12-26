--INIT#obterDadosCompletos#
SELECT 
    nome,
    cep,
    rua,
    numero,
    bairro,
    complemento,
    cidade,
    estado,
    logotipo,
    sobre
from empresa;
--END#obterDadosCompletos#


--INIT#salvarDadosSobre#
UPDATE
    empresa 
SET 
    nome = @nome,
    sobre = @sobre
WHERE 
    idempresa = @idempresa
--END#salvarDadosSobre#


--INIT#adicionarImagem#
UPDATE
    empresa 
SET 
    logotipo = @logotipo
WHERE 
    idempresa = @idempresa
--END#adicionarImagem#


--INIT#removerImagem#
UPDATE 
    empresa 
SET 
    logotipo = NULL 
WHERE 
    idempresa = @idempresa
--END#removerImagem#

--INIT#salvarEndereco#
UPDATE
    empresa 
SET 
    cep = @cep,
    rua = @rua,
    numero = @numero,
    bairro = @bairro,
    complemento = @complemento,
    cidade = @cidade,
    estado = @estado
WHERE 
    idempresa = @idempresa
--END#salvarEndereco#
