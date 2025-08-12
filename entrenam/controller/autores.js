const { executeQuery } = require('../config/database');

class AutoresController {
    
    // GET - Obtener todos los autores
    static async getAllAutores(req, res) {
        try {
            const query = `
                SELECT 
                    a.autor_id,
                    a.nombre_autor,
                    COUNT(l.libro_id) as total_libros
                FROM autores a
                LEFT JOIN libros l ON a.autor_id = l.autor_id
                GROUP BY a.autor_id, a.nombre_autor
                ORDER BY a.nombre_autor
            `;
            
            const autores = await executeQuery(query);
            
            res.status(200).json({
                success: true,
                message: 'Autores obtenidos correctamente',
                data: autores,
                total: autores.length
            });
        } catch (error) {
            console.error('Error al obtener autores:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // GET - Obtener autor por ID con sus libros
    static async getAutorById(req, res) {
        try {
            const { id } = req.params;

            const autorQuery = 'SELECT * FROM autores WHERE autor_id = ?';
            const [autor] = await executeQuery(autorQuery, [id]);

            if (!autor) {
                return res.status(404).json({
                    success: false,
                    message: 'Autor no encontrado'
                });
            }

            // Obtener libros del autor
            const librosQuery = `
                SELECT 
                    libro_id,
                    titulo,
                    isbn,
                    año_publicacion
                FROM libros 
                WHERE autor_id = ?
                ORDER BY titulo
            `;
            const libros = await executeQuery(librosQuery, [id]);

            res.status(200).json({
                success: true,
                message: 'Autor obtenido correctamente',
                data: {
                    ...autor,
                    libros: libros
                }
            });
        } catch (error) {
            console.error('Error al obtener autor:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // POST - Crear nuevo autor
    static async createAutor(req, res) {
        try {
            const { nombre_autor } = req.body;

            if (!nombre_autor) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo nombre_autor es obligatorio'
                });
            }

            const query = 'INSERT INTO autores (nombre_autor) VALUES (?)';
            const result = await executeQuery(query, [nombre_autor]);

            res.status(201).json({
                success: true,
                message: 'Autor creado correctamente',
                data: {
                    autor_id: result.insertId,
                    nombre_autor
                }
            });
        } catch (error) {
            console.error('Error al crear autor:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'El autor ya está registrado'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // PUT - Actualizar autor
    static async updateAutor(req, res) {
        try {
            const { id } = req.params;
            const { nombre_autor } = req.body;

            if (!nombre_autor) {
                return res.status(400).json({
                    success: false,
                    message: 'El campo nombre_autor es obligatorio'
                });
            }

            const query = 'UPDATE autores SET nombre_autor = ? WHERE autor_id = ?';
            const result = await executeQuery(query, [nombre_autor, id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Autor no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Autor actualizado correctamente',
                data: {
                    autor_id: parseInt(id),
                    nombre_autor
                }
            });
        } catch (error) {
            console.error('Error al actualizar autor:', error);
            
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: 'El autor ya está registrado'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }

    // DELETE - Eliminar autor
    static async deleteAutor(req, res) {
        try {
            const { id } = req.params;

            // Verificar si el autor tiene libros asociados
            const librosQuery = 'SELECT COUNT(*) as total_libros FROM libros WHERE autor_id = ?';
            const [{ total_libros }] = await executeQuery(librosQuery, [id]);

            if (total_libros > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'No se puede eliminar el autor porque tiene libros asociados'
                });
            }

            const query = 'DELETE FROM autores WHERE autor_id = ?';
            const result = await executeQuery(query, [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Autor no encontrado'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Autor eliminado correctamente'
            });
        } catch (error) {
            console.error('Error al eliminar autor:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: error.message
            });
        }
    }
}

module.exports = AutoresController;