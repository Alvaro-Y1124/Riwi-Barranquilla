/*
 * =============================================
 * SISTEMA DE RUTAS (ROUTER)
 * =============================================
 * Este módulo implementa un sistema de rutas
 * protegidas usando hash (#) en las URLs.
 * Incluye guardias de ruta para proteger
 * páginas según el rol del usuario.
 * =============================================
 */

// Importar vistas y utilidades
import { getUser } from '../controllers/auth.js';
import { renderLogin } from '../views/login.js';
import { renderRegister } from '../views/register.js';
import { renderHome } from '../views/home.js';
import { renderDashboard } from '../views/dashboard.js';
import { renderCourses } from '../views/courses.js';
import { renderNotFound } from '../views/notFound.js';
import { renderNavbar } from '../components/navbar.js';

/*
 * Definición de las rutas de la aplicación
 * Cada ruta tiene:
 * - path: la ruta en el hash
 * - component: función que renderiza la vista
 * - requiresAuth: si requiere autenticación
 * - role: rol requerido (opcional)
 */
const routes = {
    '/': {
        component: renderHome,
        requiresAuth: false
    },
    '/login': {
        component: renderLogin,
        requiresAuth: false
    },
    '/register': {
        component: renderRegister,
        requiresAuth: false
    },
    '/dashboard': {
        component: renderDashboard,
        requiresAuth: true
    },
    '/courses': {
        component: renderCourses,
        requiresAuth: true
    },
    '/not-found': {
        component: renderNotFound,
        requiresAuth: false
    }
};

/*
 * Función principal del router
 * Maneja la navegación y las rutas protegidas
 */
function router() {
    // Obtener la ruta actual del hash
    let path = window.location.hash.slice(1) || '/';
    
    console.log('Navegando a:', path);
    
    // Obtener información del usuario actual
    const user = getUser();
    
    // Buscar la ruta en el objeto de rutas
    const route = routes[path];
    
    // Si la ruta no existe, redirigir a not-found
    if (!route) {
        console.log('Ruta no encontrada, redirigiendo a /not-found');
        window.location.hash = '#/not-found';
        return;
    }
    
    /*
     * LÓGICA DE GUARDIAS DE RUTA
     */
    
    // Si la ruta requiere autenticación y no hay usuario
    if (route.requiresAuth && !user) {
        console.log('Ruta protegida, redirigiendo a /not-found');
        window.location.hash = '#/not-found';
        return;
    }
    
    // Si el usuario está autenticado e intenta acceder a login o register
    if (user && (path === '/login' || path === '/register')) {
        console.log('Usuario autenticado, redirigiendo a /dashboard');
        window.location.hash = '#/dashboard';
        return;
    }
    
    // Limpiar el contenedor principal
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    // Renderizar la barra de navegación si el usuario está autenticado
    if (user) {
        console.log('Renderizando navbar para usuario:', user.email);
        renderNavbar();
    }
    
    // Crear contenedor para el contenido principal
    const mainContent = document.createElement('div');
    mainContent.className = 'main-content';
    app.appendChild(mainContent);
    
    // Renderizar el componente de la ruta
    route.component();
}

/*
 * Función para navegar a una ruta específica
 * @param {string} path - La ruta a la que navegar
 */
export function navigateTo(path) {
    window.location.hash = `#${path}`;
}

/*
 * Inicializar el sistema de rutas
 */
export function initRouter() {
    // Ejecutar el router al cargar la página
    router();
    
    // Escuchar cambios en el hash
    window.addEventListener('hashchange', router);
    
    // Si no hay hash, establecer la ruta por defecto
    if (!window.location.hash) {
        window.location.hash = '#/';
    }
}