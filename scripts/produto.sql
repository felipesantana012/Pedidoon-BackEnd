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
