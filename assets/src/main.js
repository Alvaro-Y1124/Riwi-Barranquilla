/**
 * DATA PERSISTENCE SYSTEM WITH DOM
 * 
 * This system implements the following functionalities:
 * 1. User data capture and validation * 2.
 * 2. Storage in Local Storage
 * Data retrieval and visualization
 Session Storage interaction counter * 5.
 * 5. Cleanup of stored data
*/


const userForm = document.getElementById('userForm');
const userNameInput = document.getElementById('userName');
const userAgeInput = document.getElementById('userAge');
const saveDataBtn = document.getElementById('saveDataBtn');
const clearDataBtn = document.getElementById('clearDataBtn');
const outputDiv = document.getElementById('output');
const counterValueSpan = document.getElementById('counterValue');
const messageContainer = document.getElementById('messageContainer');
const nameError = document.getElementById('nameError');
const ageError = document.getElementById('ageError');

// Keys to storage
const LOCAL_STORAGE_KEY = 'userData';
const SESSION_STORAGE_KEY = 'interactionCount';

/**
 * VALIDATION FUNCTIONS

 * Validates that the user name is valid
 * @param {string} name - Name to be validated
 * @returns {boolean} - True if valid, false if not
*/

function validateName(name) {
    // Remove leading and trailing blanks
    const trimmedName = name.trim();

     // Check that it is not empty and has at least 2 characters

    if (trimmedName.length < 2) {
        return false;
    }

    // Verify that it contains only letters and spaces
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(trimmedName);
}

/**
 * Validate that the user's age is valid.
 * @param {string} age - Age to be validated
 * @returns {boolean} - True if valid, false if not
*/
function validateAge(age) {
    // Convert to number
    const numAge = parseInt(age);

    // Verify that it is a valid number and is in the correct range
    return !isNaN(numAge) && numAge >= 1 && numAge <= 120;
}

/**
 * Display error messages in the corresponding fields
 * @param {string} field - Field to display error in (‘name’ or ‘age’)
 * @param {string} message - Error message to show
*/
function showFieldError(field, message) {
    const errorElement = field === 'name' ? nameError : ageError;
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

/**
 * Clears all error messages
*/
function clearErrors() {
    nameError.textContent = '';
    nameError.style.display = 'none';
    ageError.textContent = '';
    ageError.style.display = 'none';
}


/**
 * STORAGE FUNCTIONS
 * Saves user data to Local Storage
 * @param {string} name - User's name
 * @param {number} age - User's age
*/
function saveUserData(name, age) {
    try {
    
        const userData = {
            name: name.trim(),
            age: parseInt(age),
            savedAt: new Date().toISOString()
        };

        // Save to Local Storage as JSON
        const userDataJson = JSON.stringify(userData);
        localStorage.setItem(LOCAL_STORAGE_KEY, userDataJson);

        showMessage('Data successfully saved', 'success');

    } catch (error) {
        console.error('Error saving data:', error);
        showMessage('Error saving data', 'error');
    }
}

/**
 * Retrieves user data from Local Storage
 * @returns {Object|null} - User data or null if nonexistent
*/
function getUserData() {
    try {
        const userDataJson = localStorage.getItem(LOCAL_STORAGE_KEY);

        if (!userDataJson) {
            return null;
        }

        return JSON.parse(userDataJson);

    } catch (error) {
        console.error('Error retrieving data:', error);
        return null;
    }
}

/**
 * Removes user data from Local Storage
*/
function clearUserData() {
    try {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        showMessage('Data successfully deleted', 'success');

    } catch (error) {
        console.error('Error al eliminar datos:', error);
        showMessage('Error while deleting data', 'error');
    }
}


/**
 * INTERACTION COUNTER FUNCTIONS
 * Increments the interaction counter in Session Storage
*/

function incrementInteractionCounter() {
    try {
        let currentCount = parseInt(sessionStorage.getItem(SESSION_STORAGE_KEY) || '0');
        currentCount++;

        sessionStorage.setItem(SESSION_STORAGE_KEY, currentCount.toString());

        // Update the display
        updateCounterDisplay();

    } catch (error) {
        console.error('Error incrementing counter:', error);
    }
}


/**
 * Gets the current counter of interactions.
 * @returns {number} - Number of interactions
*/
function getInteractionCount() {
    try {
        const count = sessionStorage.getItem(SESSION_STORAGE_KEY) || '0';
        return parseInt(count) || 0;
    } catch (error) {
        console.error('Error obtaining counter:', error);
        return 0;
    }
}

/**
 * Updates the counter display on the page.
*/
function updateCounterDisplay() {
    const count = getInteractionCount();
    counterValueSpan.textContent = count;
}


/**
 * USER INTERFACE FUNCTIONS
 * Displays user data on the page
 * @param {Object} userData - User data to be shown
*/

function displayUserData(userData) {
    if (!userData) {
        outputDiv.innerHTML = '<p class="no-data">No information stored</p>';
        return;
    }

    // Create HTML to display the data
    const savedDate = new Date(userData.savedAt);
    const formattedDate = savedDate.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    outputDiv.innerHTML = `
        <div style="background-color: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
            <h4 style="margin-top: 0; color: #333;">User Information</h4>
            <p><strong>Name:</strong> ${userData.name}</p>
            <p><strong>Age:</strong> ${userData.age} years</p>
            <p><strong>Saved on:</strong> ${formattedDate}</p>
        </div>
    `;
}

/**
 * Displays success or error messages to the user
 * @param {string} message - Message to show
 * @param {string} type - Type of message (‘success’ or ‘error’)
*/
function showMessage(message, type) {
    const messageClass = type === 'success' ? 'success-message' : 'error-message';

    messageContainer.innerHTML = `
        <div class="${messageClass}" style="margin-top: 10px; padding: 10px; border-radius: 5px; background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};">
            ${message}
        </div>
    `;

    // Clear message after 3 seconds
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}


/**
 * EVENT HANDLERS
 * Handles the save data event
*/
function handleSaveData() {
    // Increase interaction counter
    incrementInteractionCounter();

    clearErrors();

    // Get values from the form
    const name = userNameInput.value;
    const age = userAgeInput.value;

    let hasErrors = false;

    // Validate name
    if (!validateName(name)) {
        showFieldError('name', 'Please enter a valid name (minimum 2 characters, only letters)');
        hasErrors = true;
    }

    // Validate age
    if (!validateAge(age)) {
        showFieldError('age', 'Please enter a valid age (between 1 and 120 years)');
        hasErrors = true;
    }

    if (hasErrors) {
        return;
    }

    // Save the data
    saveUserData(name, age);

    // Update the display
    displayUserData(getUserData());

    userForm.reset();
}

/**
 * Handles data clearing event
 * Increment interaction counter
 * Clear data from Local Storage
 * Refresh display
 * Clear errors and messages
 * Clear the form
*/
function handleClearData() {

    incrementInteractionCounter();

    clearUserData();

    displayUserData(null);

    clearErrors();

    userForm.reset();
}

/**
 * Handles the interaction events for the counter.
*/
function handleInteraction() {
    incrementInteractionCounter();
}


/**
 * FUNCIÓN DE INICIALIZACIÓN
 * Inicializa la aplicación cuando se carga la página
 * Cargar y mostrar datos existentes con displayUserData(userData)
 * 
*/
function initializeApp() {
    const userData = getUserData();
    displayUserData(userData);

    updateCounterDisplay();

    // Configure button events
    saveDataBtn.addEventListener('click', handleSaveData);
    clearDataBtn.addEventListener('click', handleClearData);


    userNameInput.addEventListener('input', handleInteraction);
    userAgeInput.addEventListener('input', handleInteraction);

    // Configure real-time validation
    userNameInput.addEventListener('blur', function () {
        if (this.value && !validateName(this.value)) {
            showFieldError('name', 'Invalid name');
        } else {
            nameError.style.display = 'none';
        }
    });

    userAgeInput.addEventListener('blur', function () {
        if (this.value && !validateAge(this.value)) {
            showFieldError('age', 'Invalid age');
        } else {
            ageError.style.display = 'none';
        }
    });

    userForm.addEventListener('submit', function (event) {
        event.preventDefault();
        handleSaveData();
    });

}


document.addEventListener('DOMContentLoaded', initializeApp);

// Initialize immediately if the DOM is already ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}