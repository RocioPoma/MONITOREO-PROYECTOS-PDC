const express = require("express");
const connection = require("../connection");
const router = express.Router();
var auth = require("../services/authentication");

//obtener Etapa por id de Tipología
router.get("/getByIdTipologia/:id_tipologia", (req, res) => {
  const id_tipologia = req.params.id_tipologia;
  var query = "SELECT * FROM ETAPA  WHERE id_tipologia=?";
  connection.query(query, [id_tipologia], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({
        message: "Hubo un error al obtener Etapas por id de tiología",
      });
    } else {
      res.json(results);
    }
  });
});
router.get("/getFinanciamiento/:id_etapa_proyecto", (req, res) => {
  const { id_etapa_proyecto } = req.params;
  const query = `SELECT FN.costo_inicial AS monto_inicial,FN.costo_final AS monto_final,FN.id_entidad_financiera FROM FINANCIAMIENTO AS FN WHERE FN.id_etapa_proyecto=?`;
  connection.query(query, [id_etapa_proyecto], (err, result) => {
    if (err) {
      res.status(400).json({ msg: "error consulta", err });
    } else {
      res.json(result);
    }
  });
});
router.get("/getEtapaByIdEtapaProyecto", (req, res) => {
  // console.log(req.query);
  const { id_proyecto, id_etapa } = req.query;
  if (id_proyecto === null || id_etapa === null)
    res.status(400).json({ msg: "se deben enviar id_proyecto e id_etapa" });
  const query = ` SELECT ETP.id_etapa_proyecto,ETP.id_etapa,ETP.fecha_seguimiento,ETP.id_proyecto,ETP.fuente_de_informacion ,ETP.id_entidad_ejecutora FROM ETAPA_PROYECTO AS ETP WHERE ETP.id_proyecto = ? AND ETP.id_etapa = ? order by ETP.id_etapa_proyecto desc limit 1; `;
  connection.query(query, [id_proyecto, id_etapa], (err, result) => {
    if (err) {
      res.status(500).json({ msg: "error", err });
    } else {
      res.json(result[0] || null);
    }
  });
});


router.get('/getEtapasByIdProyecto/:id_proyecto',(req,res)=>{
  const {id_proyecto} =req.params;
  const query =`SELECT ETP.id_etapa_proyecto,ETP.fuente_de_informacion,
  ETA.nombre_etapa,DATE_FORMAT(ETP.fecha_seguimiento, '%d-%m-%Y') AS fecha_seguimiento,SEGF.avance_seguimiento_fisico FROM ETAPA_PROYECTO AS ETP 
  JOIN ETAPA AS ETA ON ETA.id_etapa = ETP.id_etapa 
  JOIN SEGUIMIENTO_FISICO AS SEGF ON SEGF.id_etapa_proyecto = ETP.id_etapa_proyecto
  WHERE ETP.id_proyecto = ?;`;
  connection.query(query,[id_proyecto],(err,result)=>{
    if(err) res.status(500).json({msg:'error al consultar - etap by idProyecto'});

    avanceEtapas=[];
    for(avance of result){
      if(avanceEtapas.length===0) avanceEtapas.push(avance);
      else{
        const ava = avanceEtapas.find(val=>val.nombre_etapa===avance.nombre_etapa);
        if(ava){
          ava.avance_seguimiento_fisico = 
              avance.avance_seguimiento_fisico>ava.avance_seguimiento_fisico
                ?avance.avance_seguimiento_fisico:ava.avance_seguimiento_fisico;
        }else{
          avanceEtapas.push(avance);
        }
      }
    }
    res.json(avanceEtapas)
  })
})
router.get('/get_seguimientos/:id_etapa_proyecto',(req,res)=>{
  const {id_etapa_proyecto} =req.params;
  const query=`SELECT SEGF.avance_seguimiento_fisico,DATE_FORMAT(SEGF.fecha_seguimiento_fisico, '%d-%m-%Y') AS fecha_seguimiento_fisico 
  FROM SEGUIMIENTO_FISICO AS SEGF WHERE SEGF.id_etapa_proyecto = ? ORDER BY SEGF.avance_seguimiento_fisico DESC `
  connection.query(query,[id_etapa_proyecto],(err,result)=>{
    if(err) res.status(500).json({err,msg:'error al obtener seguiminetos fisicos'});
    res.json(result);
  })
})

router.post("/registrarEtapa_Proyecto", (req, res) => {
  const {
    id_entidad_ejecutora,
    id_etapa,
    id_proyecto,
    fuente_de_informacion,
    fecha_seguimiento,
    ...resForm
  } = req.body;
  const query = `INSERT INTO ETAPA_PROYECTO (fecha_seguimiento,id_etapa,id_proyecto,fuente_de_informacion,id_entidad_ejecutora) VALUES(?,?,?,?,?);`;
  connection.query(
    query,
    [
      fecha_seguimiento,
      id_etapa,
      id_proyecto,
      fuente_de_informacion,
      id_entidad_ejecutora,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json({ msg: "Error interno - ETAPA PROYECTO", err });
        throw new Error(err);
      } else {
        let id_etapa_proyecto;
        connection.query(
          `select id_etapa_proyecto from etapa_proyecto order by id_etapa_proyecto desc limit 1;`,
          (err, result) => {
            if (err) {
              throw new Error(err);
            }
            // console.log(result);
            id_etapa_proyecto = result[0].id_etapa_proyecto;
            addFinaciamiento({
              ...resForm,
              id_etapa_proyecto,
              fecha_seguimiento,
            });
            addSeguimientoFisico({
              ...resForm,
              id_etapa_proyecto,
              fecha_seguimiento,
            });
            res.json({ msg: "ok", result });
          }
        );
      }
    }
  );
});
const addFinaciamiento = (resForm) => {
  const {
    financiamiento,
    seguimiento_financiamiento,
    id_etapa_proyecto,
    comentario_seguimiento_financiero:comentario,
    fecha_seguimiento,
  } = resForm;

  for (fnItem in financiamiento) {
    const {
      id_entidad_financiera,
      monto_inicial: costo_inicial,
      monto_final: costo_final,
    } = financiamiento[fnItem];
    const query = `INSERT INTO FINANCIAMIENTO (costo_inicial,costo_final,id_entidad_financiera,id_etapa_proyecto) VALUES(?,?,?,?);`;
    connection.query(
      query,
      [costo_inicial, costo_final, id_entidad_financiera, id_etapa_proyecto],
      (err, result) => {
        if (err) throw new Error({ msg: "error - financiamiento", err });
        let id_financiamiento;
        connection.query(
          `select id_financiamiento from financiamiento order by id_financiamiento desc limit 1;`,
          (err, result) => {
            if (err) {
              throw new Error(err);
            }
            id_financiamiento = result[0].id_financiamiento;
            const queryFnSeg = `INSERT INTO SEGUIMIENTO_FINANCIERO (monto,comentario,id_financiamiento,fecha_seguimiento) VALUES(?,?,?,?);`;
            const { monto } = seguimiento_financiamiento[fnItem];
            connection.query(
              queryFnSeg,
              [monto, comentario, id_financiamiento, fecha_seguimiento],
              (err, result) => {
                if (err)
                  throw new Error({
                    msg: "error en seguimiento financiero",
                    err,
                  });
              }
            );
          }
        );
      }
    );
  }
};
const addSeguimientoFisico = (segForm) => {
  const {
    avance_seguimiento_fisico,
    comentario_seguimiento_fisico:comentario,
    id_etapa_proyecto,
    fecha_seguimiento,
  } = segForm;
  const query = `INSERT INTO SEGUIMIENTO_FISICO (avance_seguimiento_fisico,comentario,id_etapa_proyecto,fecha_seguimiento_fisico) VALUES(?,?,?,?);`;
  connection.query(
    query,
    [
      avance_seguimiento_fisico,
      comentario,
      id_etapa_proyecto,
      fecha_seguimiento,
    ],
    (err, result) => {
      // console.log(err,result);
      if (err) throw new Error({ msg: "error en seguimiento fisico", err });
    }
  );
};


router.post('/registrarAvanceSeguimientoProyecto',(req,res)=>{
    const {id_etapa_proyecto,
        avance_seguimiento_fisico,
        fecha_seguimiento,
        comentario_seguimiento_fisico,
        comentario_seguimiento_financiero,
        seguimiento_financiamiento} = req.body;
    const querySegFis=`INSERT INTO SEGUIMIENTO_FISICO (id_etapa_proyecto,avance_seguimiento_fisico,fecha_seguimiento_fisico,comentario) VALUES(?,?,?,?);`
    connection.query(querySegFis,[id_etapa_proyecto,avance_seguimiento_fisico,fecha_seguimiento,comentario_seguimiento_fisico],(err,result)=>{
        if(err) {
            res.status(500).json({msg:'erro al insertar seguimiento - fisico'});
            throw new Error(`error al isertar: ${err}`)
        }
    })
    const queryEtapa=`SELECT FN.id_financiamiento FROM FINANCIAMIENTO AS FN WHERE FN.id_etapa_proyecto = ? limit 1`;
    let id_financiamiento;
    connection.query(queryEtapa,[id_etapa_proyecto],(err,result)=>{
        if(err) 
        res.status(500).json({msg:'erro al en seleccion'});
    id_financiamiento=result[0].id_financiamiento;
    })
    for(fin of seguimiento_financiamiento){
        const querySegFn=`INSERT INTO seguimiento_financiero (id_financiamiento,monto,fecha_seguimiento,comentario) VALUES (?,?,?,?);`
        connection.query(querySegFn,[id_financiamiento,fin.monto,fecha_seguimiento,comentario_seguimiento_financiero],(err,result)=>{
            if(err){
                res.status(500).json({msg:'error al insertar seguimiento'});
                throw new Error(`error: ${err}`)
            }
        })
    }
    res.status(201).json({msg:'insertados exitosamente'});
    
})
module.exports = router;
