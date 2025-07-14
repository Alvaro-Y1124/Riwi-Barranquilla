// Not found view
import { Router } from '../router.js';
import { Header } from '../components/header.js';

export const NotFoundView = {
    render(container) {
        container.innerHTML = `
            ${Header.render()}
            <main class="main-content">
                <div class="container">
                    <div class="not-found">
                        <h1>404</h1>
                        <p>Page not found or access denied</p>
                        <button class="btn btn-primary" onclick="NotFoundView.goHome()">Go to Home</button>
                    </div>
                </div>
            </main>
        `;
    },

    goHome() {
        Router.navigate('/');
    }
};