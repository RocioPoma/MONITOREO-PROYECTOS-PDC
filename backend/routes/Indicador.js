const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

// Ruta para obtener lista indicadores
router.get('/get', (req, res) => {
  connection.query('select * from indicador i, unidad_medicion um where i.id_unidad_medicion=um.id_unidad_medicion;', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Hubo un error al obtener los INDICADORES' });
    } else {
      res.json(results);
    }
  });
});

// Ruta para editar un indicador
router.put('/update/:id', (req, res) => {
  const id = req.params.id;
  const { nombre_indicador, desc_indicador } = req.body;
  connection.query('UPDATE INDICADOR SET nombre_indicador = ?, desc_indicador = ? WHERE id_indicador = ?', [nombre_indicador, desc_indicador, id], (error, results) => {
    if (error) throw error;
    res.json({ message: 'Indicador actualizado exitosamente' });
  });
});

// Ruta para habilitar o deshabilitar un indicador
router.patch('/updateStatus', (req, res) => {
  let indicador = req.body;
  var query = "update indicador set estado=? where id_indicador=?";
  connection.query(query, [indicador.estado, indicador.id_indicador], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "El indicador no existe" });
      }
      return res.status(200).json({ message: "Actualización Estado de indicador con éxito" });
    }
    else {
      return res.status(500).json(err);
    }
  })
})

module.exports = router;