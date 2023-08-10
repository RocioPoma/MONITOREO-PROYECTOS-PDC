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


module.exports = router;