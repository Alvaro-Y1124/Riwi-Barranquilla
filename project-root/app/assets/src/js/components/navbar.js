/*
 * =============================================
 * COMPONENTE DE BARRA DE NAVEGACIÓN
 * =============================================
 * Barra de navegación que se muestra cuando
 * el usuario está autenticado
 * =============================================
 */

import { getUser, logout, hasRole } from '../controllers/auth.js';
import { ROLES } from '../controllers/config.js';

/*
 * Función para renderizar la barra de navegación
 */
export function renderNavbar() {
    const user = getUser();
    if (!user) return;
    
    console.log('Renderizando navbar para:', user.name);
    
    const app = document.getElementById('app');
    const isAdmin = hasRole(ROLES.ADMIN);
    
    // Verificar si ya existe un navbar
    const existingNavbar = document.querySelector('.navbar');
    if (existingNavbar) {
        existingNavbar.remove();
    }
    
    const navbarHTML = `
        <nav class="navbar">
            <div class="navbar-content">
                <h1>Academia Online</h1>
                <div class="nav-links">
                    <a href="#/dashboard">Dashboard</a>
                    <a href="#/courses">Cursos</a>
                    <span style="color: #ecf0f1; margin: 0 1rem;">|</span>
                    <span style="color: #ecf0f1;">
                        ${user.name} (${isAdmin ? 'Admin' : 'Estudiante'})
                    </span>
                    <button onclick="handleLogout()">Cerrar Sesión</button>
                </div>
            </div>
        </nav>
    `;
    
    // Insertar navbar al inicio del app
    app.insertAdjacentHTML('afterbegin', navbarHTML);
    
    console.log('Navbar renderizado correctamente');
}

/*
 * Función global para manejar el logout
 */
window.handleLogout = function() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        logout();
    }
};