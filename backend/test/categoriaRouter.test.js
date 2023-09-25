const express = require('express');
const supertest = require('supertest');
const { expect } = require('chai');
const categoriaRouter = require('../routes/Categoria');

const app = express();
app.use(express.json());
app.use('/categoria', categoriaRouter);

describe('Categoria Router', () => {
  it('debería obtener todas las categorías', async () => {
    const response = await supertest(app).get('/categoria/get');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('debería obtener una categoría por su ID', async () => {
    const response = await supertest(app).get('/categoria/buscar/1');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('object');
  });

  it('debería crear una nueva categoría', async () => {
    const nuevaCategoria = {
      nom_categoria: 'Nueva Categoría',
      desc_categoria: 'Descripción de la nueva categoría',
      estado: 'activo', 
    };

    const response = await supertest(app)
      .post('/categoria/create')
      .send(nuevaCategoria);

    expect(response.status).to.equal(201);
    expect(response.body.message).to.equal('Categoría creada correctamente');
  });

});
