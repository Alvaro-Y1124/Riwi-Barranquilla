/*
 * =============================================
 * ARCHIVO PRINCIPAL DE LA APLICACIÓN
 * =============================================
 * Este archivo es el punto de entrada de la SPA.
 * Se encarga de inicializar el router y manejar
 * la navegación de la aplicación.
 * =============================================
 */

// Importar módulos necesarios
import { initRouter } from './js/router/router.js';
import { checkAuth } from './js/controllers/auth.js';

/*
 * Función de inicialización de la aplicación
 * Se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicación iniciada correctamente');
    
    // Verificar si el usuario está autenticado
    checkAuth();
    
    // Inicializar el sistema de rutas
    initRouter();
    
    // Manejar el evento de navegación hacia atrás/adelante
    window.addEventListener('hashchange', () => {
        console.log('Cambio de ruta detectado:', window.location.hash);
    });
});