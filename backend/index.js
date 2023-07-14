const express = require('express');
var cors = require('cors');
const path = require('path');
const connection =require('./connection');

//rutas
const userRoute = require('./routes/usuario');
const MunicipioRoute = require('./routes/municipio');
const Entidad_eje_Route = require('./routes/Entidad_Ejecutora');
const Lineas_Estr_Route = require('./routes/Lineas_Estrategicas');
const Lineas_Acc_Route = require('./routes/Lineas_Accion');
const Acciones_est_Route = require('./routes/Acciones_estrategicas');
const Indicador_Route = require('./routes/Indicador');

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
app.use('/Entidad_eje',Entidad_eje_Route);
app.use('/Lineas_estr',Lineas_Estr_Route);
app.use('/Lineas_Acc',Lineas_Acc_Route);
app.use('/Accion_est',Acciones_est_Route);
app.use('/Indicador',Indicador_Route);


module.exports=app;