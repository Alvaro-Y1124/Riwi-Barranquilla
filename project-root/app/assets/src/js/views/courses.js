/*
 * =============================================
 * VISTA DE CURSOS
 * =============================================
 * Gestión completa de cursos para administradores
 * y vista de cursos disponibles para estudiantes
 * =============================================
 */

import { getUser, hasRole } from '../controllers/auth.js';
import { API_URL, ROLES, COURSE_CATEGORIES } from '../controllers/config.js';
import { showMessage } from '../utils/messages.js';
import { createModal } from '../components/modal.js';

/*
 * Función principal para renderizar la vista de cursos
 */
export async function renderCourses() {
    const mainContent = document.querySelector('.main-content');
    const user = getUser();
    
    if (!user) {
        window.location.hash = '#/login';
        return;
    }
    
    if (!mainContent) {
        console.error('No se encontró el contenedor main-content');
        return;
    }
    
    // Renderizar según el rol del usuario
    if (hasRole(ROLES.ADMIN)) {
        await renderAdminCoursesView(mainContent, user);
    } else {
        await renderStudentCoursesView(mainContent, user);
    }
}

/*
 * Vista de cursos para administradores
 * @param {HTMLElement} container - Contenedor principal
 * @param {Object} user - Datos del usuario
 */
async function renderAdminCoursesView(container, user) {
    try {
        // Obtener todos los cursos
        const response = await fetch(`${API_URL}/courses`);
        const courses = await response.json();
        
        const coursesHTML = `
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                    <h2>Gestión de eventos</h2>
                    <button class="btn btn-success" id="createCourseBtn">
                        Crear Nuevo Curso
                    </button>
                </div>
                
                <!-- Lista de eventos -->
                <div class="courses-grid">
                    ${courses.map(course => `
                        <div class="course-card" id="course-${course.id}">
                            <h3>${course.title}</h3>
                            <p class="course-info">
                                <strong>Categoría:</strong> ${course.category}
                            </p>
                            <p class="course-info">
                                <strong>Instructor:</strong> ${course.instructor}
                            </p>
                            <p class="course-info">
                                <strong>Capacidad:</strong> ${course.enrolledStudents ? course.enrolledStudents.length : 0}/${course.capacity}
                            </p>
                            <p class="course-description">${course.description}</p>
                            
                            <div class="course-actions">
                                <button class="btn btn-primary" onclick="editCourse(${course.id})">
                                    Editar
                                </button>
                                <button class="btn btn-secondary" onclick="viewStudents(${course.id})">
                                    Ver participantes
                                </button>
                                <button class="btn btn-danger" onclick="deleteCourse(${course.id})">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                ${courses.length === 0 ? `
                    <div class="alert alert-info" style="margin-top: 2rem;">
                        No hay eventos creados todavía. Haz clic en "Crear Nuevo eventos" para comenzar.
                    </div>
                ` : ''}
            </div>
        `;
        
        container.innerHTML = coursesHTML;
        
        // Agregar evento al botón de crear curso
        document.getElementById('createCourseBtn').addEventListener('click', () => {
            showCourseModal();
        });
        
        // Hacer funciones globales para los botones
        window.editCourse = (id) => showCourseModal(id);
        window.deleteCourse = deleteCourse;
        window.viewStudents = viewStudents;
        
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        container.innerHTML = '<div class="container"><div class="alert alert-error">Error al cargar los eventos</div></div>';
    }
}

/*
 * Vista de cursos para estudiantes
 * @param {HTMLElement} container - Contenedor principal
 * @param {Object} user - Datos del usuario
 */
async function renderStudentCoursesView(container, user) {
    try {
        // Obtener todos los cursos
        const response = await fetch(`${API_URL}/courses`);
        const courses = await response.json();
        
        const coursesHTML = `
            <div class="container">
                <h2>Eventos Disponibles</h2>
                
                <!-- Filtros (opcional para futuras mejoras) -->
                <div style="margin: 2rem 0;">
                    <div id="messageContainer"></div>
                </div>
                
                <!-- Lista de eventos -->
                <div class="courses-grid">
                    ${courses.map(course => {
                        const isEnrolled = course.enrolledStudents && course.enrolledStudents.includes(user.id);
                        const isFull = course.enrolledStudents && course.enrolledStudents.length >= course.capacity;
                        
                        return `
                            <div class="course-card">
                                <h3>${course.title}</h3>
                                <p class="course-info">
                                    <strong>Categoría:</strong> ${course.category}
                                </p>
                                <p class="course-info">
                                    <strong>Instructor:</strong> ${course.instructor}
                                </p>
                                <p class="course-info">
                                    <strong>Cupos:</strong> ${course.enrolledStudents ? course.enrolledStudents.length : 0}/${course.capacity}
                                </p>
                                <p class="course-description">${course.description}</p>
                                
                                <div class="course-actions">
                                    ${isEnrolled ? `
                                        <button class="btn btn-secondary" disabled>
                                            Ya estás inscrito
                                        </button>
                                    ` : isFull ? `
                                        <button class="btn btn-danger" disabled>
                                            Sin cupos disponibles
                                        </button>
                                    ` : `
                                        <button class="btn btn-success" onclick="enrollInCourse(${course.id})">
                                            Inscribirse
                                        </button>
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = coursesHTML;
        
        // Hacer función global para inscribirse
        window.enrollInCourse = enrollInCourse;
        
    } catch (error) {
        console.error('Error al cargar cursos:', error);
        container.innerHTML = '<div class="container"><div class="alert alert-error">Error al cargar el evento</div></div>';
    }
}

/*
 * Muestra el modal para crear/editar curso
 * @param {number} courseId - ID del curso a editar (opcional)
 */
async function showCourseModal(courseId = null) {
    let course = null;
    
    // Si hay ID, obtener datos del curso
    if (courseId) {
        try {
            const response = await fetch(`${API_URL}/courses/${courseId}`);
            course = await response.json();
        } catch (error) {
            console.error('Error al obtener curso:', error);
            return;
        }
    }
    
    const modalContent = `
        <h3>${course ? 'Editar eventos' : 'Crear Nuevos eventos'}</h3>
        <form id="courseForm">
            <div class="form-group">
                <label for="title">Título del evento:</label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    value="${course ? course.title : ''}"
                    required
                    placeholder="Ej: Introducción a JavaScript"
                >
            </div>
            
            <div class="form-group">
                <label for="category">Categoría:</label>
                <select id="category" name="category" required>
                    <option value="">Selecciona una categoría</option>
                    ${COURSE_CATEGORIES.map(cat => `
                        <option value="${cat}" ${course && course.category === cat ? 'selected' : ''}>
                            ${cat}
                        </option>
                    `).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="instructor">Instructor:</label>
                <input 
                    type="text" 
                    id="instructor" 
                    name="instructor" 
                    value="${course ? course.instructor : ''}"
                    required
                    placeholder="Nombre del instructor"
                >
            </div>
            
            <div class="form-group">
                <label for="capacity">Capacidad Máxima:</label>
                <input 
                    type="number" 
                    id="capacity" 
                    name="capacity" 
                    value="${course ? course.capacity : ''}"
                    min="1"
                    max="100"
                    required
                    placeholder="Número máximo de paraticipantes"
                >
            </div>
            
            <div class="form-group">
                <label for="description">Descripción:</label>
                <textarea 
                    id="description" 
                    name="description" 
                    required
                    placeholder="Describe el contenido del evento..."
                >${course ? course.description : ''}</textarea>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">
                    Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                    ${course ? 'Actualizar' : 'Crear'} Curso
                </button>
            </div>
        </form>
    `;
    
    // Crear y mostrar el modal
    createModal(modalContent);
    
    // Manejar el envío del formulario
    document.getElementById('courseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const courseData = {
            title: formData.get('title'),
            category: formData.get('category'),
            instructor: formData.get('instructor'),
            capacity: parseInt(formData.get('capacity')),
            description: formData.get('description'),
            enrolledStudents: course ? course.enrolledStudents : []
        };
        
        try {
            const url = course ? `${API_URL}/courses/${courseId}` : `${API_URL}/courses`;
            const method = course ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });
            
            if (!response.ok) throw new Error('Error al guardar evento');
            
            // Cerrar modal y recargar cursos
            closeModal();
            await renderCourses();
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error al guardar el evento');
        }
    });
}

/*
 * Eliminar un curso
 * @param {number} courseId - ID del curso a eliminar
 */
async function deleteCourse(courseId) {
    if (!confirm('¿Estás seguro de eliminar este evento?')) return;
    
    try {
        const response = await fetch(`${API_URL}/courses/${courseId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar el evento');
        
        // Recargar cursos
        await renderCourses();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el evento');
    }
}

/*
 * Ver estudiantes inscritos en un curso
 * @param {number} courseId - ID del curso
 */
async function viewStudents(courseId) {
    try {
        // Obtener información del curso
        const courseResponse = await fetch(`${API_URL}/courses/${courseId}`);
        const course = await courseResponse.json();
        
        // Obtener información de los estudiantes
        const usersResponse = await fetch(`${API_URL}/users`);
        const users = await usersResponse.json();
        
        // Filtrar estudiantes inscritos
        const enrolledStudents = users.filter(user => 
            course.enrolledStudents && course.enrolledStudents.includes(user.id)
        );
        
        const modalContent = `
            <h3>Estudiantes Inscritos - ${course.title}</h3>
            
            ${enrolledStudents.length > 0 ? `
                <div class="students-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${enrolledStudents.map(student => `
                                <tr>
                                    <td>${student.name}</td>
                                    <td>${student.email}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            ` : `
                <div class="alert alert-info">
                    No hay personas inscritas en este evento todavía.
                </div>
            `}
            
            <div style="margin-top: 1.5rem; text-align: right;">
                <button class="btn btn-secondary" onclick="closeModal()">
                    Cerrar
                </button>
            </div>
        `;
        
        createModal(modalContent);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al obtener participantes');
    }
}

/*
 * Inscribir estudiante en un curso
 * @param {number} courseId - ID del curso
 */
async function enrollInCourse(courseId) {
    const user = getUser();
    
    try {
        // Obtener información del curso
        const courseResponse = await fetch(`${API_URL}/courses/${courseId}`);
        const course = await courseResponse.json();
        
        // Verificar si ya está inscrito
        if (course.enrolledStudents && course.enrolledStudents.includes(user.id)) {
            showMessage('messageContainer', 'Ya estás inscrito en este evento', 'error');
            return;
        }
        
        // Verificar capacidad
        if (course.enrolledStudents && course.enrolledStudents.length >= course.capacity) {
            showMessage('messageContainer', 'No hay cupos disponibles', 'error');
            return;
        }
        
        // Agregar estudiante al curso
        const updatedEnrollments = course.enrolledStudents ? [...course.enrolledStudents, user.id] : [user.id];
        
        const response = await fetch(`${API_URL}/courses/${courseId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                enrolledStudents: updatedEnrollments
            })
        });
        
        if (!response.ok) throw new Error('Error al inscribirse');
        
        showMessage('messageContainer', 'Inscripción exitosa', 'success');
        
        // Recargar vista después de 1 segundo
        setTimeout(() => {
            renderCourses();
        }, 1000);
        
    } catch (error) {
        console.error('Error:', error);
        showMessage('messageContainer', 'Error al inscribirse en el evento', 'error');
    }
}

/*
 * Función para cerrar el modal
 */
window.closeModal = function() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
};