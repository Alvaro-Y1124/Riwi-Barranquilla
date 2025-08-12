document.addEventListener('DOMContentLoaded', () => {
    // apiUrl to consume the api
    const apiUrl = 'http://localhost:3001/customers';
    
    const customerForm = document.getElementById('customer-form');
    const customersTableBody = document.querySelector('#customers-table tbody');
    const customerIdInput = document.getElementById('customer-id');
    const cancelEditBtn = document.getElementById('cancel-edit');
    const searchInput = document.getElementById('search-identification');
    const searchBtn = document.getElementById('search-btn');
    const resetBtn = document.getElementById('reset-btn');

    // Load all clients on startup
    getCustomers();

    // Event to handle form submission (create and update)
    customerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = customerIdInput.value;
        const customerData = {
            identification_number: document.getElementById('identification_number').value,
            client_names: document.getElementById('client_names').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        };

        if (id) {
            await updateClient(id, customerData);
        } else {
            await createClient(customerData);
        }

        resetForm();
        getCustomers();
    });

    // Button events
    cancelEditBtn.addEventListener('click', () => resetForm());
    searchBtn.addEventListener('click', async () => {
        const identificationNumber = searchInput.value.trim();
        await getCustomers(identificationNumber);
    });
    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        getCustomers();
    });

    //--- Functions to interact with the API ---

    async function getCustomers(identification_number = '') {
        try {
            let url = apiUrl;
            if (identification_number) {
                url += `?identification_number=${identification_number}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                // If the response is not OK, throw an error for the catch to catch.
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            const result = await response.json();
            renderCustomers(result.data);
        } catch (error) {
            console.error('Error getting clients:', error);
            alert('The clients could not be loaded.');
        }
        }

        // function to create the client
    async function createClient(data) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }
            alert('Client created successfully.');
        } catch (error) {
            console.error('Error creating client:', error);
            alert(`Error creating client: ${error.message}`);
        }
    }

    // function to update the client
    async function updateClient(id, data) {
        try {
            const response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || `Error HTTP: ${response.status}`);
            }
            alert('Client updated successfully.');
        } catch (error) {
            console.error('Error updating client:', error);
            alert(`Error updating client: ${error.message}`);
        }
    }

    // function to delete the client
    async function deleteClient(id) {
        if (confirm('Are you sure you want to delete this client?')) {
            try {
                const response = await fetch(`${apiUrl}/${id}`, {
                    method: 'DELETE'
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                    throw new Error(errorData.error || `Error HTTP: ${response.status}`);
                }
                alert('Client successfully deleted.');
                getCustomers(); // Reload list after deleting
            } catch (error) {
                console.error('Error deleting client:', error);
                alert(`Error deleting client:${error.message}`);
            }
        }
    }

    // --- UI Helper Functions ---

    function renderCustomers(customers) {
        customersTableBody.innerHTML = '';
        if (!customers || customers.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 7;
            td.textContent = 'No customers found.';
            td.style.textAlign = 'center';
            tr.appendChild(td);
            customersTableBody.appendChild(tr);
            return;
        }

        customers.forEach(customer => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${customer.id_client}</td>
                <td>${customer.identification_number}</td>
                <td>${customer.client_names}</td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${customer.address}</td>
                <td class="actions-cell">
                    <button class="btn btn-warning" onclick="editClient(${customer.id_client})">Editar</button>
                    <button class="btn btn-danger" onclick="deleteClient(${customer.id_client})">Eliminar</button>
                </td>
            `;
            customersTableBody.appendChild(tr);
        });
    }
    
    window.editClient = async function(id) {
        try {
            const response = await fetch(`${apiUrl}/${id}`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            const result = await response.json();
            const customer = result.data;

            customerIdInput.value = customer.id_client;
            document.getElementById('identification_number').value = customer.identification_number;
            document.getElementById('client_names').value = customer.client_names;
            document.getElementById('phone').value = customer.phone;
            document.getElementById('email').value = customer.email;
            document.getElementById('address').value = customer.address;

            cancelEditBtn.style.display = 'inline-block';
            window.scrollTo(0, 0); 
        } catch(error) {
            console.error('Error getting client data for editing:', error);
            alert('Customer information could not be loaded.');
        }
    }
    
    window.deleteClient = deleteClient;

    function resetForm() {
        customerForm.reset();
        customerIdInput.value = '';
        cancelEditBtn.style.display = 'none';
    }
});