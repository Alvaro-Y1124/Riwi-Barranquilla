const express = require('express');
const router = express.Router();
const EstadosController = require('../controllers/estadosController');

// Rutas para estados
router.get('/', EstadosController.getAllEstados);
router.get('/:id', EstadosController.getEstadoById);
router.post('/', EstadosController.createEstado);
router.put('/:id', EstadosController.updateEstado);
router.delete('/:id', EstadosController.deleteEstado);

module.exports = router;