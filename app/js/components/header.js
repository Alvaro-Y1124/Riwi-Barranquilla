// Header component with Dashboard, Create Event, and Logout buttons
import { Auth } from '../auth.js';
import { Router } from '../router.js';

export const Header = {
    render() {
        const user = Auth.getCurrentUser();
        
        return `
            <header class="header">
                <div class="container">
                    <div class="header-content">
                        <div class="logo">Event Manager</div>
                        ${user ? this.renderAuthenticatedNav(user) : this.renderGuestNav()}
                    </div>
                </div>
            </header>
        `;
    },

    renderAuthenticatedNav(user) {
        return `
            <div class="nav-buttons">
                <span class="user-info">Welcome, ${user.username} (${user.role})</span>
                <button class="btn btn-dashboard" onclick="Header.navigateTo('/dashboard')">Dashboard</button>
                ${user.role === 'admin' ? `
                    <button class="btn btn-create" onclick="Header.navigateTo('/dashboard/events/create')">Create Event</button>
                ` : ''}
                <button class="btn btn-logout" onclick="Header.logout()">Logout</button>
            </div>
        `;
    },

    renderGuestNav() {
        return `
            <div class="nav-buttons">
                <button class="btn btn-primary" onclick="Header.navigateTo('/login')">Login</button>
                <button class="btn btn-secondary" onclick="Header.navigateTo('/register')">Register</button>
            </div>
        `;
    },

    navigateTo(path) {
        Router.navigate(path);
    },

    logout() {
        Auth.logout();
        Router.navigate('/login');
    }
};