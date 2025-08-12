// Middleware para validar parámetros ID
const validateId = (req, res, next) => {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
        return res.status(400).json({
            success: false,
            message: 'ID no válido'
        });
    }
    
    req.params.id = parseInt(id);
    next();
};

// Middleware para validar email
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Middleware para validar datos de usuario
const validateUsuarioData = (req, res, next) => {
    const { nombre_usuario, identificacion, correo, telefono } = req.body;
    
    if (!nombre_usuario || nombre_usuario.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'El nombre de usuario es obligatorio'
        });
    }
    
    if (!identificacion || identificacion.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'La identificación es obligatoria'
        });
    }
    
    if (!correo || !validateEmail(correo)) {
        return res.status(400).json({
            success: false,
            message: 'El correo electrónico no es válido'
        });
    }
    
    if (telefono && telefono.trim().length === 0) {
        req.body.telefono = null;
    }
    
    next();
};

// Middleware para validar año de publicación
const validateYear = (req, res, next) => {
    const { año_publicacion } = req.body;
    
    if (año_publicacion) {
        const year = parseInt(año_publicacion);
        const currentYear = new Date().getFullYear();
        
        if (isNaN(year) || year < 1000 || year > currentYear) {
            return res.status(400).json({
                success: false,
                message: 'El año de publicación no es válido'
            });
        }
        
        req.body.año_publicacion = year;
    }
    
    next();
};

// Middleware para validar fechas
const validateDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
};

const validatePrestamoData = (req, res, next) => {
    const { usuario_id, libro_id, fecha_prestamo, estado_id } = req.body;
    
    if (!usuario_id || !libro_id || !fecha_prestamo || !estado_id) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios'
        });
    }
    
    if (!validateDate(fecha_prestamo)) {
        return res.status(400).json({
            success: false,
            message: 'La fecha de préstamo no es válida'
        });
    }
    
    next();
};

module.exports = {
    validateId,
    validateEmail,
    validateUsuarioData,
    validateYear,
    validateDate,
    validatePrestamoData
};