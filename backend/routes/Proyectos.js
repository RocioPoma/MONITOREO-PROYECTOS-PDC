const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//----------para archivos-----------------------------------------------------------------------------
const multer = require('../libs/multer');
const fs = require('fs');
//-----------------------------------------------------------------------------------------------------


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
    + 'P.nom_proyecto AS NombreProyecto, '
    + 'P.fecha_inicio AS FechaInicio, '
    + 'P.fecha_fin AS FechaFin, '
    + 'M.nombre_municipio AS NombreMunicipio, '
    + 'M.id_municipio,'
    + 'C.nom_cuenca AS NombreCuenca, '
    + 'CAT.nom_categoria AS NombreCategoria, '
    + 'TIP.nom_tipologia AS NombreTipologia, '
    + 'CC.id, '
    + 'CC.nombre, '
    + 'PCOC.id_ciudad_comunidad '
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

  //console.log(proyecto.id_ciudad_comunidad);
  //llamarId(proyecto.id_ciudad_comunidad);

});

router.post('/add', multer.single('documento'), (req, res) => {
  const file = req.file;
  let proyecto = req.body;
  let datos = {};
  if (!file) {
    datos = {
      nom_proyecto: proyecto.nom_proyecto,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      fecha_registro: proyecto.fecha_registro,
      area: proyecto.area,
      coordenada_x: proyecto.coordenada_x,
      coordenada_y: proyecto.coordenada_y,
      cantidad: proyecto.cantidad,
      hombres: proyecto.hombres,
      mujeres: proyecto.mujeres,
      id_categoria: proyecto.id_categoria,
      id_tipologia: proyecto.id_tipologia,
      id_indicador: proyecto.id_indicador,
      id_cuenca: proyecto.id_cuenca,
      id_accion_estrategica: proyecto.id_accion_estrategica,
      estado: proyecto.estado,
      documento:''
  
    }
  }else{
    datos = {
      nom_proyecto: proyecto.nom_proyecto,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      fecha_registro: proyecto.fecha_registro,
      area: proyecto.area,
      coordenada_x: proyecto.coordenada_x,
      coordenada_y: proyecto.coordenada_y,
      cantidad: proyecto.cantidad,
      hombres: proyecto.hombres,
      mujeres: proyecto.mujeres,
      id_categoria: proyecto.id_categoria,
      id_tipologia: proyecto.id_tipologia,
      id_indicador: proyecto.id_indicador,
      id_cuenca: proyecto.id_cuenca,
      id_accion_estrategica: proyecto.id_accion_estrategica,
      estado: proyecto.estado,
      documento:req.file.filename
  
    }
  }
  
  console.log(datos);
  connection.query('INSERT INTO PROYECTO  SET ?', [datos], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Proyecto agregado con exito" });
    }
    else {
      return res.status(500).json(err);
    }
  });

  console.log(proyecto.id_ciudad_comunidad);
  llamarUltimoRegistroProyecto(proyecto.id_ciudad_comunidad, proyecto.id_unidad_medicion, proyecto.cantidad);

});

function llamarUltimoRegistroProyecto(id_comunidad, id_unidad, cantidad) {
  let id_proyecto;
  connection.query('select id_proyecto from proyecto order by id_proyecto desc limit 1', (err, rows) => {
    //console.log(rows[0].id_proyecto);
    id_proyecto = rows[0].id_proyecto;
    add_proyecto_comunidad(id_proyecto, id_comunidad);
    add_proyecto_unidad(id_proyecto, id_unidad, cantidad)

  });
}

function add_proyecto_comunidad(id_proyecto, id_comunidad) {
  datos = {
    id_proyecto: id_proyecto,
    id_ciudad_comunidad: id_comunidad
  }
  connection.query('insert into proyecto_ciudad_o_comunidad set ?', [datos], (err, results) => {
    // console.log('Agregado.!!!')
  });
}

function add_proyecto_unidad(id_proyecto, id_unidad, cantidad) {
  datos = {
    cantidad: cantidad,
    id_unidad_medicion: id_unidad,
    id_proyecto: id_proyecto
  }
  //console.log(datos);
  connection.query('insert into alcance set ?', [datos], (err, results) => {
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
  eliminarProyectoComunidad(req.params.id);
  const sql = 'DELETE FROM PROYECTO WHERE id_proyecto = ?';
  connection.query(sql, id, (err, result) => {
    if (err) throw err;
    res.json({ message: 'Proyecto eliminado correctamente' });
  });
});

//----------------------------------------------/otra forma de borrar
// Agrega esta nueva ruta para eliminar un proyecto por su ID
router.delete('/dele/:id_proyecto', (req, res) => {
  const id_proyecto = req.params.id_proyecto;

  // Primero, eliminamos los registros en la tabla "proyecto_ciudad_o_comunidad"
  connection.query('DELETE FROM proyecto_ciudad_o_comunidad WHERE id_proyecto = ?', [id_proyecto], (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }

    // A continuación, eliminamos los registros en la tabla "alcance"
    connection.query('DELETE FROM alcance WHERE id_proyecto = ?', [id_proyecto], (err, results) => {
      if (err) {
        return res.status(500).json(err);
      }

      // Finalmente, eliminamos el proyecto de la tabla "PROYECTO"
      connection.query('DELETE FROM PROYECTO WHERE id_proyecto = ?', [id_proyecto], (err, results) => {
        if (err) {
          return res.status(500).json(err);
        }

        return res.status(200).json({ message: "Proyecto eliminado con éxito" });
      });
    });
  });
});
//----------------------------------------------/otra forma de borrar


//funcion
function eliminarProyectoComunidad(id) {
  const sql = 'DELETE FROM proyecto_ciudad_o_comunidad WHERE id_proyecto = ?';
  connection.query(sql, id, (err, result) => {
    console.log(result);
  });
}


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