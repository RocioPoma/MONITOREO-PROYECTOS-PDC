const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//Listar entidad
router.get('/get', (req, res) => {
    connection.query('SELECT * FROM entidad', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener las entidades' });
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
  module.exports = router;