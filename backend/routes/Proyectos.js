const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//----------para archivos-----------------------------------------------------------------------------
multer = require('../libs/multer');
const fs = require('fs');
//-----------------------------------------------------------------------------------------------------


// Ruta para obtener todos los proyectos
router.get('/get', (req, res) => {
 // const sql = "SELECT P.id_proyecto,  P.nom_proyecto, fecha_inicio, fecha_fin, DATE_FORMAT(P.fecha_inicio, '%d-%m-%Y') as fecha_inicio_convert,  DATE_FORMAT(P.fecha_fin, '%d-%m-%Y') as fecha_fin_convert,  DATE_FORMAT(P.fecha_registro, '%d-%m-%Y') as fecha_registro,  P.area,  P.coordenada_x,  P.coordenada_y,  P.id_categoria,  P.id_tipologia,  P.id_indicador,  P.id_cuenca,  P.estado,  P.cantidad,  P.hombres,  P.mujeres,  M.nombre_municipio,  M.id_municipio,  C.nom_cuenca AS NombreCuenca,  CAT.nom_categoria AS NombreCategoria,  TIP.nom_tipologia AS NombreTipologia FROM  PROYECTO AS P JOIN PROYECTO_CIUDAD_O_COMUNIDAD AS PCOC ON P.id_proyecto = PCOC.id_proyecto JOIN CIUDAD_O_COMUNIDAD AS CC ON PCOC.id_ciudad_comunidad = CC.id JOIN MUNICIPIO AS M ON CC.id_municipio = M.id_municipio JOIN CUENCA AS C ON P.id_cuenca = C.id_cuenca JOIN CATEGORIA AS CAT ON P.id_categoria = CAT.id_categoria JOIN TIPOLOGIA AS TIP ON P.id_tipologia = TIP.id_tipologia GROUP BY P.id_proyecto;"
  const sql =   "SELECT " +
  "p.*, " +
  "DATE_FORMAT(p.fecha_inicio, '%d-%m-%Y') AS fecha_inicio_convert, " +
  "DATE_FORMAT(p.fecha_fin, '%d-%m-%Y') AS fecha_fin_convert, " +
  "DATE_FORMAT(p.fecha_registro, '%d-%m-%Y') AS fecha_registro_convert, " +
  "t.nom_tipologia, " +
  "c.nom_categoria, " +
  "cu.nom_cuenca, " +
  "mu.id_municipio, " +
  "mu.nombre_municipio, " +
  "le.id_linea_estrategica, " +
  "la.id_linea_accion, " +
  "le.descripcion AS linea_estrategica, " +
  "la.descripcion AS linea_de_accion, " +
  "ae.descripcion AS accion_estrategica, " +
  "i.nombre_indicador, " +
  "GROUP_CONCAT(DISTINCT com.nombre SEPARATOR ', ') AS comunidades, " +
  "alc.cantidad, " +
  "um.nom_unidad AS unidad_medicion_alcance " +
  "FROM proyecto p " +
  "LEFT JOIN tipologia t ON p.id_tipologia = t.id_tipologia " +
  "LEFT JOIN categoria c ON p.id_categoria = c.id_categoria " +
  "LEFT JOIN cuenca cu ON p.id_cuenca = cu.id_cuenca " +
  "LEFT JOIN proyecto_ciudad_o_comunidad pc ON p.id_proyecto = pc.id_proyecto " +
  "LEFT JOIN ciudad_o_comunidad com ON pc.id_ciudad_comunidad = com.id " +
  "LEFT JOIN alcance alc ON p.id_proyecto = alc.id_proyecto " +
  "LEFT JOIN unidad_medicion um ON alc.id_unidad_medicion = um.id_unidad_medicion " +
  "LEFT JOIN accion_estrategica ae ON p.id_accion_estrategica = ae.id_accion_estrategica " +
  "LEFT JOIN linea_de_accion la ON ae.id_linea_accion = la.id_linea_accion " +
  "LEFT JOIN linea_estrategica le ON la.id_linea_estrategica = le.id_linea_estrategica " +
  "LEFT JOIN indicador i ON p.id_indicador = i.id_indicador " +
  "LEFT JOIN municipio mu ON com.id_municipio = mu.id_municipio " +
  "GROUP BY p.id_proyecto;"

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
  let proy = {};
  proy = req.body;

  const ObjetId_ciudad_comunidad = JSON.parse(proyecto.id_ciudad_comunidad) //Datos comunidad en formato JSON, (id, nombre, id_municipio)
  const ObjetAlcance = JSON.parse(proyecto.alcance) //Datos en formato JSON, con campos (cantidad, unidad que equivale a 'id_unidad_medicion')


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
      documento: ''

    }
  } else {
    console.log('Con archivo')
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
      documento: req.file.filename
    }
  }

  console.log(datos);
  console.log(ObjetId_ciudad_comunidad);
  console.log(ObjetAlcance);



  connection.query('INSERT INTO PROYECTO  SET ?', [datos], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Proyecto agregado con exito" });
    }
    else {
      return res.status(500).json(err);
    }
  });

  //console.log(proyecto.id_ciudad_comunidad);
  //ObtenerIdUltimoRegistroProyecto(proyecto.id_ciudad_comunidad, proyecto.id_unidad_medicion, proyecto.cantidad);

  ObtenerIdUltimoRegistroProyecto(ObjetId_ciudad_comunidad, ObjetAlcance, proyecto.id_unidad_medicion, proyecto.cantidad);
});

function ObtenerIdUltimoRegistroProyecto(ObjetId_ciudad_comunidad, ObjetAlcance, id_unidad_medicion, cantidad) {
  let id_proyecto;
  connection.query('select id_proyecto from proyecto order by id_proyecto desc limit 1', (err, rows) => {
    id_proyecto = rows[0].id_proyecto;

    add_proyecto_comunidad(id_proyecto, ObjetId_ciudad_comunidad); //para agregar a la tabla (proyecto_ciudad_o_comunidad)
    add_alcance(id_proyecto, ObjetAlcance, id_unidad_medicion, cantidad); //para agregar a la tabla (alcance) que es  la relacion de las tablas (Proyecto y unidad_medicion)
    //la variable (alcance) es un array de objetos en formato JSON que tiene los atributos (cantidad, unidad)
  });
}

function add_proyecto_comunidad(id_proyecto, ObjetId_ciudad_comunidad) {

  const query = "INSERT INTO proyecto_ciudad_o_comunidad (id_proyecto, id_ciudad_comunidad) VALUES (?, ?)";
  ObjetId_ciudad_comunidad.forEach((proyecto_comunidad) => {
    console.log('id_proyecto: ' + id_proyecto + '  id_ciudad_comunidad: ' + proyecto_comunidad.id);
    connection.query(query, [id_proyecto, proyecto_comunidad.id], (err, results) => {
      if (!err) {
        console.log('Proyecto_ciudad_comunidad inserted successfully: ', proyecto_comunidad.id);
      } else {
        console.error('Error inserting Proyecto_ciudad_comunidad: ', err);
      }
    });
  });
}

function add_alcance(id_proyecto, ObjetAlcance, id_unidad_medicion, cantidad) {
  datos = {
    cantidad: cantidad,
    id_unidad_medicion: id_unidad_medicion,
    id_proyecto: id_proyecto
  }
  //console.log(datos);
  connection.query('INSERT INTO ALCANCE  set ?', [datos], (err, results) => {
    // console.log('Agregado.!!!')
  });

  const query = "INSERT INTO ALCANCE (cantidad, id_unidad_medicion,id_proyecto) VALUES (?, ?,?)";
  ObjetAlcance.forEach((alcance) => {
    //console.log('id_proyecto: ' + id_proyecto + '  id_ciudad_comunidad: ' + proyecto_comunidad.id);
    connection.query(query, [alcance.cantidad, alcance.unidad, id_proyecto], (err, results) => {
      if (!err) {
        console.log('id proyecto: ' + id_proyecto + ' cantidad: ' + alcance.cantidad + ' id_unidad: ' + alcance.unidad);
      } else {
        console.error('Error inserting Proyecto_ciudad_comunidad: ', err);
      }
    });
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