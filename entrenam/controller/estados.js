const { executeQuery } = require('../config/database');

class EstadosController {
    
    // GET - Obtener todos los estados
    static async getAllEstados(req, res) {
        try {
            const query = `
                SELECT 
                    e.estado_id,
                    e.nombre_estado,
                    e.descripcion,
                    COUNT(p.prestamo_id) as total_prestamos
                FROM estados e
                LEFT JOIN prestamos p ON e.estado_id = p.estado_id
                GROUP BY e.estado_id, e.nombre_estado, e.descripcion
                ORDER BY e.nombre_estado
            `;
            
            const estados = await executeQuery(query);
            
            res.status(200).json({
                success: true,
                message: 'Estados obtenidos correctamente',
                data: estados,
                total: estados.length
            });
        } catch (error) {
            console.error('Error al obtener estados:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET - Obtener estado por ID
    static async getEstadoById(req, res) {
        try {
            const { id } = req.params;

            const estadoQuery = 'SELECT * FROM estados WHERE estado_id = ?';
            const [estado] = await executeQuery(estadoQuery, [id]);

            if (!estado) {
                return res.status(404).json({
                    success: false,
                    message: 'Estado no encontrado'
                });
            }

            // Obtener préstamos con este estado
            const prestamosQuery = `
                SELECT 
                    p.prestamo_id,
                    u.nombre_usuario,
                    l.titulo,
                    a.nombre_autor,
                    p.fecha_prestamo,
                    p.fecha_devolucion
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.usuario_id
                INNER JOIN libros l ON p.libro_id = l.libro_id
                INNER JOIN autores a ON l.autor_id = a.autor_id
                WHERE p.estado_id = ?
                ORDER BY p.fecha_prestamo DESC
            `;
            const prestamos = await executeQuery(prestamosQuery, [id]);

            res.status(200).json({
                success: true,
                message: 'Estado obtenido correctamente',
                data: {
                    ...estado,
                    prestamos: prestamos
                }
            });
        } catch (error) {
            console.error('Error al obtener estado:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // POST - Crear nuevo estado
    static async createEstado(req, res) {
        try {
            const { nombre_estado, descripcion } = req.body;

            if (!nombre_estado) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo nombre_estado es obligatorio'
                });
            }

            const query = 'INSERT INTO estados (nombre_estado, descripcion) VALUES (?, ?)';
            const result = await executeQuery(query, [nombre_estado, descripcion]);

            res.status(201).json({
                success: true,
                message: 'Estado creado correctamente',
                data: {
                    estado_id: result.insertId,
                    nombre_estado,
                    descripcion
                }
            });
        } catch (error) {
            console.error('Error al crear estado:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'El estado ya está registrado'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // PUT - Actualizar estado
    static async updateEstado(req, res) {
        try {
            const { id } = req.params;
            const { nombre_estado, descripcion } = req.body;

            if (!nombre_estado) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo nombre_estado es obligatorio'
                });
            }

            const query = 'UPDATE estados SET nombre_estado = ?, descripcion = ? WHERE estado_id = ?';
            const result = await executeQuery(query, [nombre_estado, descripcion, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Estado no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Estado actualizado correctamente',
                data: {
                    estado_id: parseInt(id),
                    nombre_estado,
                    descripcion
                }
            });
        } catch (error) {
            console.error('Error al actualizar estado:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'El estado ya está registrado'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // DELETE - Eliminar estado
    static async deleteEstado(req, res) {
        try {
            const { id } = req.params;

            // Verificar si el estado tiene préstamos asociados
            const prestamosQuery = 'SELECT COUNT(*) as total_prestamos FROM prestamos WHERE estado_id = ?';
            const [{ total_prestamos }] = await executeQuery(prestamosQuery, [id]);

            if (total_prestamos > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'No se puede eliminar el estado porque tiene préstamos asociados'
                });
            }

            const query = 'DELETE FROM estados WHERE estado_id = ?';
            const result = await executeQuery(query, [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Estado no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Estado eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar estado:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = EstadosController