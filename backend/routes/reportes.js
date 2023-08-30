const express = require('express');
const connection = require('../connection');
const router = express.Router();

router.get('/lineas-estrategicas',(req,res)=>{

    const query=`SELECT LNE.descripcion,COUNT(PROY.id_proyecto) AS total FROM linea_estrategica AS LNE
	JOIN linea_de_accion AS LNA ON LNA.id_linea_estrategica = LNE.id_linea_estrategica
	JOIN accion_estrategica AS ACCE ON ACCE.id_linea_accion = LNA.id_linea_accion
	JOIN proyecto AS PROY ON PROY.id_accion_estrategica = ACCE.id_accion_estrategica
	GROUP BY LNE.id_linea_estrategica;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes lineas estrategias',err});
        res.json(result)
    })
});
router.get('/categorias',(req,res)=>{

    const query=`SELECT CAT.nom_categoria,COUNT(PROY.id_proyecto) AS total FROM categoria AS CAT
	JOIN proyecto AS PROY ON PROY.id_categoria = CAT.id_categoria
	GROUP BY CAT.id_categoria;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes categorias',err});
        res.json(result)
    })
});
router.get('/tipologias',(req,res)=>{

    const query=`SELECT TIP.nom_tipologia,COUNT(PROY.id_proyecto) AS total FROM tipologia AS TIP
	JOIN proyecto AS PROY ON PROY.id_tipologia = TIP.id_tipologia
	GROUP BY TIP.id_tipologia;`;
    connection.query(query,(err,result)=>{
        if(err) res.status(500).json({msg:'error al consultar reportes tipologias',err});
        res.json(result)
    })
});
module.exports=router;