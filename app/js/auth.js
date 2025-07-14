// Authentication module
import { API } from './api.js';

export const Auth = {
    currentUser: null,

    init() {
        // Check if user is already logged in from localStorage
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    },

    async login(username, password) {
        try {
            const users = await API.getUsers();
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
                return { success: true, user };
            } else {
                return { success: false, error: 'Invalid credentials' };
            }
        } catch (error) {
            return { success: false, error: 'Login failed. Make sure JSON server is running.' };
        }
    },

    async register(userData) {
        try {
            // Check if username already exists
            const users = await API.getUsers();
            const existingUser = users.find(u => u.username === userData.username);
            
            if (existingUser) {
                return { success: false, error: 'Username already exists' };
            }
            
            // Create new user with visitor role by default
            const newUser = {
                ...userData,
                role: 'visitor'
            };
            
            const createdUser = await API.createUser(newUser);
            this.currentUser = createdUser;
            localStorage.setItem('currentUser', JSON.stringify(createdUser));
            
            return { success: true, user: createdUser };
        } catch (error) {
            return { success: false, error: 'Registration failed. Make sure JSON server is running.' };
        }
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    },

    getCurrentUser() {
        return this.currentUser;
    },

    isAuthenticated() {
        return !!this.currentUser;
    },

    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }
};