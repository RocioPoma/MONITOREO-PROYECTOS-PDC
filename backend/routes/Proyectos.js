const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

// Ruta para obtener todos los proyectos
router.get('/get', (req, res) => {
    const sql = 
    'SELECT '
        +'P.nom_proyecto AS NombreProyecto, '
        +'P.fecha_inicio AS FechaInicio, '
        +'P.fecha_fin AS FechaFin, '
        +'M.nombre_municipio AS NombreMunicipio, '
        +'C.nom_cuenca AS NombreCuenca, '
        +'CAT.nom_categoria AS NombreCategoria, '
        +'TIP.nom_tipologia AS NombreTipologia '
    +'FROM '
       +' PROYECTO AS P '
    +'JOIN '
        +'PROYECTO_CIUDAD_O_COMUNIDAD AS PCOC ON P.id_proyecto = PCOC.id_proyecto '
    +'JOIN '
        +'CIUDAD_O_COMUNIDAD AS CC ON PCOC.id_ciudad_comunidad = CC.id '
    +'JOIN '
        +'MUNICIPIO AS M ON CC.id_municipio = M.id_municipio '
    +'JOIN '
        +'CUENCA AS C ON P.id_cuenca = C.id_cuenca '
    +'JOIN '
        +'CATEGORIA AS CAT ON P.id_categoria = CAT.id_categoria '
    +'JOIN '
        +'TIPOLOGIA AS TIP ON P.id_tipologia = TIP.id_tipologia ';
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });
  
  // Ruta para obtener un proyecto por su ID
  router.get('/buscar/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM PROYECTO WHERE id_proyecto = ?';
    connection.query(sql, id, (err, result) => {
      if (err) throw err;
      res.json(result[0]);
    });
  });
  
  // Ruta para crear un nuevo proyecto
  router.post('/create', (req, res) => {
    const { nom_proyecto, fecha_inicio, fecha_fin, area, coordenada_x, coordenada_y, id_categoria, id_tipologia, id_indicador, id_acciones_estrategicas, estado,fecha_registro ,id_cuenca} = req.body;
    const sql = 'INSERT INTO PROYECTO (nom_proyecto, fecha_inicio, fecha_fin, area, coordenada_x, coordenada_y, id_categoria, id_tipologia, id_indicador, id_accion_estrategica, estado,fecha_registro,id_cuenca) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [nom_proyecto, fecha_inicio, fecha_fin, area, coordenada_x, coordenada_y, id_categoria, id_tipologia, id_indicador, id_acciones_estrategicas, estado,fecha_registro,id_cuenca], (err, result) => {
      if (err) throw err;
      res.status(201).json({ message: 'Proyecto creado correctamente' });
    });
  });
  
  // Ruta para actualizar un proyecto
  router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nom_proyecto, fecha_inicio, fecha_fin, area, coordenada_x, coordenada_y, CATEGORIA_id_categoria, TIPOLOGIA_id_tipologia, INDICADOR_id_indicador, ACCIONES_ESTRATEGICAS_id_acciones_estrategicas, estado } = req.body;
    const sql = 'UPDATE PROYECTO SET nom_proyecto = ?, fecha_inicio = ?, fecha_fin = ?, area = ?, coordenada_x = ?, coordenada_y = ?, CATEGORIA_id_categoria = ?, TIPOLOGIA_id_tipologia = ?, INDICADOR_id_indicador = ?, ACCIONES_ESTRATEGICAS_id_acciones_estrategicas = ?, estado = ? WHERE id_proyecto = ?';
    connection.query(sql, [nom_proyecto, fecha_inicio, fecha_fin, area, coordenada_x, coordenada_y, CATEGORIA_id_categoria, TIPOLOGIA_id_tipologia, INDICADOR_id_indicador, ACCIONES_ESTRATEGICAS_id_acciones_estrategicas, estado, id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Proyecto actualizado correctamente' });
    });
  });
  
  // Ruta para habilitar o deshabilitar un proyecto
  router.patch('/activar/:id', (req, res) => {
    const { id } = req.params;
    const { estado } = req.body;
    const sql = 'UPDATE PROYECTO SET estado = ? WHERE id_proyecto = ?';
    connection.query(sql, [estado, id], (err, result) => {
      if (err) throw err;
      res.json({ message: 'Estado del proyecto actualizado correctamente' });
    });
  });
  
  // Ruta para eliminar un proyecto
  router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM PROYECTO WHERE id_proyecto = ?';
    connection.query(sql, id, (err, result) => {
      if (err) throw err;
      res.json({ message: 'Proyecto eliminado correctamente' });
    });
  });

module.exports = router;