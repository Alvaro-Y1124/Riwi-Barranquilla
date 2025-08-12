const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuariosController');

// Rutas para usuarios
router.get('/', UsuariosController.getAllUsuarios);
router.get('/:id', UsuariosController.getUsuarioById);
router.post('/', UsuariosController.createUsuario);
router.put('/:id', UsuariosController.updateUsuario);
router.delete('/:id', UsuariosController.deleteUsuario);

module.exports = router;