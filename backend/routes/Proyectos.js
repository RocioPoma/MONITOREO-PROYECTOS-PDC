const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

// Ruta para obtener todos los proyectos
router.get('/get', (req, res) => {
  const sql =
    'SELECT '
    + 'P.id_proyecto,'
    + 'P.nom_proyecto, '
    + 'P.fecha_inicio, '
    + 'P.fecha_fin, '    
    + 'P.fecha_registro, '    
    + 'P.area, '
    + 'P.coordenada_x, '
    + 'P.coordenada_y, '
    + 'P.id_categoria, '
    + 'P.id_tipologia, '
    + 'P.id_indicador, '
    + 'P.id_cuenca, '
    + 'P.estado, '
    + 'P.cantidad, '
    + 'P.hombres, '
    + 'P.mujeres, '
    + 'P.id_accion_estrategica, '
    + 'P.nom_proyecto AS NombreProyecto, '
    + 'P.fecha_inicio AS FechaInicio, '
    + 'P.fecha_fin AS FechaFin, '
    + 'M.nombre_municipio AS NombreMunicipio, '
    + 'C.nom_cuenca AS NombreCuenca, '
    + 'CAT.nom_categoria AS NombreCategoria, '
    + 'TIP.nom_tipologia AS NombreTipologia '
    + 'FROM '
    + ' PROYECTO AS P '
    + 'JOIN '
    + 'PROYECTO_CIUDAD_O_COMUNIDAD AS PCOC ON P.id_proyecto = PCOC.id_proyecto '
    + 'JOIN '
    + 'CIUDAD_O_COMUNIDAD AS CC ON PCOC.id_ciudad_comunidad = CC.id '
    + 'JOIN '
    + 'MUNICIPIO AS M ON CC.id_municipio = M.id_municipio '
    + 'JOIN '
    + 'CUENCA AS C ON P.id_cuenca = C.id_cuenca '
    + 'JOIN '
    + 'CATEGORIA AS CAT ON P.id_categoria = CAT.id_categoria '
    + 'JOIN '
    + 'TIPOLOGIA AS TIP ON P.id_tipologia = TIP.id_tipologia ';
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

//// Ruta para obtener un proyecto por su ID
router.get('/ultimoRegistro/', (req, res) => {
  const sql = 'select id_proyecto from proyecto order by id_proyecto desc limit 1 ';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

// Ruta para crear un nuevo proyecto
router.post('/create', (req, res) => {
  let proyecto = req.body;
  const { nom_proyecto, fecha_inicio, fecha_fin, fecha_registro, area, coordenada_x, coordenada_y, cantidad, hombres, mujeres, id_categoria, id_tipologia, id_indicador, id_cuenca, id_accion_estrategica, estado } = req.body;
  const sql = 'INSERT INTO PROYECTO (nom_proyecto, fecha_inicio, fecha_fin, fecha_registro,area, coordenada_x, coordenada_y, cantidad,hombres,mujeres,id_categoria, id_tipologia, id_indicador, id_cuenca, id_accion_estrategica, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)';
  connection.query(sql, [nom_proyecto, fecha_inicio, fecha_fin, fecha_registro, area, coordenada_x, coordenada_y, cantidad, hombres, mujeres, id_categoria, id_tipologia, id_indicador, id_cuenca, id_accion_estrategica, estado], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Proyecto creado correctamente' });
  });

  console.log(proyecto.id_comunidad);
  llamarId(proyecto.id_comunidad);

});

function llamarId(id_comunidad) {
  let id_proyecto;
  connection.query('select id_proyecto from proyecto order by id_proyecto desc limit 1', (err, rows) => {
    //console.log(rows[0].id_proyecto);
    id_proyecto = rows[0].id_proyecto;
    proyecto_comunidad(id_proyecto, id_comunidad);

  });
}

function proyecto_comunidad(id_proyecto, id_comunidad) {
  datos = {
    id_proyecto: id_proyecto,
    id_ciudad_comunidad: id_comunidad
  }
  //console.log(datos);
  connection.query('insert into proyecto_ciudad_o_comunidad set ?', [datos], (err, results) => {
   // console.log('Agregado.!!!')
  });

}


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

//----------------OTROS SERVICIOS--------------------
//ruta para obtener tipología
router.get('/get_tipologia', (req, res) => {
  const sql = 'SELECT * FROM TIPOLOGIA';
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});



module.exports = router;