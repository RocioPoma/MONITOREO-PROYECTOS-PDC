const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');


//listar
router.get('/get', (req, res) => {
    connection.query('SELECT * FROM ENTIDAD_EJECUTORA', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener las entidades ejecutoras' });
      } else {
        res.json(results);
      }
    });
  });
//buscar
router.get('/buscar/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM ENTIDAD_EJECUTORA WHERE id_entidad_ejecutora = ?', [id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener la entidad ejecutora' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: 'Entidad ejecutora no encontrada' });
        } else {
          res.json(results[0]);
        }
      }
    });
  });
//crear
router.post('/create', (req, res) => {
    const { id_entidad_ejecutora, nom_entidad_ejecutora, desc_entidad_ejecutora, estado } = req.body;
    console.log(req.body);
    connection.query('INSERT INTO ENTIDAD_EJECUTORA (id_entidad_ejecutora, nom_entidad_ejecutora, desc_entidad_ejecutora, estado) VALUES (?, ?, ?, ?)', [id_entidad_ejecutora, nom_entidad_ejecutora, desc_entidad_ejecutora, estado], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al crear la entidad ejecutora' });
      } else {
        res.json({ id_entidad_ejecutora, nom_entidad_ejecutora, desc_entidad_ejecutora, estado });
      }
    });
  });
//modificar
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nom_entidad_ejecutora, desc_entidad_ejecutora, estado } = req.body;
    connection.query('UPDATE ENTIDAD_EJECUTORA SET nom_entidad_ejecutora = ?, desc_entidad_ejecutora = ?, estado = ? WHERE id_entidad_ejecutora = ?', [nom_entidad_ejecutora, desc_entidad_ejecutora, estado, id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al actualizar la entidad ejecutora' });
      } else {
        res.json({ message: 'Entidad ejecutora actualizada correctamente' });
      }
    });
  });
//eliminar
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM ENTIDAD_EJECUTORA WHERE id_entidad_ejecutora = ?', [id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al eliminar la entidad ejecutora' });
      } else {
        res.json({ message: 'Entidad ejecutora eliminada correctamente' });
      }
    });
  });

module.exports = router;