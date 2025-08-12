const express = require('express');
const router = express.Router();
const AutoresController = require('../controllers/autoresController');

// Rutas para autores
router.get('/', AutoresController.getAllAutores);
router.get('/:id', AutoresController.getAutorById);
router.post('/', AutoresController.createAutor);
router.put('/:id', AutoresController.updateAutor);
router.delete('/:id', AutoresController.deleteAutor);

module.exports = router;