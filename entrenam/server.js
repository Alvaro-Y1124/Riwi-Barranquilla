const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar configuración de base de datos
const { testConnection } = require('./config/database');

// Importar rutas
const usuariosRoutes = require('./routes/usuarios');
const autoresRoutes = require('./routes/autores');
const librosRoutes = require('./routes/libros');
const estadosRoutes = require('./routes/estados');
const prestamosRoutes = require('./routes/prestamos');

// Importar middlewares