const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

// Ruta para obtener todas las categorías
router.get('/get', (req, res) => {
  const sql = 'SELECT * FROM CATEGORIA';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Ruta para obtener una categoría por su ID
router.get('/buscar/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM CATEGORIA WHERE id_categoria = ?';
  connection.query(sql, id, (err, result) => {
    if (err) throw err;
    res.json(result[0]);
  });
});

// Ruta para crear una nueva categoría
router.post('/create', (req, res) => {
  const { nom_categoria, desc_categoria, estado } = req.body;
  const sql = 'INSERT INTO CATEGORIA (nom_categoria, desc_categoria, estado) VALUES (?, ?, ?)';
  connection.query(sql, [nom_categoria, desc_categoria, estado], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Categoría creada correctamente' });
  });
});

// Ruta para actualizar una categoría
router.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { nom_categoria, desc_categoria, estado } = req.body;
  const sql = 'UPDATE CATEGORIA SET nom_categoria = ?, desc_categoria = ?, estado = ? WHERE id_categoria = ?';
  connection.query(sql, [nom_categoria, desc_categoria, estado, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Categoría actualizada correctamente' });
  });
});

// Ruta para habilitar o deshabilitar una categoría
router.patch('/habilitar/:id', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const sql = 'UPDATE CATEGORIA SET estado = ? WHERE id_categoria = ?';
  connection.query(sql, [estado, id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Estado de categoría actualizado correctamente' });
  });
});

// Ruta para eliminar una categoría
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM CATEGORIA WHERE id_categoria = ?';
  connection.query(sql, id, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Categoría eliminada correctamente' });
  });
});

// Exporta el enrutador
module.exports = router;


