// Middleware para manejo de errores 404
const notFound = (req, res, next) => {
    const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Middleware para manejo de errores generales
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    // Error de validación de Mongoose (si usáramos MongoDB)
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(', ');
    }

    // Error de duplicado en MySQL
    if (err.code === 'ER_DUP_ENTRY') {
        statusCode = 409;
        message = 'Registro duplicado';
    }

    // Error de clave foránea en MySQL
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        statusCode = 400;
        message = 'Referencia no válida';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    notFound,
    errorHandler
};