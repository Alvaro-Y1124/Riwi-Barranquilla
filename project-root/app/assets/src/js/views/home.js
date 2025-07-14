/*
 * =============================================
 * VISTA DE INICIO (HOME)
 * =============================================
 * Página principal de la aplicación
 * Muestra información general y enlaces
 * =============================================
 */

import { isAuthenticated } from '../controllers/auth.js';

/*
 * Función principal para renderizar la vista home
 */
export function renderHome() {
    const app = document.getElementById('app');
    const userAuthenticated = isAuthenticated();
    
    const homeHTML = `
        <div class="container">
            <!-- Encabezado principal -->
            <div style="text-align: center; padding: 3rem 0;">
                <h1 style="font-size: 3rem; color: #2c3e50; margin-bottom: 1rem;">
                    Events
                </h1>
                <p style="font-size: 1.2rem; color: #7f8c8d; margin-bottom: 2rem;">
                    Agrega eventos y organiza tu tiempo
                </p>
                
                <!-- Botones de acción -->
                <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                    ${userAuthenticated ? `
                        <a href="#/dashboard" class="btn btn-primary">
                            Ir al Dashboard
                        </a>
                        <a href="#/courses" class="btn btn-success">
                            Ver eventos
                        </a>
                    ` : `
                        <a href="#/login" class="btn btn-primary">
                            Iniciar Sesión
                        </a>
                        <a href="#/register" class="btn btn-success">
                            Registrarse
                        </a>
                    `}
                </div>
            </div>
            
            <!-- Sección de características -->
            <div style="margin-top: 4rem;">
                <h2 style="text-align: center; color: #2c3e50; margin-bottom: 3rem;">
                    ¿Por qué elegirnos?
                </h2>
                
                <div class="courses-grid">
                    <!-- Característica 1 -->
                    <div class="course-card">
                        <h3 style="color: #3498db;">📚 Variedad de Cursos</h3>
                        <p style="margin-top: 1rem;">
                            Amplio catálogo de eventos en diferentes categorías:
                            programación, diseño, marketing, idiomas y más.
                        </p>
                    </div>
                    
                    <!-- Característica 2 -->
                    <div class="course-card">
                        <h3 style="color: #27ae60;">👨‍🏫 Instructores Expertos</h3>
                        <p style="margin-top: 1rem;">
                            puede asistir a nuestros eventos y aprende de profesionales con experiencia real
                            en la industria y pasión por enseñar.
                        </p>
                    </div>
                    
                    <!-- Característica 3 -->
                    <div class="course-card">
                        <h3 style="color: #e74c3c;">🏆 Certificados</h3>
                        <p style="margin-top: 1rem;">
                            Puedes ganar premios al participar en los eventos en concursos,
                            desmostrandos tus nuevas habilidades.
                        </p>
                    </div>
                </div>
            </div>
            
            <!-- Sección de información adicional -->
            <div style="margin-top: 4rem; text-align: center; padding: 2rem; background-color: #ecf0f1; border-radius: 8px;">
                <h3 style="color: #2c3e50; margin-bottom: 1rem;">
                    Participa hoy
                </h3>
                <p style="color: #7f8c8d; margin-bottom: 1.5rem;">
                    ${userAuthenticated ? 
                        'Explora nuestros eventos disponibles.' :
                        'Regístrate gratis y accede a uno de nuestos eventos.'
                    }
                </p>
                ${!userAuthenticated ? `
                    <a href="#/register" class="btn btn-success">
                        Crear Cuenta Gratuita
                    </a>
                ` : ''}
            </div>
            
            <!-- Footer -->
            <footer style="margin-top: 4rem; padding: 2rem 0; text-align: center; border-top: 1px solid #ecf0f1;">
                <p style="color: #95a5a6;">
                    © 2025 eventos con todos los derechos recervados.
                </p>
            </footer>
        </div>
    `;
    
    app.innerHTML = homeHTML;
}