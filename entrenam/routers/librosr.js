const express = require('express');
const router = express.Router();
const LibrosController = require('../controllers/librosController');

// Rutas para libros
router.get('/', LibrosController.getAllLibros);
router.get('/:id', LibrosController.getLibroById);
router.post('/', LibrosController.createLibro);
router.put('/:id', LibrosController.updateLibro);
router.delete('/:id', LibrosController.deleteLibro);

module.exports = router;