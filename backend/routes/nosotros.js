const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
const path = require('path');
//----------para archivos-----------------------------------------------------------------------------
multer = require('../libs/multer');
const fs = require('fs');


//Status documentos 
router.get('/listar', (req, res) => {    
    const sql = `  
    SELECT d.*
    FROM nosotros d
   `;
    connection.query(sql, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });

  // Ruta para recibir la solicitud PUT de Angular
router.put('/update', multer.fields([
    { name: 'files1', maxCount: 1 },
    { name: 'files2', maxCount: 1 },
    { name: 'files3', maxCount: 1 },
    { name: 'files4', maxCount: 1 }
  ]), (req, res) => {
    // Accede a los archivos cargados desde Angular
    const files1 = req.files['files1'][0]; // Si estás seguro de que siempre habrá un archivo
    const files2 = req.files['files2'][0];
    const files3 = req.files['files3'][0];
    const files4 = req.files['files4'][0];
  
    // Accede a otros datos del formulario
    const id = req.body.id;
    const descripcion = req.body.descripcion;
    const link_video = req.body.link_video;

    console.log(id,descripcion,link_video);
    console.log(files1.filename);
    console.log(files2.filename);
    console.log(files3.filename);
    console.log(files4.filename);

    const nuevosDatos = {
        descripcion: descripcion,
        link_video: link_video,
        documento_general:files1.filename ,
        manual_usuario: files2.filename,
        manual_desarrollo: files3.filename,
        ieee_830: files4.filename
      };

    const queryDocumento = `
    UPDATE nosotros
    SET ?
    WHERE id = ?
    `;
    connection.query(queryDocumento, [nuevosDatos, id],(err, result) => {
         if (err) {
           res.status(500).json({ msg: "erro al insertar documentos" });
           throw new Error(`error al isertar: ${err}`);
         }
       }
     );    
    // Envía una respuesta al cliente Angular
    res.status(200).send('Datos recibidos y procesados correctamente');
  });


  module.exports = router;