const express = require('express');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');

//Listar ciudad_comunidad
router.get('/get', (req, res) => {
    connection.query('select cc.*, m.nombre_municipio from ciudad_o_comunidad cc join municipio m on cc.id_municipio = m.id_municipio; ', 
    (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Hubo un error al obtener CIUDAD_O_COMUNIDAD' });
        } else {
            res.json(results);
        }
    });
});

//obtener ciudad_comunidad por id de municipio
router.get('/getByIdMunicipio/:id_municipio',(req,res)=>{
    const id_municipio = req.params.id_municipio;
    var query = 'SELECT CC.* FROM CIUDAD_O_COMUNIDAD AS CC WHERE id_municipio=?';
    connection.query(query,[id_municipio],(err,results)=>{
        if(err){
            console.error(err);
            res.status(500).json({message: 'Hubo un error al obtener Ciudad/comunidad por id de municipio'})
        }else{
            res.json(results);
        }
    });
})

//crear ciudad_comunidad
router.post('/create', (req, res) => {
    const { nombre, id_municipio} = req.body;
    console.log(req.body);
    connection.query('INSERT INTO CIUDAD_O_COMUNIDAD (nombre, id_municipio) VALUES ( ?, ?)', [ nombre, id_municipio], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al crear la comunidad ' });
      } else {
        res.json({ message: 'Comunidad fue creada correctamente' });
      }
    });
  });

//modificar ciudad_comunidad
router.put('/update/', (req, res) => {   
    const {  nombre, id_municipio} = req.body;
    connection.query('UPDATE CIUDAD_O_COMUNIDAD SET nombre = ?, id_municipio = ? WHERE id = ?', [nombre, id_municipio], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al actualizar la ciudad ' });
      } else {
        res.json({ message: 'Ciudad actualizada correctamente' });
      }
    });
  });
  
//borrar ciudad_comunidad
router.delete('/delete/:id', (req, res) =>{
    const { id } = req.params;
    console.log(id);
    connection.query('DELETE FROM CIUDAD_O_COMUNIDAD WHERE id=?', [id], (err) =>{
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Hubo un error al eliminar la comunidad' });
        } 
        else {
            res.json({ message: 'Comunidad eliminada correctamente' });
        }
    });
});

//status ciudad_comunidad
router.patch('/updateStatus', (req, res) => {
    let comunidad = req.body;
    console.log(comunidad);
    var query = "UPDATE CIUDAD_O_COMUNIDAD SET ESTADO=? WHERE id=?";
    connection.query(query, [comunidad.estado, comunidad.id], (err, results) => {
        if(!err) {
            if(results.affectedRows == 0){
                return res.status(404).json({ message: "La comunidad no existe" });
            }
            return res.status(200).json({ message: "Actualización de estado con éxito" });
        }
        else {
            return res.status(500).json(err);
        }
    })
})

module.exports = router;
