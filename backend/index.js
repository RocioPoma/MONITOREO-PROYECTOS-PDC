const express = require('express');
var cors = require('cors');
const path = require('path');
const connection =require('./connection');

//rutas
const userRoute = require('./routes/usuario');
const MunicipioRoute = require('./routes/municipio');
const entidad_eje_Route = require('./routes/entidad_ejecutora');
const lineas_estr_Route = require('./routes/lineas_estrategicas');
const lineas_acc_Route = require('./routes/lineas_accion');
const acciones_est_Route = require('./routes/Acciones_estrategicas');
const indicador_Route = require('./routes/Indicador');
const categoria_Route = require('./routes/Categoria');
const proyectos_Route = require('./routes/Proyectos');

//const path = require('path');

const app = express();

//Middleware
app.use(cors({origen:"*"}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//--app.use('/uploads',express.static(path.resolve('uploads')));
//rutas componentes
app.use('/usuarios',userRoute);
app.use('/municipio',MunicipioRoute);
app.use('/entidad_eje',entidad_eje_Route);
app.use('/lineas_estr',lineas_estr_Route);
app.use('/lineas_acc',lineas_acc_Route);
app.use('/accion_est',acciones_est_Route);
app.use('/indicador',indicador_Route);
app.use('/categoria',categoria_Route);
app.use('/proyecto',proyectos_Route);


module.exports=app;