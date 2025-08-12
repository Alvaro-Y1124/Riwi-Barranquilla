const express = require('express');
const router = express.Router();
const PrestamosController = require('../controllers/prestamosController');

// Rutas para préstamos
router.get('/', PrestamosController.getAllPrestamos);
router.get('/activos', PrestamosController.getPrestamosActivos);
router.get('/:id', PrestamosController.getPrestamoById);
router.post('/', PrestamosController.createPrestamo);
router.put('/:id', PrestamosController.updatePrestamo);
router.put('/:id/devolver', PrestamosController.devolverLibro);
router.delete('/:id', PrestamosController.deletePrestamo);

module.exports = router;