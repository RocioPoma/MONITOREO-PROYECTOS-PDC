const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//Listar ciudad_comunidad
router.get('/get', (req, res) => {
    connection.query('SELECT * FROM CIUDAD_O_COMUNIDAD', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Hubo un error al obtener CIUDAD_O_COMUNIDAD' });
        } else {
            res.json(results);
        }
    });
});

//obtener ciudad_comunidad por id de municipio
router.get('/getByIdMunicipio/:id_municipio',(req,res)=>{
    const id_municipio = req.params.id_municipio;
    var query = 'SELECT CC.* FROM CIUDAD_O_COMUNIDAD AS CC WHERE id_municipio=?';
    connection.query(query,[id_municipio],(err,results)=>{
        if(err){
            console.error(err);
            res.status(500).json({message: 'Hubo un error al obtener Ciudad/comunidad por id de municipio'})
        }else{
            res.json(results);
        }
    });
})

//crear ciudad_comunidad

//modificar ciudad_comunidad

//borrar ciudad_comunidad

//status ciudad_comunidad

module.exports = router;
