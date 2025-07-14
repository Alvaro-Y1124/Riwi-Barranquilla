// Create event view - Admin only functionality
import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { API } from '../api.js';
import { Header } from '../components/header.js';

export const CreateEventView = {
    render(container) {
        const user = Auth.getCurrentUser();
        
        // Only admins can create events
        if (!user || user.role !== 'admin') {
            Router.navigate('/not-found');
            return;
        }

        container.innerHTML = `
            ${Header.render()}
            <main class="main-content">
                <div class="container">
                    <h1 class="page-title">Create New Event</h1>
                    <div class="form-container">
                        <form id="createEventForm">
                            <div class="form-group">
                                <label for="title">Event Title:</label>
                                <input type="text" id="title" name="title" required>
                            </div>
                            <div class="form-group">
                                <label for="description">Description:</label>
                                <textarea id="description" name="description" required></textarea>
                            </div>
                            <div class="form-group">
                                <label for="date">Date:</label>
                                <input type="date" id="date" name="date" required>
                            </div>
                            <div class="form-group">
                                <label for="time">Time:</label>
                                <input type="time" id="time" name="time" required>
                            </div>
                            <div class="form-group">
                                <label for="location">Location:</label>
                                <input type="text" id="location" name="location" required>
                            </div>
                            <div class="form-group">
                                <label for="capacity">Capacity:</label>
                                <input type="number" id="capacity" name="capacity" min="1" required>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Create Event</button>
                                <button type="button" class="btn btn-secondary" onclick="CreateEventView.goBack()">Cancel</button>
                            </div>
                            <div id="error-message" class="error-message"></div>
                            <div id="success-message" class="success-message"></div>
                        </form>
                    </div>
                </div>
            </main>
        `;

        this.bindEvents();
        
        // Set minimum date to today
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    },

    bindEvents() {
        const form = document.getElementById('createEventForm');
        form.addEventListener('submit', this.handleCreateEvent.bind(this));
    },

    async handleCreateEvent(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const eventData = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            capacity: parseInt(formData.get('capacity'))
        };
        
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');
        
        // Clear previous messages
        errorDiv.textContent = '';
        successDiv.textContent = '';
        
        try {
            await API.createEvent(eventData);
            successDiv.textContent = 'Event created successfully!';
            
            // Clear form
            event.target.reset();
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                Router.navigate('/dashboard');
            }, 1500);
            
        } catch (error) {
            errorDiv.textContent = 'Failed to create event. Please try again.';
        }
    },

    goBack() {
        Router.navigate('/dashboard');
    }
};