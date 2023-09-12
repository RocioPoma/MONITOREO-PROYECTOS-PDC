
/*const express = require('express');
const connection = require('../connection');
const express = require("express");
const connection = require("../connection");
const router = express.Router();

router.get('/lineas-estrategicas',(req,res)=>{

    const query=`SELECT LNE.descripcion ,COUNT(PROY.id_proyecto) total FROM linea_estrategica AS LNE
router.get("/lineas-estrategicas", (req, res) => {
  const query = `SELECT LNE.descripcion ,COUNT(PROY.id_proyecto) total FROM linea_estrategica AS LNE
	LEFT JOIN linea_de_accion AS LNA ON LNA.id_linea_estrategica = LNE.id_linea_estrategica
	LEFT JOIN accion_estrategica AS ACCE ON ACCE.id_linea_accion = LNA.id_linea_accion
	LEFT JOIN proyecto AS PROY ON PROY.id_accion_estrategica = ACCE.id_accion_estrategica
	GROUP BY LNE.id_linea_estrategica;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes lineas estrategias',err});
        res.json(result)
    })
  connection.query(query, (err, result) => {
    if (err)
      res
        .status(500)
        .json({ msg: "error al consultar reportes lineas estrategias", err });
    res.json(result);
  });
});
router.get('/categorias',(req,res)=>{

    const query=`SELECT CAT.nom_categoria,COUNT(PROY.id_proyecto) AS total FROM categoria AS CAT
router.get("/categorias", (req, res) => {
  const query = `SELECT CAT.nom_categoria,COUNT(PROY.id_proyecto) AS total FROM categoria AS CAT
	LEFT JOIN proyecto AS PROY ON PROY.id_categoria = CAT.id_categoria
	GROUP BY CAT.id_categoria;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes categorias',err});
        res.json(result)
    })
  connection.query(query, (err, result) => {
    if (err)
      res
        .status(500)
        .json({ msg: "error al consultar reportes categorias", err });
    res.json(result);
  });
});
router.get('/tipologias',(req,res)=>{

    const query=`SELECT TIP.nom_tipologia,COUNT(PROY.id_proyecto) AS total FROM tipologia AS TIP
router.get("/tipologias", (req, res) => {
  const query = `SELECT TIP.nom_tipologia,COUNT(PROY.id_proyecto) AS total FROM tipologia AS TIP
	LEFT JOIN proyecto AS PROY ON PROY.id_tipologia = TIP.id_tipologia
	GROUP BY TIP.id_tipologia;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes tipologias',err});
        res.json(result)
    })
  connection.query(query, (err, result) => {
    if (err)
      res
        .status(500)
        .json({ msg: "error al consultar reportes tipologias", err });
    res.json(result);
  });
});

router.get('/pdc_etapa',(req,res)=>{

    const query=`SELECT
router.get("/pdc_etapa", (req, res) => {
  const query = `SELECT
    I.id_indicador,
    I.nombre_indicador,
    COUNT(DISTINCT P.id_proyecto) AS cantidad_proyectos,
@@ -89,9 +94,113 @@ GROUP BY
ORDER BY
    I.id_indicador;
`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes pdc',err});
        res.json(result)
    })
  connection.query(query, (err, result) => {
    if (err)
      res.status(500).json({ msg: "error al consultar reportes pdc", err });
    res.json(result);
  });
});
//* REPORTES DE INDICADORES
const onlySelect = (query = "") => {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};
const selectParams = (query = "", params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};
router.get("/indicadores", async (req, res) => {
  const query = `
          SELECT IND.id_indicador,IND.nombre_indicador,UND.nom_unidad,
          total_base(UND.nom_unidad, LNBC.cantidad, LNB.cantidad_glb_identificada) AS LB_2020,
          met.cobertura_meta,
          COUNT(PROY.id_proyecto) AS 'Acciones',ndc.nom_meta_ndc,pdes.nom_indicador_pdes,pprh.nom_indicador_pprh 
          FROM indicador AS IND
              INNER JOIN unidad_medicion AS UND ON IND.id_unidad_medicion = UND.id_unidad_medicion
              LEFT JOIN ndc ON ndc.id_ndc = IND.id_ndc
              LEFT JOIN pdes ON pdes.id_pdes = IND.id_pdes
              LEFT JOIN pprh ON pprh.id_pprh = IND.id_pprh
              LEFT JOIN linea_base_cobertura AS LNBC ON LNBC.id_indicador = IND.id_indicador
              LEFT JOIN linea_base AS LNB ON LNB.id_linea_base = LNBC.id_linea_base
              LEFT JOIN metas AS met ON met.id_indicador = IND.id_indicador
              LEFT JOIN proyecto AS PROY ON PROY.id_indicador = IND.id_indicador
              LEFT JOIN etapa_proyecto AS ETAP ON ETAP.id_proyecto = PROY.id_proyecto
              LEFT JOIN etapa AS ETA ON ETA.id_etapa = ETAP.id_etapa
              GROUP BY IND.id_indicador;
          `;
  const queryInd = `
    SELECT PROY.id_proyecto,PROY.nom_proyecto,ETA.id_etapa,ETA.nombre_etapa,SEGF.avance_seguimiento_fisico FROM indicador AS IND
    INNER JOIN proyecto AS PROY ON PROY.id_indicador = IND.id_indicador
    LEFT JOIN etapa_proyecto AS ETAP ON ETAP.id_proyecto = PROY.id_proyecto
    LEFT JOIN etapa AS ETA ON ETA.id_etapa = ETAP.id_etapa
    LEFT JOIN seguimiento_fisico AS SEGF ON SEGF.id_etapa_proyecto = ETAP.id_etapa_proyecto
    WHERE IND.id_indicador = ?;`;
  try {
    const reportes = [];
    const result = await onlySelect(query);
    for (const report_result of result) {
      const report = {
        nombre_indicador: report_result?.nombre_indicador || "",
        uni_ind: report_result?.nom_unidad || "",
        LB_2020: report_result?.LB_2020 || 0,
        Meta_2025: report_result?.cobertura_meta || 0,
        "%_ind_efectivo": 0,
        "#Acciones": report_result?.Acciones || 0,
        NDC: report_result?.nom_meta_ndc || "",
        PDES: report_result?.nom_indicador_pdes || "",
        PPRH: report_result?.nom_indicador_pprh || "",
      };
      const result2 = await selectParams(queryInd, [
        report_result.id_indicador,
      ]);
      if (result2.length > 0) {
        const data = [];
        for (const {id_proyecto,nom_proyecto,id_etapa,nombre_etapa,avance_seguimiento_fisico,} of result2) {
          //reportes.push({id_proyecto,nom_proyecto,id_etapa,nombre_etapa,avance_seguimiento_fisico,})
            if (data.length === 0)
            data.push({id_proyecto,nom_proyecto,etapas: [{id_etapa,nombre_etapa,avance_etapa: avance_seguimiento_fisico,},],
            });
          else {
            const row = data.find((val) => val.id_proyecto === id_proyecto);
            if (row) {
                console.log(report_result.id_indicador);
              if (typeof id_etapa === "number") {
                const etapa = row.etapas.find(
                  (val) => val.id_etapa === id_etapa
                );
                console.log(etapa);
                if (etapa) {
                    console.log(etapa);
                  row.avance_seguimiento_fisico =
                    avance_seguimiento_fisico > row.avance_seguimiento_fisico
                      ? avance_seguimiento_fisico
                      : row.avance_seguimiento_fisico;
                } else {
                  row.etapas.push({id_etapa,nombre_etapa,avance_etapa: avance_seguimiento_fisico,});
                }
              }
            } else {
              data.push({id_proyecto,nom_proyecto,etapas: [{id_etapa,nombre_etapa,avance_etapa: avance_seguimiento_fisico,},
                ],
              });
            }
          }
        }report.data=data;
      }
      reportes.push(report);
    }
    //* RESPUESTA
    res.json(reportes);
  } catch (error) {
    res.status(500).json({ error, msg: "error al obtener datos" });
  }
});
*/
//module.exports = router;
