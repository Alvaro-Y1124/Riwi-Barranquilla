/*
 * =============================================
 * COMPONENTE DE MODAL
 * =============================================
 * Modal reutilizable para mostrar formularios
 * y contenido en una ventana emergente
 * =============================================
 */

/*
 * Función para crear y mostrar un modal
 * @param {string} content - Contenido HTML del modal
 */
export function createModal(content) {
    // Verificar si ya existe un modal y eliminarlo
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Crear estructura del modal
    const modal = document.createElement('div');
    modal.className = 'modal active';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <button class="modal-close" onclick="closeModal()">×</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Cerrar modal con ESC
    document.addEventListener('keydown', handleEscKey);
}

/*
 * Función para manejar la tecla ESC
 * @param {KeyboardEvent} e - Evento del teclado
 */
function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

/*
 * Función global para cerrar el modal
 */
window.closeModal = function() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
        document.removeEventListener('keydown', handleEscKey);
    }
};