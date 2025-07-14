/*
 * =============================================
 * VISTA DE DASHBOARD
 * =============================================
 * Panel de control principal para usuarios
 * autenticados. Muestra diferente contenido
 * según el rol (administrador o estudiante)
 * =============================================
 */

import { getUser, hasRole } from '../controllers/auth.js';
import { API_URL, ROLES } from '../controllers/config.js';
import { navigateTo } from '../router/router.js';

/*
 * Función principal para renderizar el dashboard
 */
export async function renderDashboard() {
    const user = getUser();
    
    // Verificar que el usuario existe
    if (!user) {
        navigateTo('/login');
        return;
    }
    
    // Obtener el contenedor principal
    const mainContent = document.querySelector('.main-content');
    
    if (!mainContent) {
        console.error('No se encontró el contenedor main-content');
        return;
    }
    
    // Mostrar contenido según el rol
    if (hasRole(ROLES.ADMIN)) {
        await renderAdminDashboard(mainContent, user);
    } else {
        await renderStudentDashboard(mainContent, user);
    }
}

/*
 * Renderiza el dashboard del administrador
 * @param {HTMLElement} container - Contenedor principal
 * @param {Object} user - Datos del usuario
 */
async function renderAdminDashboard(container, user) {
    try {
        // Obtener estadísticas
        const [coursesRes, usersRes] = await Promise.all([
            fetch(`${API_URL}/courses`),
            fetch(`${API_URL}/users`)
        ]);
        
        const courses = await coursesRes.json();
        const users = await usersRes.json();
        
        // Calcular estadísticas
        const totalCourses = courses.length;
        const totalStudents = users.filter(u => u.role === ROLES.STUDENT).length;
        const totalInstructors = new Set(courses.map(c => c.instructor)).size;
        const totalEnrollments = courses.reduce((sum, course) => 
            sum + (course.enrolledStudents ? course.enrolledStudents.length : 0), 0
        );
        
        const dashboardHTML = `
            <div class="container">
                <!-- Encabezado del dashboard -->
                <div class="dashboard-header">
                    <h2>Panel de Administración</h2>
                    <p>Bienvenido, ${user.name} - Administrador</p>
                </div>
                
                <!-- Estadísticas -->
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>${totalCourses}</h3>
                        <p>Cursos Totales</p>
                    </div>
                    <div class="stat-card">
                        <h3>${totalStudents}</h3>
                        <p>Estudiantes Registrados</p>
                    </div>
                    <div class="stat-card">
                        <h3>${totalInstructors}</h3>
                        <p>Instructores Activos</p>
                    </div>
                    <div class="stat-card">
                        <h3>${totalEnrollments}</h3>
                        <p>Inscripciones Totales</p>
                    </div>
                </div>
                
                <!-- Acciones rápidas -->
                <div style="margin-top: 2rem;">
                    <h3 style="color: #2c3e50; margin-bottom: 1rem;">Acciones Rápidas</h3>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <a href="#/courses" class="btn btn-primary">
                            Gestionar Cursos
                        </a>
                        <button class="btn btn-success" onclick="window.location.hash='#/courses'">
                            Crear Nuevo Curso
                        </button>
                    </div>
                </div>
                
                <!-- Lista de cursos recientes -->
                <div style="margin-top: 3rem;">
                    <h3 style="color: #2c3e50; margin-bottom: 1rem;">Cursos Recientes</h3>
                    <div class="courses-grid">
                        ${courses.slice(0, 3).map(course => `
                            <div class="course-card">
                                <h4>${course.title}</h4>
                                <p class="course-info">Instructor: ${course.instructor}</p>
                                <p class="course-info">Estudiantes: ${course.enrolledStudents ? course.enrolledStudents.length : 0}/${course.capacity}</p>
                                <a href="#/courses" class="btn btn-primary btn-small">
                                    Ver Detalles
                                </a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = dashboardHTML;
        
    } catch (error) {
        console.error('Error al cargar dashboard de admin:', error);
        container.innerHTML = '<div class="container"><div class="alert alert-error">Error al cargar el dashboard</div></div>';
    }
}

/*
 * Renderiza el dashboard del estudiante
 * @param {HTMLElement} container - Contenedor principal
 * @param {Object} user - Datos del usuario
 */
async function renderStudentDashboard(container, user) {
    try {
        // Obtener cursos en los que está inscrito
        const coursesRes = await fetch(`${API_URL}/courses`);
        const allCourses = await coursesRes.json();
        
        // Filtrar cursos donde el estudiante está inscrito
        const enrolledCourses = allCourses.filter(course => 
            course.enrolledStudents && course.enrolledStudents.includes(user.id)
        );
        
        const dashboardHTML = `
            <div class="container">
                <!-- Encabezado del dashboard -->
                <div class="dashboard-header">
                    <h2>Mi Panel de Estudiante</h2>
                    <p>Bienvenido, ${user.name}</p>
                </div>
                
                <!-- Estadísticas del estudiante -->
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <h3>${enrolledCourses.length}</h3>
                        <p>Cursos Inscritos</p>
                    </div>
                    <div class="stat-card">
                        <h3>${allCourses.length - enrolledCourses.length}</h3>
                        <p>Cursos Disponibles</p>
                    </div>
                </div>
                
                <!-- Mis cursos -->
                <div style="margin-top: 2rem;">
                    <h3 style="color: #2c3e50; margin-bottom: 1rem;">Mis Cursos</h3>
                    ${enrolledCourses.length > 0 ? `
                        <div class="courses-grid">
                            ${enrolledCourses.map(course => `
                                <div class="course-card">
                                    <h4>${course.title}</h4>
                                    <p class="course-info">Categoría: ${course.category}</p>
                                    <p class="course-info">Instructor: ${course.instructor}</p>
                                    <p class="course-description">${course.description}</p>
                                    <button class="btn btn-primary btn-small">
                                        Continuar Aprendiendo
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="alert alert-info">
                            No estás inscrito en ningún curso todavía. 
                            <a href="#/courses" style="color: #0c5460; text-decoration: underline;">
                                Explorar cursos disponibles
                            </a>
                        </div>
                    `}
                </div>
                
                <!-- Acciones -->
                <div style="margin-top: 2rem;">
                    <a href="#/courses" class="btn btn-success">
                        Explorar Más Cursos
                    </a>
                </div>
            </div>
        `;
        
        container.innerHTML = dashboardHTML;
        
    } catch (error) {
        console.error('Error al cargar dashboard de estudiante:', error);
        container.innerHTML = '<div class="container"><div class="alert alert-error">Error al cargar el dashboard</div></div>';
    }
}