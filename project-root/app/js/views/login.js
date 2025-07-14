// Login view
import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { Header } from '../components/header.js';

export const LoginView = {
    render(container) {
        container.innerHTML = `
            ${Header.render()}
            <main class="main-content">
                <div class="container">
                    <div class="form-container">
                        <h2 class="form-title">Login</h2>
                        <form id="loginForm">
                            <div class="form-group">
                                <label for="username">Username:</label>
                                <input type="text" id="username" name="username" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Login</button>
                                <button type="button" class="btn btn-secondary" onclick="LoginView.navigateToRegister()">Register</button>
                            </div>
                            <div id="error-message" class="error-message"></div>
                        </form>
                        <div style="margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px;">
                            <strong>Test Credentials:</strong><br>
                            Admin: admin / admin123<br>
                            Visitor: visitor / visitor123
                        </div>
                    </div>
                </div>
            </main>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const form = document.getElementById('loginForm');
        form.addEventListener('submit', this.handleLogin);
    },

    async handleLogin(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const password = formData.get('password');
        
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = '';
        
        try {
            const result = await Auth.login(username, password);
            
            if (result.success) {
                Router.navigate('/dashboard');
            } else {
                errorDiv.textContent = result.error;
            }
        } catch (error) {
            errorDiv.textContent = 'Login failed. Please try again.';
        }
    },

    navigateToRegister() {
        Router.navigate('/register');
    }
};