const express = require('express');
var cors = require('cors');
const path = require('path');
const connection =require('./connection');

//rutas
const userRoute = require('./routes/usuario');

//const path = require('path');

const app = express();

//Middleware
app.use(cors({origen:"*"}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//--app.use('/uploads',express.static(path.resolve('uploads')));
//rutas componentes
app.use('/usuarios',userRoute);


module.exports=app;