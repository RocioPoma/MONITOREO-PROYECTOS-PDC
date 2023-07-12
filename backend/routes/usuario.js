const express = require('express');
const connection = require('../connection');
const router = express.Router();
const jwt = require('jsonwebtoken');
var auth = require('../services/authentication');

// Obtener todos los usuarios
router.get('/list',auth.authenticateToken,(req, res) => {
    connection.query('SELECT * FROM usuario', (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener los usuarios' });
      } else {
        res.json(results);
      }
    });
  });

//obtener usuario sergun ci
router.get('/buscar/:ci',auth.authenticateToken, (req, res) => {
    const { ci } = req.params;
    connection.query('SELECT * FROM USUARIO WHERE ci = ?', [ci], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al obtener el usuario' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
          res.json(results[0]);
        }
      }
    });
  });

//crear usuario
router.post('/create/',auth.authenticateToken, (req, res) => {
    const { ci, nombre, ap_paterno, ap_materno, contraseña, email, telefono, genero, rol, estado, MUNICIPIO_id_municipio } = req.body;
    connection.query('INSERT INTO USUARIO (ci, nombre, ap_paterno, ap_materno, contraseña, email, telefono, genero, rol, estado, MUNICIPIO_id_municipio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [ci, nombre, ap_paterno, ap_materno, contraseña, email, telefono, genero, rol, estado, MUNICIPIO_id_municipio], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al crear el usuario' });
      } else {
        res.json({ ci, nombre, ap_paterno, ap_materno, contraseña, email, telefono, genero, rol, estado, MUNICIPIO_id_municipio });
      }
    });
  });

//actualizar usuario
router.put('/update/:ci', auth.authenticateToken,(req, res) => {
    const { ci } = req.params;
    const { nombre, ap_paterno, ap_materno, contraseña, email, telefono, genero, rol, estado, MUNICIPIO_id_municipio } = req.body;
    connection.query('UPDATE USUARIO SET nombre = ?, ap_paterno = ?, ap_materno = ?, contraseña = ?, email = ?, telefono = ?, genero = ?, rol = ?, estado = ?, MUNICIPIO_id_municipio = ? WHERE ci = ?', [nombre, ap_paterno, ap_materno, contraseña, email, telefono, genero, rol, estado, MUNICIPIO_id_municipio, ci], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al actualizar el usuario' });
      } else {
        res.json({ message: 'Usuario actualizado correctamente' });
      }
    });
  });

//eliminar usuario
router.delete('/delete/:ci',auth.authenticateToken, (req, res) => {
    const { ci } = req.params;
    connection.query('DELETE FROM USUARIO WHERE ci = ?', [ci], (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Hubo un error al eliminar el usuario' });
      } else {
        res.json({ message: 'Usuario eliminado correctamente' });
      }
    });
  });


 /*  router.post('/signup',(req,res)=>{
    let user= req.body;
    query ="select email,password,role,status from user where email=?"
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <=0){
                query="insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')";
                connection.query(query,[user.name,user.contactNumber,user.email,user.password],(err,results)=>{
                    if(!err){
                        return res.status(200).json({message:"Registro Exitoso"});
                    }
                    else{
                        return res.status(500).json(err);
                    }
                })
            }   
            else{
                return res.status(400).json({message: "Alguien se encuentra registrado con el mismo correo"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })

}) falta*/  

//---------------- LOGIN ------------------------
router.post('/login',(req,res)=>{
    const user =req.body;
    query = "select nombre,email,contraseña,rol,estado from usuario where email=?";
    connection.query(query,[user.email],(err,results)=>{
        if(!err){
            if(results.length <= 0 || results[0].password != user.password){
                return res.status(401).json({message:"Nombre de usuario o contraseña incorrecta"});
            }
            else if(results[0].status==='false'){
                return res.status(401).json({message:"Esperar la aprobación del administrador"});   
            }
            else if(results[0].password==user.password){
                //GUARDAMOS CIFRADO LA CONTRASENA
                const data={ nombre: results[0].nombre}
                const response ={ email: results[0].email, rol: results[0].rol}
                const accessToken = jwt.sign(response,process.env.ACCESS_TOKEN,{ expiresIn: '8h'})
                res.status(200).json({ token: accessToken, data:data});
            }
            else{
                return res.status(400).json({message:"Algo salió mal. Por favor, inténtelo de nuevo más tarde"});
            }
        }
        else{
            return res.status(500).json(err);
        }
    })
})


module.exports = router;