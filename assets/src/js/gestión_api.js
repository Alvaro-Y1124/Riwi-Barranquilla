// API to connect with json-server and db.json
// This class helps us talk to the server
class InformationAPI {
  constructor() {
    // This is the web address where our data is stored
    this.baseUrl = "http://localhost:3000/information";
  }

  /**
   * GET - Get all information from the server
   * This function gets all the information from the database
   */
  async getInformation() {
    try {
      // Ask the server for all information
      const response = await fetch(this.baseUrl);
      // Check if the server answered correctly
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Get the data from the server
      const data = await response.json();
      return data;
    } catch (error) {
      // If there is a connection problem
      if (error instanceof TypeError) {
        console.error("Network error - Is json-server running?");
        throw new Error(
          "Connection error. Make sure json-server is running on port 3000."
        );
      } else {
        console.error("Error getting data:", error);
        throw error;
      }
    }
  }

  /**
   * POST - Add new information to the server
   * This function adds new information to the database
   */
  async postInformation(information) {
    try {
      // Send new information to the server
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(information),
      });

      // Check if the server answered correctly
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response from the server
      const data = await response.json();
      return data;
    } catch (error) {
      // If there is a connection problem
      if (error instanceof TypeError) {
        console.error("Network error - Is json-server running?");
        throw new Error(
          "Connection error. Make sure json-server is running on port 3000."
        );
      } else {
        console.error("Error adding information:", error);
        throw error;
      }
    }
  }

  /**
   * PUT - Update existing information on the server
   * This function changes information that already exists
   */
  async putInformation(id, information) {
    try {
      // Send updated information to the server
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(information),
      });

      // Check if the server answered correctly
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Get the response from the server
      const data = await response.json();
      return data;
    } catch (error) {
      // If there is a connection problem
      if (error instanceof TypeError) {
        console.error("Network error - Is json-server running?");
        throw new Error(
          "Connection error. Make sure json-server is running on port 3000."
        );
      } else {
        console.error("Error updating information:", error);
        throw error;
      }
    }
  }

  /**
   * DELETE - Remove information from the server
   * This function deletes information from the database
   */
  async deleteInformation(id) {
    try {
      // Ask the server to delete the information
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
      });

      // Check if the server answered correctly
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // json-server returns an empty object when delete is successful
      return { success: true };
    } catch (error) {
      // If there is a connection problem
      if (error instanceof TypeError) {
        console.error("Network error - Is json-server running?");
        throw new Error(
          "Connection error. Make sure json-server is running on port 3000."
        );
      } else {
        console.error("Error deleting information:", error);
        throw error;
      }
    }
  }
}

// Create an instance of the API class
const api = new InformationAPI();

// Get HTML elements from the page
const formulario = document.getElementById("formulario");
const inputInformacion = document.getElementById("informacion");
const listaInformacion = document.getElementById("lista-informacion");
const alertas = document.getElementById("alertas");
const modalEditar = document.getElementById("modal-editar");
const formEditar = document.getElementById("form-editar");
const editInformacion = document.getElementById("edit-informacion");
const editId = document.getElementById("edit-id");
const emptyState = document.getElementById("empty-state");
const tablaContainer = document.getElementById("tabla-container");

/**
 * Show alert messages to the user
 * This function shows messages on the screen
 */
function mostrarAlerta(mensaje, tipo = "success") {
  // Create a new alert element
  const alerta = document.createElement("div");
  alerta.className = `alert alert-${tipo}`;
  alerta.textContent = mensaje;
  alertas.appendChild(alerta);

  // Remove the alert after 3 seconds
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

/**
 * Update the display based on data
 * This function shows or hides the table based on data
 */
function actualizarVisualizacion(lista) {
  // If there is no data, show empty message
  if (lista.length === 0) {
    tablaContainer.style.display = "none";
    emptyState.style.display = "block";
  } else {
    // If there is data, show the table
    tablaContainer.style.display = "block";
    emptyState.style.display = "none";
  }
}

/**
 * Load data from the server
 * This function gets all data and shows it on the page
 */
async function cargarDatos() {
  try {
    // Get all information from the server
    const lista = await api.getInformation();
    // Create the table with the data
    crearTabla(lista);
    // Update what the user sees
    actualizarVisualizacion(lista);
  } catch (error) {
    // Show error message if something goes wrong
    mostrarAlerta(error.message || "Error al cargar los datos", "error");
  }
}

/**
 * Create the table with all information
 * This function makes the table with all the data
 */
function crearTabla(lista) {
  // Clear the table first
  listaInformacion.innerHTML = "";
  // Add each piece of information to the table
  lista.forEach((informacion) => {
    crearFila(informacion);
  });
}

/**
 * Create a row in the table
 * This function makes one row in the table
 */
function crearFila(informacion) {
  // Create a new table row
  const tr = document.createElement("tr");

  // Create cell for ID
  const tdId = document.createElement("td");
  tdId.textContent = informacion.id;

  // Create cell for name
  const tdNombre = document.createElement("td");
  tdNombre.textContent = informacion.nombre;

  // Create cell for action buttons
  const tdAcciones = document.createElement("td");
  tdAcciones.className = "actions";

  // Create edit button
  const btnEditar = document.createElement("button");
  btnEditar.className = "btn btn-success btn-sm";
  btnEditar.innerHTML = "✏️ Editar";
  btnEditar.addEventListener("click", () =>
    editarInformacion(informacion.id, informacion.nombre)
  );

  // Create delete button
  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn btn-danger btn-sm";
  btnEliminar.innerHTML = "🗑️ Eliminar";
  btnEliminar.addEventListener("click", () =>
    eliminarInformacion(informacion.id)
  );

  // Add buttons to the actions cell
  tdAcciones.appendChild(btnEditar);
  tdAcciones.appendChild(btnEliminar);

  // Add cells to the row
  tr.appendChild(tdId);
  tr.appendChild(tdNombre);
  tr.appendChild(tdAcciones);

  // Add row to the table
  listaInformacion.appendChild(tr);
}

/**
 * Check if information already exists
 * This function looks for duplicate information
 */
async function verificarDuplicado(nombre) {
  try {
    // Get all information from the server
    const lista = await api.getInformation();
    // Look for information with the same name
    return lista.find(
      (item) => item.nombre.toLowerCase() === nombre.toLowerCase()
    );
  } catch (error) {
    return null;
  }
}

/**
 * Add new information
 * This function runs when the form is submitted
 */
formulario.addEventListener("submit", async (event) => {
  // Stop the form from submitting normally
  event.preventDefault();

  // Get the information from the form
  const informacion = {
    nombre: inputInformacion.value.trim(),
  };

  // Check if the information is valid
  if (!informacion.nombre) {
    mostrarAlerta("Por favor ingrese información válida", "error");
    return;
  }

  try {
    // Check if this information already exists
    const existente = await verificarDuplicado(informacion.nombre);

    if (existente) {
      // Ask the user if they want to update existing information
      const confirmar = confirm(
        `La información "${informacion.nombre}" ya existe.\n\n¿Desea actualizarla?`
      );

      if (confirmar) {
        // Update the existing information
        await api.putInformation(existente.id, informacion);
        mostrarAlerta("Información actualizada exitosamente");
        inputInformacion.value = "";
        cargarDatos();
      } else {
        mostrarAlerta("Operación cancelada", "error");
      }
    } else {
      // Add new information
      await api.postInformation(informacion);
      mostrarAlerta("Información agregada exitosamente");
      inputInformacion.value = "";
      cargarDatos();
    }
  } catch (error) {
    mostrarAlerta(error.message || "Error al procesar información", "error");
  }
});

/**
 * Edit information
 * This function opens the edit modal
 */
function editarInformacion(id, nombre) {
  // Set the values in the edit form
  editId.value = id;
  editInformacion.value = nombre;
  // Show the edit modal
  modalEditar.style.display = "block";
}

/**
 * Update information
 * This function runs when the edit form is submitted
 */
formEditar.addEventListener("submit", async (event) => {
  // Stop the form from submitting normally
  event.preventDefault();

  // Get the values from the edit form - AQUÍ ESTÁ EL FIX: No usar parseInt()
  const id = editId.value; // Mantener como string
  const informacion = {
    nombre: editInformacion.value.trim(),
  };


  // Check if the information is valid
  if (!informacion.nombre) {
    mostrarAlerta("Por favor ingrese información válida", "error");
    return;
  }

  try {
    // Check if another record has the same name
    const existente = await verificarDuplicado(informacion.nombre);

    if (existente && existente.id !== id) {
      mostrarAlerta(
        `La información "${informacion.nombre}" ya existe en otro registro`,
        "error"
      );
      return;
    }

    // Update the information
    await api.putInformation(id, informacion);
    mostrarAlerta("Información actualizada exitosamente");
    cerrarModal();
    cargarDatos();
  } catch (error) {
    console.error("Error al actualizar:", error);
    mostrarAlerta(error.message || "Error al actualizar información", "error");
  }
});

/**
 * Delete information
 * This function removes information from the database
 */
async function eliminarInformacion(id) {

  // Ask the user if they are sure
  if (confirm("¿Está seguro de que desea eliminar esta información?")) {
    try {
      // Delete the information
      await api.deleteInformation(id);
      mostrarAlerta("Información eliminada exitosamente");
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      mostrarAlerta(error.message || "Error al eliminar información", "error");
    }
  }
}

/**
 * Close the edit modal
 * This function hides the edit modal and clears the form
 */
function cerrarModal() {
  // Hide the modal
  modalEditar.style.display = "none";
  // Clear the form
  editInformacion.value = "";
  editId.value = "";
}

// Add click event to the close button
document.querySelector(".close").addEventListener("click", cerrarModal);

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === modalEditar) {
    cerrarModal();
  }
});

// Load data when the page starts
document.addEventListener("DOMContentLoaded", cargarDatos);