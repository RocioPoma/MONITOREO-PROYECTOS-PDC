const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//Listar etapa
router.get('/get', (req, res) => {
    connection.query('SELECT E.*, T.nom_tipologia, T.id_tipologia FROM etapa E INNER JOIN tipologia T ON E.id_tipologia = T.id_tipologia;', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener las etapas' });
      } else {
        res.json(results);
      }
    });
  });

  //obtener entidadcon id
  router.get('/entidad/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM entidad WHERE id_entedidad = ?', [id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener el entidad' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: 'Entidad no encontrado' });
        } else {
          res.json(results[0]);
        }
      }
    });
  });



//modificar
router.put('/update/', (req, res) => {   
  const {  nom_etapa, desc_etapa,peso_etapa, estado,id_tipologia, id_etapa} = req.body;
  connection.query('UPDATE etapa SET nom_etapa = ?, desc_etapa = ?, peso_etapa=?, estado = ?,id_tipologia=? WHERE id_etapa = ?', [nom_etapa, desc_etapa, peso_etapa, estado,id_tipologia, id_etapa], (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Hubo un error al actualizar la entidad ' });
    } else {
      res.json({ message: 'Entidad actualizada correctamente' });
    }
  });
});


//status entidad 
router.patch('/updateStatus',(req,res)=>{
let user =req.body;
console.log(user);
var query = "update etapa set estado=? where id_etapa=?";
connection.query(query,[user.estado,user.id_etapa],(err,results)=>{
    if(!err){
        if(results.affectedRows == 0){
            return res.status(404).json({message:"La etapa no existe"});
        }
        return res.status(200).json({message:"Actualización de estado fue un éxito"});
    }
    else{
        return res.status(500).json(err);
    }
})
})





  module.exports = router;