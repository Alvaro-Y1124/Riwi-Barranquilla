/*
 * =============================================
 * VISTA DE LOGIN
 * =============================================
 * Renderiza el formulario de inicio de sesión
 * con funcionalidad para mostrar/ocultar contraseña
 * =============================================
 */

import { login } from '../controllers/auth.js';
import { navigateTo } from '../router/router.js';
import { showMessage } from '../utils/messages.js';

/*
 * Función para mostrar/ocultar contraseña
 * @param {string} inputId - ID del input de contraseña
 * @param {HTMLElement} button - Botón que activa la función
 */
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = 'Ocultar';
    } else {
        input.type = 'password';
        button.textContent = 'Mostrar';
    }
}

/*
 * Función principal para renderizar la vista de login
 */
export function renderLogin() {
    const app = document.getElementById('app');
    
    const loginHTML = `
        <div class="form-container">
            <h2>Iniciar Sesión</h2>
            
            <!-- Formulario de login -->
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Correo Electrónico:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required
                        placeholder="usuario@ejemplo.com"
                    >
                </div>
                
                <div class="form-group">
                    <label for="password">Contraseña:</label>
                    <div class="password-input-container">
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required
                            placeholder="Ingresa tu contraseña"
                        >
                        <button 
                            type="button" 
                            class="toggle-password" 
                            id="togglePasswordBtn"
                        >
                            Mostrar
                        </button>
                    </div>
                </div>
                
                <!-- Contenedor para mensajes de error -->
                <div id="messageContainer"></div>
                
                <button type="submit" class="btn btn-primary btn-block">
                    Iniciar Sesión
                </button>
            </form>
            
            <!-- Enlaces adicionales -->
            <div style="margin-top: 1rem; text-align: center;">
                <p>¿No tienes cuenta? 
                    <a href="#/register" style="color: #3498db;">Regístrate aquí</a>
                </p>
                <button 
                    type="button" 
                    class="btn btn-secondary"
                    onclick="window.location.hash = '#/'"
                    style="margin-top: 1rem;"
                >
                    Volver al Inicio
                </button>
            </div>
        </div>
    `;
    
    app.innerHTML = loginHTML;
    
    // Agregar evento al botón de mostrar/ocultar contraseña
    const toggleBtn = document.getElementById('togglePasswordBtn');
    toggleBtn.addEventListener('click', () => {
        togglePassword('password', toggleBtn);
    });
    
    // Manejar el envío del formulario
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', handleLogin);
}

/*
 * Maneja el envío del formulario de login
 * @param {Event} e - Evento del formulario
 */
async function handleLogin(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    try {
        // Intentar hacer login
        const user = await login(email, password);
        
        // Mostrar mensaje de éxito
        showMessage('messageContainer', 'Inicio de sesión exitoso', 'success');
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
            navigateTo('/dashboard');
        }, 1000);
        
    } catch (error) {
        // Mostrar mensaje de error
        showMessage('messageContainer', error.message, 'error');
    }
}