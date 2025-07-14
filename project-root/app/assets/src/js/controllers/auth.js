/*
 * =============================================
 * MÓDULO DE AUTENTICACIÓN
 * =============================================
 * Este módulo maneja toda la lógica de
 * autenticación, incluyendo:
 * - Login y registro de usuarios
 * - Encriptación de contraseñas con SHA256
 * - Generación de tokens JWT
 * - Persistencia de sesión en localStorage
 * =============================================
 */

import { API_URL } from './config.js';

/*
 * Función para encriptar contraseñas usando SHA256
 * @param {string} password - Contraseña en texto plano
 * @returns {string} Contraseña encriptada
 */
export function encryptPassword(password) {
    return CryptoJS.SHA256(password).toString();
}

/*
 * Función para generar un token JWT simple
 * @param {Object} user - Datos del usuario
 * @returns {string} Token generado
 */
function generateToken(user) {
    // Crear payload del token
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Date.now() + (24 * 60 * 60 * 1000) // Expira en 24 horas
    };
    
    // Convertir a base64
    return btoa(JSON.stringify(payload));
}

/*
 * Función para validar un token
 * @param {string} token - Token a validar
 * @returns {boolean} Si el token es válido
 */
function validateToken(token) {
    try {
        const payload = JSON.parse(atob(token));
        return payload.exp > Date.now();
    } catch (e) {
        return false;
    }
}

/*
 * Función de login
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise} Promesa con el resultado
 */
export async function login(email, password) {
    try {
        // Encriptar la contraseña
        const encryptedPassword = encryptPassword(password);
        
        console.log('Contraseña original:', password);
        console.log('Contraseña encriptada:', encryptedPassword);
        
        // Buscar usuario en la base de datos
        const response = await fetch(`${API_URL}/users?email=${email}&password=${encryptedPassword}`);
        const users = await response.json();
        
        // Verificar si se encontró el usuario
        if (users.length === 0) {
            throw new Error('Email o contraseña incorrectos');
        }
        
        const user = users[0];
        
        // Generar token
        const token = generateToken(user);
        
        // Guardar en localStorage
        const userData = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            token: token
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        return userData;
        
    } catch (error) {
        console.error('Error en login:', error);
        throw error;
    }
}

/*
 * Función de registro
 * @param {Object} userData - Datos del nuevo usuario
 * @returns {Promise} Promesa con el resultado
 */
export async function register(userData) {
    try {
        // Verificar si el email ya existe
        const checkResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
        const existingUsers = await checkResponse.json();
        
        if (existingUsers.length > 0) {
            throw new Error('El email ya está registrado');
        }
        
        // Encriptar la contraseña
        const encryptedPassword = encryptPassword(userData.password);
        
        // Crear objeto de usuario
        const newUser = {
            name: userData.name,
            email: userData.email,
            password: encryptedPassword,
            passwordOriginal: userData.password, // Guardar también la original como solicitado
            role: userData.role || 'estudiante',
            enrolledCourses: []
        };
        
        // Guardar en la base de datos
        const response = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });
        
        if (!response.ok) {
            throw new Error('Error al registrar usuario');
        }
        
        const createdUser = await response.json();
        
        // Auto-login después del registro
        return login(userData.email, userData.password);
        
    } catch (error) {
        console.error('Error en registro:', error);
        throw error;
    }
}

/*
 * Función para cerrar sesión
 */
export function logout() {
    // Limpiar localStorage
    localStorage.removeItem('user');
    
    // Redirigir a home usando hash directamente
    window.location.hash = '#/';
}

/*
 * Función para obtener el usuario actual
 * @returns {Object|null} Usuario actual o null
 */
export function getUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
        const user = JSON.parse(userStr);
        
        // Validar token
        if (!validateToken(user.token)) {
            logout();
            return null;
        }
        
        return user;
    } catch (e) {
        logout();
        return null;
    }
}

/*
 * Función para verificar si el usuario está autenticado
 * @returns {boolean} Si está autenticado
 */
export function isAuthenticated() {
    return getUser() !== null;
}

/*
 * Función para verificar el rol del usuario
 * @param {string} role - Rol a verificar
 * @returns {boolean} Si el usuario tiene el rol
 */
export function hasRole(role) {
    const user = getUser();
    return user && user.role === role;
}

/*
 * Función para verificar autenticación al cargar la app
 */
export function checkAuth() {
    const user = getUser();
    if (user) {
        console.log('Usuario autenticado:', user.email);
    } else {
        console.log('No hay usuario autenticado');
    }
}