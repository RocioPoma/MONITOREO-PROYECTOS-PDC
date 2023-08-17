const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');


router.get('/get', (req, res) => {
    const sql = 'SELECT * FROM ENTIDAD_FINANCIERA';
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  
  router.get('/buscar/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM ENTIDAD_FINANCIERA WHERE id_entidad_finan = ?';
    connection.query(sql, id, (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    });
  });
  
  router.post('/create', (req, res) => {
    const { nom_entidad_finan, desc_entidad_finan, estado } = req.body;
    const sql = 'INSERT INTO ENTIDAD_FINANCIERA (nom_entidad_finan, desc_entidad_finan, estado) VALUES (?, ?, ?)';
    connection.query(sql, [nom_entidad_finan, desc_entidad_finan, estado], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: 'Entidad financiera creada correctamente' });
    });
  });
  
  router.put('/update/', (req, res) => {   
    const { nom_entidad_finan, desc_entidad_finan, estado,id_entidad_finan } = req.body;
    const sql = 'UPDATE ENTIDAD_FINANCIERA SET nom_entidad_finan = ?, desc_entidad_finan = ?, estado = ? WHERE id_entidad_finan = ?';
    connection.query(sql, [nom_entidad_finan, desc_entidad_finan, estado, id_entidad_finan], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Entidad financiera actualizada correctamente' });
    });
  });
  
  
  router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM ENTIDAD_FINANCIERA WHERE id_entidad_finan = ?';
    connection.query(sql, id, (err, result) => {
      if (err) throw err;
      res.json({ message: 'Entidad financiera eliminada correctamente' });
    });
  });
  

  //status entidad financiera
router.patch('/updateStatus',(req,res)=>{
  let user =req.body;
  console.log(user);
  var query = "update entidad_financiera set estado=? where id_entidad_finan=?";
  connection.query(query,[user.estado,user.id_entidad_finan],(err,results)=>{
      if(!err){
          if(results.affectedRows == 0){
              return res.status(404).json({message:"La entidad no existe"});
          }
          return res.status(200).json({message:"Actualización Estado de estado fue un éxito"});
      }
      else{
          return res.status(500).json(err);
      }
  })
  });
  

module.exports = router;