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
  
  router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nom_entidad_finan, desc_entidad_finan, estado } = req.body;
    const sql = 'UPDATE ENTIDAD_FINANCIERA SET nom_entidad_finan = ?, desc_entidad_finan = ?, estado = ? WHERE id_entidad_finan = ?';
    connection.query(sql, [nom_entidad_finan, desc_entidad_finan, estado, id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Entidad financiera actualizada correctamente' });
    });
  });
  
  router.put('/habilitar/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const sql = 'UPDATE ENTIDAD_FINANCIERA SET estado = ? WHERE id_entidad_finan = ?';
    connection.query(sql, [estado, id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Estado de entidad financiera actualizado correctamente' });
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
  

module.exports = router;