// Dashboard view
import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { API } from '../api.js';
import { Header } from '../components/header.js';

export const DashboardView = {
    events: [],
    users: [],

    async render(container) {
        await this.loadData();
        
        container.innerHTML = `
            ${Header.render()}
            <main class="main-content">
                <div class="container">
                    <h1 class="page-title">Dashboard</h1>
                    ${this.renderStats()}
                    ${this.renderEvents()}
                </div>
            </main>
        `;

        // Set up global reference for onclick handlers
        window.DashboardView = this;
    },

    async loadData() {
        try {
            this.events = await API.getEvents();
            this.users = await API.getUsers();
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    },

    renderStats() {
        const totalEvents = this.events.length;
        const totalAttendees = this.events.reduce((sum, event) => sum + event.attendees.length, 0);
        const user = Auth.getCurrentUser();
        const myEvents = this.events.filter(event => event.attendees.includes(user.id));

        return `
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-number">${totalEvents}</div>
                    <div class="stat-label">Total Events</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${totalAttendees}</div>
                    <div class="stat-label">Total Attendees</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${myEvents.length}</div>
                    <div class="stat-label">My Events</div>
                </div>
            </div>
        `;
    },

    renderEvents() {
        const user = Auth.getCurrentUser();
        
        return `
            <div class="events-section">
                <h2>Available Events</h2>
                <div class="events-grid">
                    ${this.events.map(event => this.renderEventCard(event, user)).join('')}
                </div>
            </div>
        `;
    },

    renderEventCard(event, user) {
        const isRegistered = event.attendees.includes(user.id);
        const isFull = event.attendees.length >= event.capacity;
        const attendeeNames = event.attendees.map(id => {
            const attendee = this.users.find(u => u.id === id);
            return attendee ? attendee.username : 'Unknown';
        });

        return `
            <div class="event-card">
                <div class="event-title">${event.title}</div>
                <div class="event-description">${event.description}</div>
                <div class="event-details">
                    <div class="event-detail">
                        <span>📅 ${event.date}</span>
                    </div>
                    <div class="event-detail">
                        <span>🕐 ${event.time}</span>
                    </div>
                    <div class="event-detail">
                        <span>📍 ${event.location}</span>
                    </div>
                    <div class="event-detail">
                        <span>👥 ${event.attendees.length}/${event.capacity}</span>
                    </div>
                </div>
                
                ${attendeeNames.length > 0 ? `
                    <div class="attendees-list">
                        <div class="attendees-title">Attendees:</div>
                        ${attendeeNames.map(name => `<div class="attendee-item">${name}</div>`).join('')}
                    </div>
                ` : ''}
                
                <div class="event-actions">
                    ${user.role === 'admin' ? `
                        <button class="btn btn-secondary" onclick="DashboardView.editEvent(${event.id})">Edit</button>
                        <button class="btn btn-danger" onclick="DashboardView.deleteEvent(${event.id})">Delete</button>
                    ` : ''}
                    
                    ${user.role === 'visitor' ? `
                        ${isRegistered ? `
                            <button class="btn btn-danger" onclick="DashboardView.unregisterFromEvent(${event.id})">Unregister</button>
                        ` : `
                            <button class="btn btn-primary" ${isFull ? 'disabled' : ''} onclick="DashboardView.registerForEvent(${event.id})">
                                ${isFull ? 'Full' : 'Register'}
                            </button>
                        `}
                    ` : ''}
                </div>
            </div>
        `;
    },

    editEvent(eventId) {
        Router.navigate(`/dashboard/events/edit?id=${eventId}`);
    },

    async deleteEvent(eventId) {
        if (confirm('Are you sure you want to delete this event?')) {
            try {
                await API.deleteEvent(eventId);
                // Refresh the view
                const container = document.getElementById('app');
                this.render(container);
            } catch (error) {
                alert('Failed to delete event');
            }
        }
    },

    async registerForEvent(eventId) {
        const user = Auth.getCurrentUser();
        
        try {
            await API.registerForEvent(eventId, user.id);
            // Refresh the view
            const container = document.getElementById('app');
            this.render(container);
        } catch (error) {
            alert(error.message);
        }
    },

    async unregisterFromEvent(eventId) {
        const user = Auth.getCurrentUser();
        
        try {
            await API.unregisterFromEvent(eventId, user.id);
            // Refresh the view
            const container = document.getElementById('app');
            this.render(container);
        } catch (error) {
            alert('Failed to unregister from event');
        }
    }
};