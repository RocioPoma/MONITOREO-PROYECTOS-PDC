const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//obtener Etapa por id de Tipología
router.get('/getByIdTipologia/:id_tipologia',(req,res)=>{
    const id_tipologia = req.params.id_tipologia;
    var query = 'SELECT * FROM ETAPA  WHERE id_tipologia=?';
    connection.query(query,[id_tipologia],(err,results)=>{
        if(err){
            console.error(err);
            res.status(500).json({message: 'Hubo un error al obtener Etapas por id de tiología'})
        }else{
            res.json(results);
        }
    });
})
router.get('/getFinanciamiento/:id_etapa_proyecto',(req,res)=>{
    const {id_etapa_proyecto} = req.params;
    const query=`SELECT FN.costo_inicial AS monto_inicial,FN.costo_final AS monto_final,FN.id_entidad_financiera FROM FINANCIAMIENTO AS FN WHERE FN.id_etapa_proyecto=?`;
    connection.query(query,[id_etapa_proyecto],(err,result)=>{
        if(err){
            res.status(400).json({msg:'error consulta',err})
        }else{
            res.json(result)
        }
    })
})
router.get('/getEtapaByIdEtapaProyecto',(req,res)=>{
    // console.log(req.query);
    const {id_proyecto,id_etapa} = req.query;
    if(id_proyecto===null || id_etapa===null) res.status(400).json({msg:'se deben enviar id_proyecto e id_etapa'});
    const query=` SELECT ETP.id_etapa_proyecto,ETP.id_etapa,ETP.fecha_seguimiento,ETP.id_proyecto,ETP.id_fuente_de_informacion,ETP.id_entidad_ejecutora FROM ETAPA_PROYECTO AS ETP WHERE ETP.id_proyecto = ? AND ETP.id_etapa = ? order by ETP.id_etapa_proyecto desc limit 1; `;
    connection.query(query,[id_proyecto,id_etapa],(err,result)=>{
        if(err){
            res.status(500).json({msg:'error',err});
        }else{
            res.json(result[0] || null)
        }
    })
})
router.post('/registrarEtapa_Proyecto', (req,res)=>{
    const {id_entidad_ejecutora,id_etapa,id_proyecto,id_fuente_de_informacion,fecha_seguimiento,...resForm} = req.body;
    const query=`INSERT INTO ETAPA_PROYECTO (fecha_seguimiento,id_etapa,id_proyecto,id_fuente_de_informacion,id_entidad_ejecutora) VALUES(?,?,?,?,?);`
    connection.query(query,[fecha_seguimiento,id_etapa,id_proyecto,id_fuente_de_informacion,id_entidad_ejecutora],(err,result)=>{
        if(err){
            res.status(500).json({msg:'Error interno - ETAPA PROYECTO',err})
            throw new Error(err)
        }else{
            let id_etapa_proyecto;
            connection.query(`select id_etapa_proyecto from etapa_proyecto order by id_etapa_proyecto desc limit 1;`,(err,result)=>{
                if(err){throw new Error(err)}
                // console.log(result);
                id_etapa_proyecto = result[0].id_etapa_proyecto;
                addFinaciamiento({...resForm,id_etapa_proyecto,fecha_seguimiento});
                addSeguimientoFisico({...resForm,id_etapa_proyecto,fecha_seguimiento});
                res.json({msg:'ok',result});
            })
        }
    })
})
const addFinaciamiento= (resForm)=>{
    const {financiamiento,seguimiento_financiamiento,id_etapa_proyecto,fecha_seguimiento} = resForm
    
    for(fnItem in financiamiento){
        const {id_entidad_financiera,monto_inicial:costo_inicial,monto_final:costo_final} =financiamiento[fnItem];
        const query=`INSERT INTO FINANCIAMIENTO (costo_inicial,costo_final,id_entidad_financiera,id_etapa_proyecto) VALUES(?,?,?,?);`;
        connection.query(query,[costo_inicial,costo_final,id_entidad_financiera,id_etapa_proyecto],(err,result)=>{
            if(err) throw new Error({msg:'error - financiamiento',err})
            let id_financiamiento;
            connection.query(`select id_financiamiento from financiamiento order by id_financiamiento desc limit 1;`,(err,result)=>{
                if(err){throw new Error(err)}
                id_financiamiento = result[0].id_financiamiento;
                const queryFnSeg=`INSERT INTO SEGUIMIENTO_FINANCIERO (monto,observacion,id_financiamiento,fecha_seguimiento) VALUES(?,?,?,?);`;
                const {monto,observacion} = seguimiento_financiamiento[fnItem];
                connection.query(queryFnSeg,[monto,observacion,id_financiamiento,fecha_seguimiento],(err,result)=>{
                    if(err) throw new Error({msg:'error en seguimiento financiero',err});
                })
            })
        })
    }
}
const addSeguimientoFisico=(segForm)=>{
    const {avance_seguimiento_fisico,observacion_seguimiento_fisico:observacion,id_etapa_proyecto,fecha_seguimiento} = segForm;
    const query=`INSERT INTO SEGUIMIENTO_FISICO (avance_seguimiento_fisico,observacion,id_etapa_proyecto,fecha_seguimiento_fisico) VALUES(?,?,?,?);`;
    connection.query(query,[avance_seguimiento_fisico,observacion,id_etapa_proyecto,fecha_seguimiento],(err,result)=>{
        // console.log(err,result);
        if(err) throw new Error({msg:'error en seguimiento fisico',err})
    })  
}

module.exports = router;