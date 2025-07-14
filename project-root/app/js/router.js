// Router module for handling navigation
import { Auth } from './auth.js';
import { LoginView } from './views/login.js';
import { RegisterView } from './views/register.js';
import { DashboardView } from './views/dashboard.js';
import { CreateEventView } from './views/create-event.js';
import { EditEventView } from './views/edit-event.js';
import { NotFoundView } from './views/not-found.js';

export const Router = {
    routes: {
        '/': LoginView,
        '/login': LoginView,
        '/register': RegisterView,
        '/dashboard': DashboardView,
        '/dashboard/events/create': CreateEventView,
        '/dashboard/events/edit': EditEventView,
        '/not-found': NotFoundView
    },

    init() {
        // Make router functions globally available
        window.Router = this;
        this.handleRoute();
    },

    navigate(path) {
        history.pushState({}, '', path);
        this.handleRoute();
    },

    handleRoute() {
        const path = window.location.pathname;
        const user = Auth.getCurrentUser();
        
        // Protected routes - require authentication
        const protectedRoutes = ['/dashboard', '/dashboard/events/create', '/dashboard/events/edit'];
        
        // Admin only routes
        const adminRoutes = ['/dashboard/events/create', '/dashboard/events/edit'];
        
        // Auth routes - redirect to dashboard if already logged in
        const authRoutes = ['/login', '/register'];
        
        // Check if accessing protected route without authentication
        if (protectedRoutes.some(route => path.startsWith(route))) {
            if (!user) {
                this.navigate('/login');
                return;
            }
            
            // Check if accessing admin route without admin role
            if (adminRoutes.some(route => path.startsWith(route)) && user.role !== 'admin') {
                this.navigate('/not-found');
                return;
            }
        }
        
        // Redirect to dashboard if already logged in and accessing auth routes
        if (authRoutes.includes(path) && user) {
            this.navigate('/dashboard');
            return;
        }
        
        // Default route
        if (path === '/') {
            if (user) {
                this.navigate('/dashboard');
            } else {
                this.navigate('/login');
            }
            return;
        }
        
        // Find and render the appropriate view
        let viewPath = path;
        
        // Handle edit route with parameters
        if (path.startsWith('/dashboard/events/edit')) {
            viewPath = '/dashboard/events/edit';
        }
        
        const view = this.routes[viewPath] || NotFoundView;
        this.render(view);
    },

    render(view) {
        const app = document.getElementById('app');
        app.innerHTML = '';
        view.render(app);
    }
};