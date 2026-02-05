--INIT#obterOpcionaisProduto#
SELECT 
    op.idopcional,
    opitem.idopcionalitem,
    op.nome AS titulo,
    op.tiposimples,
    op.minimo,
    op.maximo,
    opitem.nome AS nomeopcional,
    opitem.valor AS valoropcional
FROM
    produtoopcional AS po
    JOIN opcional AS op ON op.idopcional = po.idopcional
        AND op.apagado = 0
    RIGHT JOIN opcionalitem AS opitem ON opitem.idopcional = op.idopcional
        AND opitem.apagado = 0
WHERE
    po.idproduto = @idproduto
AND po.apagado = 0
--END#obterOpcionaisProduto#