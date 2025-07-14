/*
 * =============================================
 * VISTA DE PÁGINA NO ENCONTRADA
 * =============================================
 * Se muestra cuando el usuario intenta acceder
 * a una ruta que no existe o no tiene permisos
 * =============================================
 */

import { isAuthenticated } from '../controllers/auth.js';

/*
 * Función principal para renderizar la vista 404
 */
export function renderNotFound() {
    const app = document.getElementById('app');
    const userAuthenticated = isAuthenticated();
    
    const notFoundHTML = `
        <div class="container">
            <div class="error-container">
                <h1>404</h1>
                <h2>Página No Encontrada</h2>
                <p>
                    Lo sentimos, la página que buscas no existe o no tienes permisos para acceder a ella.
                </p>
                
                <!-- Botones de acción según estado de autenticación -->
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    <a href="#/" class="btn btn-primary">
                        Volver al Inicio
                    </a>
                    ${userAuthenticated ? `
                        <a href="#/dashboard" class="btn btn-success">
                            Ir al Dashboard
                        </a>
                    ` : `
                        <a href="#/login" class="btn btn-success">
                            Iniciar Sesión
                        </a>
                    `}
                </div>
            </div>
        </div>
    `;
    
    app.innerHTML = notFoundHTML;
}