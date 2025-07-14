// Edit event view
import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { API } from '../api.js';
import { Header } from '../components/header.js';

export const EditEventView = {
    event: null,

    async render(container) {
        const user = Auth.getCurrentUser();
        
        // Only admins can edit events
        if (!user || user.role !== 'admin') {
            Router.navigate('/not-found');
            return;
        }

        // Get event ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const eventId = urlParams.get('id');
        
        if (!eventId) {
            Router.navigate('/dashboard');
            return;
        }

        try {
            this.event = await API.getEvent(eventId);
        } catch (error) {
            Router.navigate('/dashboard');
            return;
        }

        container.innerHTML = `
            ${Header.render()}
            <main class="main-content">
                <div class="container">
                    <h1 class="page-title">Edit Event</h1>
                    <div class="form-container">
                        <form id="editEventForm">
                            <div class="form-group">
                                <label for="title">Event Title:</label>
                                <input type="text" id="title" name="title" value="${this.event.title}" required>
                            </div>
                            <div class="form-group">
                                <label for="description">Description:</label>
                                <textarea id="description" name="description" required>${this.event.description}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="date">Date:</label>
                                <input type="date" id="date" name="date" value="${this.event.date}" required>
                            </div>
                            <div class="form-group">
                                <label for="time">Time:</label>
                                <input type="time" id="time" name="time" value="${this.event.time}" required>
                            </div>
                            <div class="form-group">
                                <label for="location">Location:</label>
                                <input type="text" id="location" name="location" value="${this.event.location}" required>
                            </div>
                            <div class="form-group">
                                <label for="capacity">Capacity:</label>
                                <input type="number" id="capacity" name="capacity" min="1" value="${this.event.capacity}" required>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Update Event</button>
                                <button type="button" class="btn btn-secondary" onclick="EditEventView.goBack()">Cancel</button>
                            </div>
                            <div id="error-message" class="error-message"></div>
                            <div id="success-message" class="success-message"></div>
                        </form>
                    </div>
                </div>
            </main>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const form = document.getElementById('editEventForm');
        form.addEventListener('submit', this.handleUpdateEvent.bind(this));
    },

    async handleUpdateEvent(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const eventData = {
            ...this.event,
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            capacity: parseInt(formData.get('capacity'))
        };
        
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');
        
        errorDiv.textContent = '';
        successDiv.textContent = '';
        
        // Validate capacity is not less than current attendees
        if (eventData.capacity < this.event.attendees.length) {
            errorDiv.textContent = `Capacity cannot be less than current attendees (${this.event.attendees.length})`;
            return;
        }
        
        try {
            await API.updateEvent(this.event.id, eventData);
            successDiv.textContent = 'Event updated successfully!';
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
                Router.navigate('/dashboard');
            }, 1500);
            
        } catch (error) {
            errorDiv.textContent = 'Failed to update event. Please try again.';
        }
    },

    goBack() {
        Router.navigate('/dashboard');
    }
};