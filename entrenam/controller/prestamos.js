const { executeQuery } = require('../config/database');

class PrestamosController {
    
    // GET - Obtener todos los préstamos
    static async getAllPrestamos(req, res) {
        try {
            const query = `
                SELECT 
                    p.prestamo_id,
                    u.nombre_usuario,
                    u.identificacion,
                    l.titulo,
                    a.nombre_autor,
                    p.fecha_prestamo,
                    p.fecha_devolucion,
                    e.nombre_estado,
                    e.descripcion as descripcion_estado
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.usuario_id
                INNER JOIN libros l ON p.libro_id = l.libro_id
                INNER JOIN autores a ON l.autor_id = a.autor_id
                INNER JOIN estados e ON p.estado_id = e.estado_id
                ORDER BY p.fecha_prestamo DESC
            `;
            
            const prestamos = await executeQuery(query);
            
            res.status(200).json({
                success: true,
                message: 'Préstamos obtenidos correctamente',
                data: prestamos,
                total: prestamos.length
            });
        } catch (error) {
            console.error('Error al obtener préstamos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET - Obtener préstamo por ID
    static async getPrestamoById(req, res) {
        try {
            const { id } = req.params;

            const query = `
                SELECT 
                    p.*,
                    u.nombre_usuario,
                    u.identificacion,
                    u.correo,
                    u.telefono,
                    l.titulo,
                    l.isbn,
                    l.año_publicacion,
                    a.nombre_autor,
                    e.nombre_estado,
                    e.descripcion as descripcion_estado
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.usuario_id
                INNER JOIN libros l ON p.libro_id = l.libro_id
                INNER JOIN autores a ON l.autor_id = a.autor_id
                INNER JOIN estados e ON p.estado_id = e.estado_id
                WHERE p.prestamo_id = ?
            `;
            
            const [prestamo] = await executeQuery(query, [id]);

            if (!prestamo) {
                return res.status(404).json({
                    success: false,
                    message: 'Préstamo no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Préstamo obtenido correctamente',
                data: prestamo
            });
        } catch (error) {
            console.error('Error al obtener préstamo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET - Obtener préstamos activos
    static async getPrestamosActivos(req, res) {
        try {
            const query = `
                SELECT 
                    p.prestamo_id,
                    u.nombre_usuario,
                    u.identificacion,
                    l.titulo,
                    a.nombre_autor,
                    p.fecha_prestamo,
                    DATEDIFF(CURDATE(), p.fecha_prestamo) as dias_prestado
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.usuario_id
                INNER JOIN libros l ON p.libro_id = l.libro_id
                INNER JOIN autores a ON l.autor_id = a.autor_id
                INNER JOIN estados e ON p.estado_id = e.estado_id
                WHERE e.nombre_estado = 'Activo'
                ORDER BY p.fecha_prestamo ASC
            `;
            
            const prestamosActivos = await executeQuery(query);
            
            res.status(200).json({
                success: true,
                message: 'Préstamos activos obtenidos correctamente',
                data: prestamosActivos,
                total: prestamosActivos.length
            });
        } catch (error) {
            console.error('Error al obtener préstamos activos:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // POST - Crear nuevo préstamo
    static async createPrestamo(req, res) {
        try {
            const { usuario_id, libro_id, fecha_prestamo, estado_id } = req.body;

            if (!usuario_id || !libro_id || !fecha_prestamo || !estado_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos usuario_id, libro_id, fecha_prestamo y estado_id son obligatorios'
                });
            }

            // Verificar que el usuario existe
            const usuarioQuery = 'SELECT usuario_id FROM usuarios WHERE usuario_id = ?';
            const [usuario] = await executeQuery(usuarioQuery, [usuario_id]);
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'El usuario especificado no existe'
                });
            }

            // Verificar que el libro existe
            const libroQuery = 'SELECT libro_id FROM libros WHERE libro_id = ?';
            const [libro] = await executeQuery(libroQuery, [libro_id]);
            if (!libro) {
                return res.status(404).json({
                    success: false,
                    message: 'El libro especificado no existe'
                });
            }

            // Verificar que el estado existe
            const estadoQuery = 'SELECT estado_id FROM estados WHERE estado_id = ?';
            const [estado] = await executeQuery(estadoQuery, [estado_id]);
            if (!estado) {
                return res.status(404).json({
                    success: false,
                    message: 'El estado especificado no existe'
                });
            }

            // Verificar si el libro ya está prestado y activo
            const prestamoActivoQuery = `
                SELECT p.prestamo_id 
                FROM prestamos p
                INNER JOIN estados e ON p.estado_id = e.estado_id
                WHERE p.libro_id = ? AND e.nombre_estado = 'Activo'
            `;
            const [prestamoActivo] = await executeQuery(prestamoActivoQuery, [libro_id]);
            
            if (prestamoActivo) {
                return res.status(409).json({
                    success: false,
                    message: 'El libro ya está prestado y activo'
                });
            }

            const query = `
                INSERT INTO prestamos (usuario_id, libro_id, fecha_prestamo, estado_id)
                VALUES (?, ?, ?, ?)
            `;

            const result = await executeQuery(query, [usuario_id, libro_id, fecha_prestamo, estado_id]);

            res.status(201).json({
                success: true,
                message: 'Préstamo creado correctamente',
                data: {
                    prestamo_id: result.insertId,
                    usuario_id,
                    libro_id,
                    fecha_prestamo,
                    estado_id
                }
            });
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // PUT - Actualizar préstamo (principalmente para devolver libros)
    static async updatePrestamo(req, res) {
        try {
            const { id } = req.params;
            const { fecha_devolucion, estado_id } = req.body;

            // Verificar que el préstamo existe
            const prestamoExisteQuery = 'SELECT prestamo_id FROM prestamos WHERE prestamo_id = ?';
            const [prestamoExiste] = await executeQuery(prestamoExisteQuery, [id]);

            if (!prestamoExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'Préstamo no encontrado'
                });
            }

            // Si se proporciona estado_id, verificar que existe
            if (estado_id) {
                const estadoQuery = 'SELECT estado_id FROM estados WHERE estado_id = ?';
                const [estado] = await executeQuery(estadoQuery, [estado_id]);
                if (!estado) {
                    return res.status(404).json({
                        success: false,
                        message: 'El estado especificado no existe'
                    });
                }
            }

            let query = 'UPDATE prestamos SET ';
            let params = [];
            let updates = [];

            if (fecha_devolucion) {
                updates.push('fecha_devolucion = ?');
                params.push(fecha_devolucion);
            }

            if (estado_id) {
                updates.push('estado_id = ?');
                params.push(estado_id);
            }

            if (updates.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Debe proporcionar al menos fecha_devolucion o estado_id'
                });
            }

            query += updates.join(', ') + ' WHERE prestamo_id = ?';
            params.push(id);

            await executeQuery(query, params);

            res.status(200).json({
                success: true,
                message: 'Préstamo actualizado correctamente'
            });
        } catch (error) {
            console.error('Error al actualizar préstamo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // PUT - Devolver libro (método específico)
    static async devolverLibro(req, res) {
        try {
            const { id } = req.params;
            const { fecha_devolucion } = req.body;

            const fechaDevolucion = fecha_devolucion || new Date().toISOString().split('T')[0];

            // Obtener el ID del estado "Devuelto"
            const estadoDevueltoQuery = `SELECT estado_id FROM estados WHERE nombre_estado = 'Devuelto'`;
            const [estadoDevuelto] = await executeQuery(estadoDevueltoQuery);

            if (!estadoDevuelto) {
                return res.status(500).json({
                    success: false,
                    message: 'Error: Estado "Devuelto" no encontrado en la base de datos'
                });
            }

            const query = `
                UPDATE prestamos 
                SET fecha_devolucion = ?, estado_id = ?
                WHERE prestamo_id = ?
            `;

            const result = await executeQuery(query, [fechaDevolucion, estadoDevuelto.estado_id, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Préstamo no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Libro devuelto correctamente',
                data: {
                    prestamo_id: parseInt(id),
                    fecha_devolucion: fechaDevolucion,
                    estado: 'Devuelto'
                }
            });
        } catch (error) {
            console.error('Error al devolver libro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // DELETE - Eliminar préstamo
    static async deletePrestamo(req, res) {
        try {
            const { id } = req.params;

            const query = 'DELETE FROM prestamos WHERE prestamo_id = ?';
            const result = await executeQuery(query, [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Préstamo no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Préstamo eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar préstamo:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = PrestamosController;