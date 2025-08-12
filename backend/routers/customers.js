const express = require('express');
const router = express.Router();
const controllersCustomers = require('../controllers/controllersCustomers');

// Define todas las rutas para el CRUD de customers y las asocia a una función del controlador

// GET /customers -> Obtener todos los customers
router.get('/', controllersCustomers.getCustomers);

// GET /customers/:id -> Obtener un solo estudiante por su ID
router.get('/:id', controllersCustomers.getCustomersId);

// POST /customers -> Crear un nuevo estudiante
router.post('/', controllersCustomers.createClient);

// PUT /customers/:id -> Actualizar un customers existente
router.put('/:id', controllersCustomers.updateClient);

// DELETE /customers/:id -> Eliminar un customers
router.delete('/:id', controllersCustomers.deleteClient);


module.exports = router;