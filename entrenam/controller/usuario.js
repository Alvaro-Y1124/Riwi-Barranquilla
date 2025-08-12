const { executeQuery } = require('../config/database');

class UsuariosController {
    
    // GET - Obtener todos los usuarios con información completa
    static async getAllUsuarios(req, res) {
        try {
            const query = `
                SELECT 
                    u.usuario_id,
                    u.nombre_usuario,
                    u.identificacion,
                    u.correo,
                    u.telefono,
                    COUNT(p.prestamo_id) as total_prestamos,
                    COUNT(CASE WHEN e.nombre_estado = 'Activo' THEN 1 END) as prestamos_activos,
                    COUNT(CASE WHEN e.nombre_estado = 'Devuelto' THEN 1 END) as prestamos_devueltos
                FROM usuarios u
                LEFT JOIN prestamos p ON u.usuario_id = p.usuario_id
                LEFT JOIN estados e ON p.estado_id = e.estado_id
                GROUP BY u.usuario_id, u.nombre_usuario, u.identificacion, u.correo, u.telefono
                ORDER BY u.nombre_usuario
            `;
            
            const usuarios = await executeQuery(query);
            
            res.status(200).json({
                success: true,
                message: 'Usuarios obtenidos correctamente',
                data: usuarios,
                total: usuarios.length
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET - Obtener usuario por ID con información completa
    static async getUsuarioById(req, res) {
        try {
            const { id } = req.params;

            // Información básica del usuario
            const usuarioQuery = `
                SELECT * FROM usuarios WHERE usuario_id = ?
            `;
            const [usuario] = await executeQuery(usuarioQuery, [id]);

            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            // Historial de préstamos del usuario
            const prestamosQuery = `
                SELECT 
                    p.prestamo_id,
                    l.titulo,
                    a.nombre_autor,
                    p.fecha_prestamo,
                    p.fecha_devolucion,
                    e.nombre_estado,
                    e.descripcion as descripcion_estado
                FROM prestamos p
                INNER JOIN libros l ON p.libro_id = l.libro_id
                INNER JOIN autores a ON l.autor_id = a.autor_id
                INNER JOIN estados e ON p.estado_id = e.estado_id
                WHERE p.usuario_id = ?
                ORDER BY p.fecha_prestamo DESC
            `;
            const prestamos = await executeQuery(prestamosQuery, [id]);

            res.status(200).json({
                success: true,
                message: 'Usuario obtenido correctamente',
                data: {
                    ...usuario,
                    prestamos: prestamos
                }
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // POST - Crear nuevo usuario
    static async createUsuario(req, res) {
        try {
            const { nombre_usuario, identificacion, correo, telefono } = req.body;

            // Validaciones básicas
            if (!nombre_usuario || !identificacion || !correo) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos nombre_usuario, identificacion y correo son obligatorios'
                });
            }

            const query = `
                INSERT INTO usuarios (nombre_usuario, identificacion, correo, telefono)
                VALUES (?, ?, ?, ?)
            `;

            const result = await executeQuery(query, [nombre_usuario, identificacion, correo, telefono]);

            res.status(201).json({
                success: true,
                message: 'Usuario creado correctamente',
                data: {
                    usuario_id: result.insertId,
                    nombre_usuario,
                    identificacion,
                    correo,
                    telefono
                }
            });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            
            // Manejo de errores específicos
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'La identificación o correo ya están registrados'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // PUT - Actualizar usuario
    static async updateUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nombre_usuario, identificacion, correo, telefono } = req.body;

            // Verificar si el usuario existe
            const existeQuery = 'SELECT usuario_id FROM usuarios WHERE usuario_id = ?';
            const [usuarioExiste] = await executeQuery(existeQuery, [id]);

            if (!usuarioExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            const query = `
                UPDATE usuarios 
                SET nombre_usuario = ?, identificacion = ?, correo = ?, telefono = ?
                WHERE usuario_id = ?
            `;

            await executeQuery(query, [nombre_usuario, identificacion, correo, telefono, id]);

            res.status(200).json({
                success: true,
                message: 'Usuario actualizado correctamente',
                data: {
                    usuario_id: parseInt(id),
                    nombre_usuario,
                    identificacion,
                    correo,
                    telefono
                }
            });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'La identificación o correo ya están registrados por otro usuario'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // DELETE - Eliminar usuario
    static async deleteUsuario(req, res) {
        try {
            const { id } = req.params;

            // Verificar si el usuario tiene préstamos activos
            const prestamosActivosQuery = `
                SELECT COUNT(*) as prestamos_activos
                FROM prestamos p
                INNER JOIN estados e ON p.estado_id = e.estado_id
                WHERE p.usuario_id = ? AND e.nombre_estado = 'Activo'
            `;
            
            const [{ prestamos_activos }] = await executeQuery(prestamosActivosQuery, [id]);

            if (prestamos_activos > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'No se puede eliminar el usuario porque tiene préstamos activos'
                });
            }

            const query = 'DELETE FROM usuarios WHERE usuario_id = ?';
            const result = await executeQuery(query, [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Usuario eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = UsuariosController;