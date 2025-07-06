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
function showAlert(message, type = "success") {
  // Create a new alert element
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alertas.appendChild(alert);

  // Remove the alert after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

/**
 * Update the display based on data
 * This function shows or hides the table based on data
 */
function updateView(list) {
  // If there is no data, show empty message
  if (list.length === 0) {
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
async function loadData() {
  try {
    // Get all information from the server
    const list = await api.getInformation();
    // Create the table with the data
    createTable(list);
    // Update what the user sees
    updateView(list);
  } catch (error) {
    // Show error message if something goes wrong
    showAlert(error.message || "Error loading data", "error");
  }
}

/**
 * Create the table with all information
 * This function makes the table with all the data
 */
function createTable(list) {
  // Clear the table first
  listaInformacion.innerHTML = "";
  // Add each piece of information to the table
  list.forEach((information) => {
    createRow(information);
  });
}

/**
 * Create a row in the table
 * This function makes one row in the table
 */
function createRow(information) {
  // Create a new table row
  const tr = document.createElement("tr");

  // Create cell for ID
  const tdId = document.createElement("td");
  tdId.textContent = information.id;

  // Create cell for name
  const tdName = document.createElement("td");
  tdName.textContent = information.nombre;

  // Create cell for action buttons
  const tdActions = document.createElement("td");
  tdActions.className = "actions";

  // Create edit button
  const btnEdit = document.createElement("button");
  btnEdit.className = "btn btn-success btn-sm";
  btnEdit.innerHTML = "✏️ Edit";
  btnEdit.addEventListener("click", () =>
    editInformation(information.id, information.nombre)
  );

  // Create delete button
  const btnDelete = document.createElement("button");
  btnDelete.className = "btn btn-danger btn-sm";
  btnDelete.innerHTML = "🗑️ Delete";
  btnDelete.addEventListener("click", () =>
    deleteInformation(information.id)
  );

  // Add buttons to the actions cell
  tdActions.appendChild(btnEdit);
  tdActions.appendChild(btnDelete);

  // Add cells to the row
  tr.appendChild(tdId);
  tr.appendChild(tdName);
  tr.appendChild(tdActions);

  // Add row to the table
  listaInformacion.appendChild(tr);
}

/**
 * Check if information already exists
 * This function looks for duplicate information
 */
async function checkDuplicate(name) {
  try {
    // Get all information from the server
    const list = await api.getInformation();
    // Look for information with the same name
    return list.find(
      (item) => item.nombre.toLowerCase() === name.toLowerCase()
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
  const information = {
    nombre: inputInformacion.value.trim(),
  };

  // Check if the information is valid
  if (!information.nombre) {
    showAlert("Please enter valid information", "error");
    return;
  }

  try {
    // Check if this information already exists
    const existing = await checkDuplicate(information.nombre);

    if (existing) {
      // Ask the user if they want to update existing information
      const confirm = window.confirm(
        `The information "${information.nombre}" already exists.\n\nDo you want to update it?`
      );

      if (confirm) {
        // Update the existing information
        await api.putInformation(existing.id, information);
        showAlert("Information updated successfully");
        inputInformacion.value = "";
        loadData();
      } else {
        showAlert("Operation cancelled", "error");
      }
    } else {
      // Add new information
      await api.postInformation(information);
      showAlert("Information added successfully");
      inputInformacion.value = "";
      loadData();
    }
  } catch (error) {
    showAlert(error.message || "Error processing information", "error");
  }
});

/**
 * Edit information
 * This function opens the edit modal
 */
function editInformation(id, name) {
  // Set the values in the edit form
  editId.value = id;
  editInformacion.value = name;
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

  // Get the values from the edit form - Keep as string
  const id = editId.value; // Keep as string
  const information = {
    nombre: editInformacion.value.trim(),
  };

  // Check if the information is valid
  if (!information.nombre) {
    showAlert("Please enter valid information", "error");
    return;
  }

  try {
    // Check if another record has the same name
    const existing = await checkDuplicate(information.nombre);

    if (existing && existing.id !== id) {
      showAlert(
        `The information "${information.nombre}" already exists in another record`,
        "error"
      );
      return;
    }

    // Update the information
    await api.putInformation(id, information);
    showAlert("Information updated successfully");
    closeModal();
    loadData();
  } catch (error) {
    console.error("Error updating:", error);
    showAlert(error.message || "Error updating information", "error");
  }
});

/**
 * Delete information
 * This function removes information from the database
 */
async function deleteInformation(id) {
  // Ask the user if they are sure
  if (confirm("Are you sure you want to delete this information?")) {
    try {
      // Delete the information
      await api.deleteInformation(id);
      showAlert("Information deleted successfully");
      loadData();
    } catch (error) {
      console.error("Error deleting:", error);
      showAlert(error.message || "Error deleting information", "error");
    }
  }
}

/**
 * Close the edit modal
 * This function hides the edit modal and clears the form
 */
function closeModal() {
  // Hide the modal
  modalEditar.style.display = "none";
  // Clear the form
  editInformacion.value = "";
  editId.value = "";
}

// Add click event to the close button
document.querySelector(".close").addEventListener("click", closeModal);

// Close modal when clicking outside of it
window.addEventListener("click", (event) => {
  if (event.target === modalEditar) {
    closeModal();
  }
});

// Load data when the page starts
document.addEventListener("DOMContentLoaded", loadData);
