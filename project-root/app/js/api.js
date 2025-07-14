// API module for handling backend communication
const BASE_URL = 'http://localhost:3000';

export const API = {
    // User endpoints
    async getUsers() {
        try {
            const response = await fetch(`${BASE_URL}/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            return await response.json();
        } catch (error) {
            console.error('Error fetching users:', error);
            return [];
        }
    },

    async createUser(userData) {
        const response = await fetch(`${BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error('Failed to create user');
        return await response.json();
    },

    // Event endpoints
    async getEvents() {
        try {
            const response = await fetch(`${BASE_URL}/events`);
            if (!response.ok) throw new Error('Failed to fetch events');
            return await response.json();
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    },

    async getEvent(id) {
        const response = await fetch(`${BASE_URL}/events/${id}`);
        if (!response.ok) throw new Error('Failed to fetch event');
        return await response.json();
    },

    async createEvent(eventData) {
        const response = await fetch(`${BASE_URL}/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...eventData,
                attendees: []
            })
        });
        if (!response.ok) throw new Error('Failed to create event');
        return await response.json();
    },

    async updateEvent(id, eventData) {
        const response = await fetch(`${BASE_URL}/events/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        });
        if (!response.ok) throw new Error('Failed to update event');
        return await response.json();
    },

    async deleteEvent(id) {
        const response = await fetch(`${BASE_URL}/events/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete event');
        return response.ok;
    },

    async registerForEvent(eventId, userId) {
        const event = await this.getEvent(eventId);
        
        // Check if user is already registered
        if (event.attendees.includes(userId)) {
            throw new Error('Already registered for this event');
        }
        
        // Check if event is at capacity
        if (event.attendees.length >= event.capacity) {
            throw new Error('Event is at full capacity');
        }
        
        // Add user to attendees
        event.attendees.push(userId);
        
        return await this.updateEvent(eventId, event);
    },

    async unregisterFromEvent(eventId, userId) {
        const event = await this.getEvent(eventId);
        
        // Remove user from attendees
        event.attendees = event.attendees.filter(id => id !== userId);
        
        return await this.updateEvent(eventId, event);
    }
};