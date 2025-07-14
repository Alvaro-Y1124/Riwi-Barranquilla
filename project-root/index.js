// Main application entry point
import { Auth } from './app/js/auth.js';
import { Router } from './app/js/router.js';
import { Header } from './app/js/components/header.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize authentication
    Auth.init();
    
    // Initialize router
    Router.init();
    
    // Make components globally available for onclick handlers
    window.Header = Header;
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        Router.handleRoute();
    });
});

// Global error handler
window.addEventListener('error', (event) => {
    console.error('Application error:', event.error);
});