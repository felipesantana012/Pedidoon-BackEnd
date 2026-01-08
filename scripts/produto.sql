--INIT#obterProdutosCategoria#
SELECT
    p.idproduto,
	p.nome,
    p.descricao,
    p.valor,
    p.imagem,
    p.ordem
FROM
	produto AS p
WHERE
	p.idcategoria = @idcategoria
AND
	p.ativo = 1
AND
    p.apagado = 0
GROUP BY
	p.idproduto
ORDER BY
	-p.ordem DESC, p.idcategoria ASC
--END#obterProdutosCategoria#


--INIT#atualizarOrdemProduto#
UPDATE 
    produto
SET
    ordem = @ordem
WHERE 
    idproduto = @idproduto
--END#atualizarOrdemProduto#


--INIT#atualizarProduto#
UPDATE 
    produto
SET
    nome = @nome,
    valor = @valor,
    descricao = @descricao
WHERE
    idcategoria = @idcategoria 
AND
    idproduto = @idproduto
--END#atualizarProduto#
adicionarProduto


--INIT#adicionarProduto#
INSERT INTO 
    produto (
        idcategoria,
        nome,
        valor,
        descricao
    ) VALUES (
        @idcategoria,
        @nome,
        @valor,
        @descricao
    )
--END#adicionarProduto#


--INIT#adicionarProdutoDuplicado#
INSERT INTO 
    produto (
        idcategoria,
        nome,
        valor,
        descricao,
        imagem
    ) VALUES (
        @idcategoria,
        @nome,
        @valor,
        @descricao,
        @imagem
    )
--END#adicionarProdutoDuplicado#

--INIT#adicionarImagemProduto#
UPDATE
    produto
SET
    imagem = @imagem
WHERE
    idproduto = @idproduto
--END#adicionarImagemProduto#

--INIT#removerImagemProduto#
UPDATE
    produto
SET
    imagem = null
WHERE
    idproduto = @idproduto
--END#removerImagemProduto#



--INIT#obterPorId#
SELECT
    idproduto,
    idcategoria,
    nome,
    descricao,
    valor,
    imagem,
    ordem
FROM
    produto
WHERE
    idproduto = @idproduto
AND
    apagado = 0
AND
    ativo = 1
--END#obterPorId#

--INIT#removerProduto#
UPDATE
    produto
SET
    apagado = 1
WHERE
    idproduto = @idproduto
--END#removerProduto#


--INIT#obterPorCategoriaIdSemOrdenacao#
SELECT
    p.idproduto,
    p.nome,
    p.descricao,
    p.valor,
    p.imagem,
    p.ordem
FROM
    produto AS p
WHERE
    p.idcategoria = @idcategoria
AND
    p.apagado = 0
ORDER BY
    p.idproduto ASC

--END#obterPorCategoriaIdSemOrdenacao#

--INIT#removePorCategoriaId#
UPDATE
    produto
SET
    apagado = 1
WHERE
    idcategoria = @idcategoria
--END#removePorCategoriaId#
