SELECT seg.comentario,SUM(seg.monto) 
FROM `seguimiento_financiero` AS seg 
GROUP BY seg.comentario;

SELECT * FROM seguimiento_financiero;


SELECT ETP.id_etapa_proyecto,ETP.fuente_de_informacion,
  ETA.nombre_etapa,DATE_FORMAT(ETP.fecha_seguimiento, '%d-%m-%Y') AS fecha_seguimiento,
  FIN.id_financiamiento,
  SEGF.avance_seguimiento_fisico FROM ETAPA_PROYECTO AS ETP 
  JOIN ETAPA AS ETA ON ETA.id_etapa = ETP.id_etapa 
  JOIN SEGUIMIENTO_FISICO AS SEGF ON SEGF.id_etapa_proyecto = ETP.id_etapa_proyecto
  JOIN FINANCIAMIENTO AS FIN ON FIN.id_etapa_proyecto = ETP.id_etapa_proyecto
  WHERE ETP.id_proyecto = 5;
  
SELECT SUM(FIN.costo_final) AS coste_final FROM financiamiento AS FIN 
WHERE FIN.id_etapa_proyecto = 1;

SELECT SUM(SEGFIN.monto) AS monto_total FROM financiamiento AS FIN 
JOIN seguimiento_financiero AS SEGFIN ON SEGFIN.id_financiamiento = FIN.id_financiamiento
WHERE FIN.id_etapa_proyecto = 1 GROUP BY FIN.id_financiamiento;
SELECT SUM(SEGFIN.monto) AS monto_total FROM financiamiento AS FIN 
    JOIN seguimiento_financiero AS SEGFIN ON SEGFIN.id_financiamiento = FIN.id_financiamiento
    WHERE FIN.id_etapa_proyecto = 1 GROUP BY FIN.id_financiamiento;
    
    
SELECT SUM(SEGFIN.monto) AS monto_total FROM financiamiento AS FIN 
  JOIN seguimiento_financiero AS SEGFIN ON SEGFIN.id_financiamiento = FIN.id_financiamiento
  WHERE FIN.id_etapa_proyecto = 1 ;
-- SELECT PROYECTOS POR INDICADORES
SELECT IND.nombre_indicador,ETA.nombre_etapa,COUNT(ETA.nombre_etapa) AS total,PROY.nom_proyecto FROM indicador AS IND
	JOIN proyecto AS PROY ON PROY.id_indicador = IND.id_indicador
	JOIN etapa_proyecto AS ETP ON ETP.id_proyecto = PROY.id_proyecto
	JOIN etapa AS ETA ON ETA.id_etapa = ETP.id_etapa
	WHERE IND.id_indicador = 21;
SELECT * FROM etapa;
SELECT * FROM etapa_proyecto;

-- SELECT POR LINEAS ESTRATEGICAS
SELECT LNE.descripcion,COUNT(PROY.id_proyecto) AS total FROM linea_estrategica AS LNE
	JOIN linea_de_accion AS LNA ON LNA.id_linea_estrategica = LNE.id_linea_estrategica
	JOIN accion_estrategica AS ACCE ON ACCE.id_linea_accion = LNA.id_linea_accion
	JOIN proyecto AS PROY ON PROY.id_accion_estrategica = ACCE.id_accion_estrategica
	GROUP BY LNE.id_linea_estrategica;

-- SELECT POR CATEGORIAS
SELECT CAT.nom_categoria,COUNT(PROY.id_proyecto) FROM categoria AS CAT
	JOIN proyecto AS PROY ON PROY.id_categoria = CAT.id_categoria
	GROUP BY CAT.id_categoria;

-- SELECT POR TIPOLOGIAS	
SELECT TIP.nom_tipologia,COUNT(PROY.id_proyecto) FROM tipologia AS TIP
	JOIN proyecto AS PROY ON PROY.id_tipologia = TIP.id_tipologia
	GROUP BY TIP.id_tipologia;
	
-- SELECT 
seguimiento_fisico

SELECT FN.id_financiamiento FROM FINANCIAMIENTO AS FN WHERE FN.id_etapa_proyecto = 1;
select id_financiamiento from financiamiento order by id_financiamiento;


SELECT SEGFIN.monto FROM financiamiento AS FIN 
  JOIN seguimiento_financiero AS SEGFIN ON SEGFIN.id_financiamiento = FIN.id_financiamiento
  WHERE FIN.id_financiamiento IN(1,2) ORDER BY SEGFIN.id_seguimiento_financiero DESC LIMIT 2;

SELECT LNE.descripcion ,COUNT(PROY.id_proyecto) FROM linea_estrategica AS LNE
	LEFT JOIN linea_de_accion AS LNA ON LNA.id_linea_estrategica = LNE.id_linea_estrategica
	LEFT JOIN accion_estrategica AS ACCE ON ACCE.id_linea_accion = LNA.id_linea_accion
	LEFT JOIN proyecto AS PROY ON PROY.id_accion_estrategica = ACCE.id_accion_estrategica
	GROUP BY LNE.id_linea_estrategica ORDER BY LNE.id_linea_estrategica ASC;
	
SELECT CAT.nom_categoria,COUNT(PROY.id_proyecto) AS total FROM categoria AS CAT
	LEFT JOIN proyecto AS PROY ON PROY.id_categoria = CAT.id_categoria
	GROUP BY CAT.id_categoria ORDER BY CAT.id_categoria ASC;
	
SELECT TIP.nom_tipologia,COUNT(PROY.id_proyecto) AS total FROM tipologia AS TIP
	LEFT JOIN proyecto AS PROY ON PROY.id_tipologia = TIP.id_tipologia
	GROUP BY TIP.id_tipologia ORDER BY TIP.id_tipologia ASC;


-- SELECT REPORTES POR INDICADORES/ETAPAS
-- 
SELECT IND.id_indicador,nombre_indicador,ETA.nombre_etapa, COUNT(ETAP.id_etapa)FROM indicador AS IND
	JOIN proyecto AS PROY ON PROY.id_indicador = IND.id_indicador
	JOIN etapa_proyecto AS ETAP ON ETAP.id_proyecto = PROY.id_proyecto
	JOIN etapa AS ETA ON ETA.id_etapa = ETAP.id_etapa
	WHERE (ETA.peso_etapa = 50 OR ETA.peso_etapa = 40 OR ETA.peso_etapa =70);
	GROUP BY ETA.id_etapa ORDER BY ETA.id_etapa;
-- SELECT REPORTES POR LINEA ESTRATEGICA POR MONTOS DE PROYECTOS

SELECT MUN.nombre_municipio,YEAR(ETAP.fecha_seguimiento) AS year,SUM(FIN.costo_final)  FROM municipio AS MUN 
	LEFT JOIN ciudad_o_comunidad AS COC ON COC.id_municipio = MUN.id_municipio
	LEFT JOIN proyecto_ciudad_o_comunidad AS PCOC ON PCOC.id_ciudad_comunidad = COC.id
	LEFT JOIN proyecto AS PROY ON PROY.id_proyecto = PCOC.id_proyecto
	LEFT JOIN etapa_proyecto AS ETAP ON ETAP.id_proyecto = PROY.id_proyecto
	LEFT JOIN financiamiento AS FIN ON FIN.id_etapa_proyecto = ETAP.id_etapa_proyecto
	WHERE YEAR(ETAP.fecha_seguimiento) = 2023
	GROUP BY MUN.id_municipio;
	
