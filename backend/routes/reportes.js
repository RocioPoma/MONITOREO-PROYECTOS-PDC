const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/lineas-estrategicas',(req,res)=>{

    const query=`SELECT LNE.descripcion ,COUNT(PROY.id_proyecto) total FROM linea_estrategica AS LNE
	LEFT JOIN linea_de_accion AS LNA ON LNA.id_linea_estrategica = LNE.id_linea_estrategica
	LEFT JOIN accion_estrategica AS ACCE ON ACCE.id_linea_accion = LNA.id_linea_accion
	LEFT JOIN proyecto AS PROY ON PROY.id_accion_estrategica = ACCE.id_accion_estrategica
	GROUP BY LNE.id_linea_estrategica;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes lineas estrategias',err});
        res.json(result)
    })
});
router.get('/categorias',(req,res)=>{

    const query=`SELECT CAT.nom_categoria,COUNT(PROY.id_proyecto) AS total FROM categoria AS CAT
	LEFT JOIN proyecto AS PROY ON PROY.id_categoria = CAT.id_categoria
	GROUP BY CAT.id_categoria;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes categorias',err});
        res.json(result)
    })
});
router.get('/tipologias',(req,res)=>{

    const query=`SELECT TIP.nom_tipologia,COUNT(PROY.id_proyecto) AS total FROM tipologia AS TIP
	LEFT JOIN proyecto AS PROY ON PROY.id_tipologia = TIP.id_tipologia
	GROUP BY TIP.id_tipologia;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes tipologias',err});
        res.json(result)
    })
});

router.get('/pdc_etapa',(req,res)=>{

    const query=`SELECT
    I.id_indicador,
    I.nombre_indicador,
    COUNT(DISTINCT P.id_proyecto) AS cantidad_proyectos,
    SUM(CASE 
        WHEN UltimaEtapa.ultima_etapa = 1 THEN 1
        WHEN UltimaEtapa.ultima_etapa  IN (2, 13)  THEN 1
        WHEN UltimaEtapa.ultima_etapa IN (3, 14) THEN 1
        WHEN UltimaEtapa.ultima_etapa IN (4, 12, 15) THEN 1
        WHEN UltimaEtapa.ultima_etapa IN (5, 8) THEN 1
        WHEN UltimaEtapa.ultima_etapa IN (6, 9) THEN 1
        WHEN UltimaEtapa.ultima_etapa = 7 THEN 1
        WHEN UltimaEtapa.ultima_etapa = 10 THEN 1 
        WHEN UltimaEtapa.ultima_etapa = 11 THEN 1
        ELSE 0
    END) AS Etapa_Numero,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 1 THEN 1 ELSE 0 END) AS ITCP,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 2 or UltimaEtapa.ultima_etapa = 13 THEN 1 ELSE 0 END) AS EDTP,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 3 or UltimaEtapa.ultima_etapa = 14 THEN 1 ELSE 0 END) AS Gestion_Financiamiento,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 4 or UltimaEtapa.ultima_etapa = 12 or UltimaEtapa.ultima_etapa = 15 THEN 1 ELSE 0 END) AS Ejecucion,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 5 or UltimaEtapa.ultima_etapa = 8 THEN 1 ELSE 0 END) AS Propuesta,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 6 or UltimaEtapa.ultima_etapa = 9 THEN 1 ELSE 0 END) AS Validacion,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 7 THEN 1 ELSE 0 END) AS Promulgacion,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 10 THEN 1 ELSE 0 END) AS Aprobacion,
    SUM(CASE WHEN UltimaEtapa.ultima_etapa = 11 THEN 1 ELSE 0 END) AS Organizacion
FROM
    INDICADOR AS I
LEFT JOIN
    PROYECTO AS P
ON
    I.id_indicador = P.id_indicador
LEFT JOIN
    (
        SELECT
            EP1.id_proyecto,
            MAX(E.id_etapa) AS ultima_etapa
        FROM
            ETAPA_PROYECTO AS EP1
        INNER JOIN
            ETAPA AS E
        ON
            EP1.id_etapa = E.id_etapa
        GROUP BY
            EP1.id_proyecto
    ) AS UltimaEtapa
ON
    P.id_proyecto = UltimaEtapa.id_proyecto
GROUP BY
    I.id_indicador, I.nombre_indicador
ORDER BY
    I.id_indicador;
`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes pdc',err});
        res.json(result)
    })
});
module.exports=router;