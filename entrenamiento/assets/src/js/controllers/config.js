/*
 * =============================================
 * ARCHIVO DE CONFIGURACIÓN
 * =============================================
 * Contiene todas las constantes y configuraciones
 * globales de la aplicación.
 * =============================================
 */

// URL base de la API (json-server)
export const API_URL = 'http://localhost:3000';

// Roles de usuario disponibles
export const ROLES = {
    ADMIN: 'administrador',
    STUDENT: 'estudiante'
};

// Categorías de cursos disponibles
export const COURSE_CATEGORIES = [
    'Programación',
    'Diseño',
    'Marketing',
    'Negocios',
    'Idiomas',
    'Música',
    'Fotografía',
    'Desarrollo Personal'
];

// Configuración de paginación
export const ITEMS_PER_PAGE = 6;

// Mensajes de la aplicación
export const MESSAGES = {
    LOGIN_SUCCESS: 'Inicio de sesión exitoso',
    LOGIN_ERROR: 'Error al iniciar sesión',
    REGISTER_SUCCESS: 'Registro exitoso',
    REGISTER_ERROR: 'Error al registrarse',
    COURSE_CREATED: 'Curso creado exitosamente',
    COURSE_UPDATED: 'Curso actualizado exitosamente',
    COURSE_DELETED: 'Curso eliminado exitosamente',
    ENROLLMENT_SUCCESS: 'Inscripción exitosa',
    ENROLLMENT_ERROR: 'Error al inscribirse',
    NO_CAPACITY: 'No hay cupos disponibles',
    ALREADY_ENROLLED: 'Ya estás inscrito en este curso'
};