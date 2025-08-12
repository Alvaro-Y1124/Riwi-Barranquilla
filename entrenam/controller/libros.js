const { executeQuery } = require('../config/database');

class LibrosController {
    
    // GET - Obtener todos los libros
    static async getAllLibros(req, res) {
        try {
            const query = `
                SELECT 
                    l.libro_id,
                    l.titulo,
                    l.isbn,
                    l.año_publicacion,
                    a.nombre_autor,
                    COUNT(p.prestamo_id) as total_prestamos,
                    COUNT(CASE WHEN e.nombre_estado = 'Activo' THEN 1 END) as prestamos_activos
                FROM libros l
                INNER JOIN autores a ON l.autor_id = a.autor_id
                LEFT JOIN prestamos p ON l.libro_id = p.libro_id
                LEFT JOIN estados e ON p.estado_id = e.estado_id
                GROUP BY l.libro_id, l.titulo, l.isbn, l.año_publicacion, a.nombre_autor
                ORDER BY l.titulo
            `;
            
            const libros = await executeQuery(query);
            
            res.status(200).json({
                success: true,
                message: 'Libros obtenidos correctamente',
                data: libros,
                total: libros.length
            });
        } catch (error) {
            console.error('Error al obtener libros:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET - Obtener libro por ID
    static async getLibroById(req, res) {
        try {
            const { id } = req.params;

            const libroQuery = `
                SELECT 
                    l.*,
                    a.nombre_autor
                FROM libros l
                INNER JOIN autores a ON l.autor_id = a.autor_id
                WHERE l.libro_id = ?
            `;
            const [libro] = await executeQuery(libroQuery, [id]);

            if (!libro) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado'
                });
            }

            // Historial de préstamos del libro
            const prestamosQuery = `
                SELECT 
                    p.prestamo_id,
                    u.nombre_usuario,
                    u.identificacion,
                    p.fecha_prestamo,
                    p.fecha_devolucion,
                    e.nombre_estado,
                    e.descripcion as descripcion_estado
                FROM prestamos p
                INNER JOIN usuarios u ON p.usuario_id = u.usuario_id
                INNER JOIN estados e ON p.estado_id = e.estado_id
                WHERE p.libro_id = ?
                ORDER BY p.fecha_prestamo DESC
            `;
            const prestamos = await executeQuery(prestamosQuery, [id]);

            res.status(200).json({
                success: true,
                message: 'Libro obtenido correctamente',
                data: {
                    ...libro,
                    prestamos: prestamos
                }
            });
        } catch (error) {
            console.error('Error al obtener libro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // POST - Crear nuevo libro
    static async createLibro(req, res) {
        try {
            const { titulo, isbn, año_publicacion, autor_id } = req.body;

            if (!titulo || !autor_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos titulo y autor_id son obligatorios'
                });
            }

            // Verificar que el autor existe
            const autorExisteQuery = 'SELECT autor_id FROM autores WHERE autor_id = ?';
            const [autorExiste] = await executeQuery(autorExisteQuery, [autor_id]);

            if (!autorExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'El autor especificado no existe'
                });
            }

            const query = `
                INSERT INTO libros (titulo, isbn, año_publicacion, autor_id)
                VALUES (?, ?, ?, ?)
            `;

            const result = await executeQuery(query, [titulo, isbn, año_publicacion, autor_id]);

            res.status(201).json({
                success: true,
                message: 'Libro creado correctamente',
                data: {
                    libro_id: result.insertId,
                    titulo,
                    isbn,
                    año_publicacion,
                    autor_id
                }
            });
        } catch (error) {
            console.error('Error al crear libro:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'El ISBN ya está registrado'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // PUT - Actualizar libro
    static async updateLibro(req, res) {
        try {
            const { id } = req.params;
            const { titulo, isbn, año_publicacion, autor_id } = req.body;

            if (!titulo || !autor_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Los campos titulo y autor_id son obligatorios'
                });
            }

            // Verificar que el libro existe
            const libroExisteQuery = 'SELECT libro_id FROM libros WHERE libro_id = ?';
            const [libroExiste] = await executeQuery(libroExisteQuery, [id]);

            if (!libroExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado'
                });
            }

            // Verificar que el autor existe
            const autorExisteQuery = 'SELECT autor_id FROM autores WHERE autor_id = ?';
            const [autorExiste] = await executeQuery(autorExisteQuery, [autor_id]);

            if (!autorExiste) {
                return res.status(404).json({
                    success: false,
                    message: 'El autor especificado no existe'
                });
            }

            const query = `
                UPDATE libros 
                SET titulo = ?, isbn = ?, año_publicacion = ?, autor_id = ?
                WHERE libro_id = ?
            `;

            await executeQuery(query, [titulo, isbn, año_publicacion, autor_id, id]);

            res.status(200).json({
                success: true,
                message: 'Libro actualizado correctamente',
                data: {
                    libro_id: parseInt(id),
                    titulo,
                    isbn,
                    año_publicacion,
                    autor_id
                }
            });
        } catch (error) {
            console.error('Error al actualizar libro:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'El ISBN ya está registrado por otro libro'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // DELETE - Eliminar libro
    static async deleteLibro(req, res) {
        try {
            const { id } = req.params;

            // Verificar si el libro tiene préstamos
            const prestamosQuery = 'SELECT COUNT(*) as total_prestamos FROM prestamos WHERE libro_id = ?';
            const [{ total_prestamos }] = await executeQuery(prestamosQuery, [id]);

            if (total_prestamos > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'No se puede eliminar el libro porque tiene préstamos asociados'
                });
            }

            const query = 'DELETE FROM libros WHERE libro_id = ?';
            const result = await executeQuery(query, [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Libro no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Libro eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = LibrosController;