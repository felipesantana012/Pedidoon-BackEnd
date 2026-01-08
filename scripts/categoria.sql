--INIT#listarTodas#
SELECT
    idcategoria,
    nome,
    icone
from 
    categoria
WHERE 
    idempresa = @idempresa
AND 
    apagado = 0
ORDER BY 
    -ordem DESC,
    idcategoria ASC
--END#listarTodas#

--INIT#atualizarCategoria#
UPDATE 
    categoria
SET
    nome = @nome,
    icone = @icone
WHERE 
    idempresa = @idempresa 
AND 
    idcategoria = @idcategoria
--END#atualizarCategoria#


--INIT#adicionarCategoria#
INSERT INTO 
    categoria (
        idempresa,
        nome,
        icone
    ) VALUES (
        @idempresa,
        @nome,
        @icone
    )
--END#adicionarCategoria#


--INIT#atualizarOrdenarCategoria#
UPDATE 
    categoria
SET
    ordem = @ordem
WHERE 
    idempresa = @idempresa 
AND 
    idcategoria = @idcategoria
--END#atualizarOrdenarCategoria#

--INIT#obterPorId#
SELECT
    idcategoria,
    nome,
    icone,
    ordem
FROM
    categoria
WHERE 
    idcategoria = @idcategoria
AND
    apagado = 0
--END#obterPorId#

--INIT#removerPorId#
UPDATE 
    categoria
SET
    apagado = 1
WHERE 
    idcategoria = @idcategoria
--END#removerPorId#