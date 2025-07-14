// Register view
import { Auth } from '../auth.js';
import { Router } from '../router.js';
import { Header } from '../components/header.js';

export const RegisterView = {
    render(container) {
        container.innerHTML = `
            ${Header.render()}
            <main class="main-content">
                <div class="container">
                    <div class="form-container">
                        <h2 class="form-title">Register</h2>
                        <form id="registerForm">
                            <div class="form-group">
                                <label for="username">Username:</label>
                                <input type="text" id="username" name="username" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email:</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="password">Password:</label>
                                <input type="password" id="password" name="password" required>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm Password:</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required>
                            </div>
                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary">Register</button>
                                <button type="button" class="btn btn-secondary" onclick="RegisterView.navigateToLogin()">Back to Login</button>
                            </div>
                            <div id="error-message" class="error-message"></div>
                        </form>
                    </div>
                </div>
            </main>
        `;

        this.bindEvents();
    },

    bindEvents() {
        const form = document.getElementById('registerForm');
        form.addEventListener('submit', this.handleRegister);
    },

    async handleRegister(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        const errorDiv = document.getElementById('error-message');
        errorDiv.textContent = '';
        
        // Validate passwords match
        if (password !== confirmPassword) {
            errorDiv.textContent = 'Passwords do not match';
            return;
        }
        
        try {
            const result = await Auth.register({
                username,
                email,
                password
            });
            
            if (result.success) {
                Router.navigate('/dashboard');
            } else {
                errorDiv.textContent = result.error;
            }
        } catch (error) {
            errorDiv.textContent = 'Registration failed. Please try again.';
        }
    },

    navigateToLogin() {
        Router.navigate('/login');
    }
};