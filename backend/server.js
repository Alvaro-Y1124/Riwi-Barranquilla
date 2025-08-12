
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const customersRoutes = require('./routers/customers');

// Configuración inicial del servidor
const app = express();

app.set('port', process.env.PORT || 3001);

// Middlewares
app.use(cors()); 
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/customers', customersRoutes);

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor escuchando en el puerto ${app.get('port')}`);
});