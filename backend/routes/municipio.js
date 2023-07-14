const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//Listar municipio
router.get('/get', (req, res) => {
    connection.query('SELECT * FROM MUNICIPIO', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener los municipios' });
      } else {
        res.json(results);
      }
    });
  });

  //obtener municipio con id
  router.get('/municipios/:id', (req, res) => {
    const { id } = req.params;
    connection.query('SELECT * FROM MUNICIPIO WHERE id_municipio = ?', [id], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener el municipio' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: 'Municipio no encontrado' });
        } else {
          res.json(results[0]);
        }
      }
    });
  });

  //crear municipio
  router.post('/create', (req, res) => {
    const { nombre_municipio, estado } = req.body;
    connection.query('INSERT INTO MUNICIPIO (nombre_municipio, estado) VALUES (?, ?)', [nombre_municipio, estado], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al crear el municipio' });
      } else {
        res.json({ id: results.insertId, nombre_municipio, estado });
      }
    });
  });

//modificar municipio
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_municipio, estado } = req.body;
    connection.query('UPDATE MUNICIPIO SET nombre_municipio = ?, estado = ? WHERE id_municipio = ?', [nombre_municipio, estado, id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al actualizar el municipio' });
      } else {
        res.json({ message: 'Municipio actualizado correctamente' });
      }
    });
  });

  router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM MUNICIPIO WHERE id_municipio = ?', [id], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al eliminar el municipio' });
      } else {
        res.json({ message: 'Municipio eliminado correctamente' });
      }
    });
  });

module.exports = router;