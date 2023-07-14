const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

// Ruta para editar un indicador
router.put('/indicadores/:id', (req, res) => {
    const id = req.params.id;
    const { nombre_indicador, desc_indicador } = req.body;
    connection.query('UPDATE INDICADOR SET nombre_indicador = ?, desc_indicador = ? WHERE id_indicador = ?', [nombre_indicador, desc_indicador, id], (error, results) => {
      if (error) throw error;
      res.json({ message: 'Indicador actualizado exitosamente' });
    });
  });
  
  // Ruta para habilitar un indicador
  router.put('/indicadores/habilitar/:id', (req, res) => {
    const id = req.params.id;
    connection.query('UPDATE INDICADOR SET estado = 1 WHERE id_indicador = ?', [id], (error, results) => {
      if (error) throw error;
      res.json({ message: 'Indicador habilitado exitosamente' });
    });
  });
  
  // Ruta para deshabilitar un indicador
  router.put('/indicadores/deshabilitar/:id', (req, res) => {
    const id = req.params.id;
    connection.query('UPDATE INDICADOR SET estado = 0 WHERE id_indicador = ?', [id], (error, results) => {
      if (error) throw error;
      res.json({ message: 'Indicador deshabilitado exitosamente' });
    });
  });

module.exports = router;