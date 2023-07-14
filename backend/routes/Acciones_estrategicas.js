const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//list 
router.get('/get', (req, res) => {
    connection.query('SELECT * FROM ACCIONES_ESTRATEGICAS', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener los LINEAS_ESTRATEGICAS' });
      } else {
        res.json(results);
      }
    });
  });

//editar
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { descripcion } = req.body;
    connection.query('UPDATE ACCIONES_ESTRATEGICAS SET descripcion = ? WHERE id_acciones_estrategicas = ?', [descripcion, id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al editar la acción estratégica' });
      } else {
        res.json({ message: 'Acción estratégica actualizada correctamente' });
      }
    });
  });
  

//habilitar y deshabilitar
  // Habilitar una acción estratégica por ID
  router.put('/activa/:id', (req, res) => {
    const { id } = req.params;
    connection.query('UPDATE ACCIONES_ESTRATEGICAS SET estado = 1 WHERE id_acciones_estrategicas = ?', [id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al habilitar la acción estratégica' });
      } else {
        res.json({ message: 'Acción estratégica habilitada correctamente' });
      }
    });
  });
  
  // Deshabilitar una acción estratégica por ID
  router.put('/desactiva/:id', (req, res) => {
    const { id } = req.params;
    connection.query('UPDATE ACCIONES_ESTRATEGICAS SET estado = 0 WHERE id_acciones_estrategicas = ?', [id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al deshabilitar la acción estratégica' });
      } else {
        res.json({ message: 'Acción estratégica deshabilitada correctamente' });
      }
    });
  });


module.exports = router;