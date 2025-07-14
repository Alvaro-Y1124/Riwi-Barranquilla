/*
 * =============================================
 * UTILIDAD PARA MOSTRAR MENSAJES
 * =============================================
 * Funciones helper para mostrar mensajes de
 * éxito, error e información al usuario
 * =============================================
 */

/*
 * Muestra un mensaje en un contenedor específico
 * @param {string} containerId - ID del contenedor donde mostrar el mensaje
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de mensaje ('success', 'error', 'info')
 */
export function showMessage(containerId, message, type = 'info') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Contenedor ${containerId} no encontrado`);
        return;
    }
    
    // Determinar la clase CSS según el tipo
    let alertClass = 'alert-info';
    if (type === 'success') alertClass = 'alert-success';
    if (type === 'error') alertClass = 'alert-error';
    
    // Crear el elemento de mensaje
    const messageElement = document.createElement('div');
    messageElement.className = `alert ${alertClass}`;
    messageElement.textContent = message;
    
    // Limpiar mensajes anteriores
    container.innerHTML = '';
    
    // Agregar el nuevo mensaje
    container.appendChild(messageElement);
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        messageElement.remove();
    }, 5000);
}