/*
 * =============================================
 * VISTA DE REGISTRO
 * =============================================
 * Renderiza el formulario de registro de usuarios
 * Permite seleccionar el tipo de usuario
 * =============================================
 */

import { register } from '../controllers/auth.js';
import { navigateTo } from '../router/router.js';
import { showMessage } from '../utils/messages.js';
import { ROLES } from '../controllers/config.js';

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
 * Función principal para renderizar la vista de registro
 */
export function renderRegister() {
    const app = document.getElementById('app');
    
    const registerHTML = `
        <div class="form-container">
            <h2>Registro de Usuario</h2>
            
            <!-- Formulario de registro -->
            <form id="registerForm">
                <div class="form-group">
                    <label for="name">Nombre Completo:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required
                        placeholder="Juan Pérez"
                    >
                </div>
                
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
                            placeholder="Mínimo 6 caracteres"
                            minlength="6"
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
                
                <div class="form-group">
                    <label for="confirmPassword">Confirmar Contraseña:</label>
                    <div class="password-input-container">
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            name="confirmPassword" 
                            required
                            placeholder="Repite tu contraseña"
                            minlength="6"
                        >
                        <button 
                            type="button" 
                            class="toggle-password" 
                            id="toggleConfirmPasswordBtn"
                        >
                            Mostrar
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="role">Tipo de Usuario:</label>
                    <select id="role" name="role" required>
                        <option value="">Selecciona un tipo</option>
                        <option value="${ROLES.STUDENT}">Estudiante</option>
                        <option value="${ROLES.ADMIN}">Administrador</option>
                    </select>
                </div>
                
                <!-- Contenedor para mensajes -->
                <div id="messageContainer"></div>
                
                <button type="submit" class="btn btn-success btn-block">
                    Registrarse
                </button>
            </form>
            
            <!-- Enlaces adicionales -->
            <div style="margin-top: 1rem; text-align: center;">
                <p>¿Ya tienes cuenta? 
                    <a href="#/login" style="color: #3498db;">Inicia sesión aquí</a>
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
    
    app.innerHTML = registerHTML;
    
    // Agregar eventos a los botones de mostrar/ocultar contraseña
    const toggleBtn = document.getElementById('togglePasswordBtn');
    toggleBtn.addEventListener('click', () => {
        togglePassword('password', toggleBtn);
    });
    
    const toggleConfirmBtn = document.getElementById('toggleConfirmPasswordBtn');
    toggleConfirmBtn.addEventListener('click', () => {
        togglePassword('confirmPassword', toggleConfirmBtn);
    });
    
    // Manejar el envío del formulario
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', handleRegister);
}

/*
 * Maneja el envío del formulario de registro
 * @param {Event} e - Evento del formulario
 */
async function handleRegister(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const formData = new FormData(e.target);
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    const confirmPassword = formData.get('confirmPassword');
    
    // Validar que las contraseñas coincidan
    if (userData.password !== confirmPassword) {
        showMessage('messageContainer', 'Las contraseñas no coinciden', 'error');
        return;
    }
    
    try {
        // Intentar registrar al usuario
        await register(userData);
        
        // Mostrar mensaje de éxito
        showMessage('messageContainer', 'Registro exitoso. Redirigiendo...', 'success');
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
            navigateTo('/dashboard');
        }, 1000);
        
    } catch (error) {
        // Mostrar mensaje de error
        showMessage('messageContainer', error.message, 'error');
    }
}