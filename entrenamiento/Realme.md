# 📚 Academia de Cursos Online

Sistema de gestión de cursos académicos desarrollado como una Single Page Application (SPA) con JavaScript vanilla, que permite a administradores gestionar cursos y a estudiantes inscribirse en ellos.

## 🚀 Características Principales

- **Autenticación de usuarios** con roles diferenciados (Administrador/Estudiante)
- **Sistema de rutas protegidas** mediante hash routing
- **Gestión completa de cursos** (CRUD para administradores)
- **Inscripción de estudiantes** a cursos disponibles
- **Dashboard personalizado** según el rol del usuario
- **Encriptación de contraseñas** con SHA256
- **Diseño responsive** y moderno

## 🛠️ Tecnologías Utilizadas

- **Frontend**: JavaScript Vanilla (ES6+)
- **Estilos**: CSS3 puro
- **Base de datos**: JSON Server (simulación de API REST)
- **Servidor de desarrollo**: Vite
- **Encriptación**: CryptoJS (SHA256)
- **Arquitectura**: SPA con patrón MVC

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Git

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/academia-cursos-online.git
   cd academia-cursos-online
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Instalar JSON Server globalmente** (si no lo tienes)
   ```bash
   npm install -g json-server
   ```

## 🏃‍♂️ Ejecutar el Proyecto

El proyecto requiere ejecutar dos servidores simultáneamente:

### Opción 1: En terminales separadas

**Terminal 1 - JSON Server (Backend)**
```bash
json-server --watch assets/db/db.json --port 3000
```

**Terminal 2 - Vite (Frontend)**
```bash
npm run dev
```

### Opción 2: Usando concurrently (recomendado)

Primero instala concurrently:
```bash
npm install --save-dev concurrently
```

Luego agrega este script a tu `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "backend": "json-server --watch assets/db/db.json --port 3000",
    "start": "concurrently \"npm run backend\" \"npm run dev\""
  }
}
```

Y ejecuta:
```bash
npm start
```

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:5173 (o el puerto que asigne Vite)
- **API (JSON Server)**: http://localhost:3000

## 👥 Usuarios de Prueba

### Administrador
- **Email**: admin@academia.com
- **Contraseña**: admin123

### Estudiante
Puedes registrar nuevos estudiantes desde la página de registro.

## 📁 Estructura del Proyecto

```
academia-cursos-online/
├── assets/
│   ├── db/
│   │   └── db.json              # Base de datos JSON
│   ├── src/
│   │   ├── js/
│   │   │   ├── components/      # Componentes reutilizables
│   │   │   │   ├── modal.js
│   │   │   │   └── navbar.js
│   │   │   ├── controllers/     # Lógica de negocio
│   │   │   │   ├── auth.js
│   │   │   │   └── config.js
│   │   │   ├── router/          # Sistema de rutas
│   │   │   │   └── router.js
│   │   │   ├── utils/           # Utilidades
│   │   │   │   └── messages.js
│   │   │   └── views/           # Vistas de la aplicación
│   │   │       ├── courses.js
│   │   │       ├── dashboard.js
│   │   │       ├── home.js
│   │   │       ├── login.js
│   │   │       ├── notFound.js
│   │   │       └── register.js
│   │   └── main.js              # Punto de entrada
│   └── style/
│       └── style.css            # Estilos globales
├── index.html                   # Archivo HTML principal
├── package.json
└── README.md
```

## 🔐 Funcionalidades por Rol

### Administrador
- Ver estadísticas generales del sistema
- Crear, editar y eliminar cursos
- Ver lista de estudiantes inscritos
- Gestionar capacidad de cursos

### Estudiante
- Ver cursos disponibles
- Inscribirse en cursos
- Ver sus cursos inscritos
- Cancelar inscripciones

## 🎯 Características Técnicas

### Sistema de Rutas
- Implementación de SPA con hash routing (#)
- Rutas protegidas según autenticación
- Guardias de ruta para verificar permisos

### Seguridad
- Contraseñas encriptadas con SHA256
- Tokens JWT simulados para sesiones
- Validación de formularios
- Protección contra acceso no autorizado

### API REST (JSON Server)
- Endpoints disponibles:
  - `GET /users` - Obtener usuarios
  - `POST /users` - Crear usuario
  - `GET /courses` - Obtener cursos
  - `POST /courses` - Crear curso
  - `PUT /courses/:id` - Actualizar curso
  - `DELETE /courses/:id` - Eliminar curso

## 🚀 Deployment

Para preparar el proyecto para producción:

```bash
npm run build
```

Esto generará una carpeta `dist/` con los archivos optimizados.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas Adicionales

- El proyecto usa JSON Server como simulación de backend, en producción se debe implementar un backend real
- Las contraseñas se almacenan encriptadas pero también se guarda la versión original solo para propósitos de desarrollo
- El sistema de tokens es una simulación básica, en producción usar JWT real
- Asegúrate de que ambos servidores estén ejecutándose antes de usar la aplicación

## 🐛 Solución de Problemas

### El servidor no inicia
- Verifica que los puertos 3000 y 5173 estén libres
- Asegúrate de tener todas las dependencias instaladas

### Error de CORS
- JSON Server debe estar ejecutándose en el puerto 3000
- Verifica la configuración de `API_URL` en `config.js`

### La página muestra "404 Not Found"
- Verifica que estés autenticado para acceder a rutas protegidas
- Asegúrate de usar el hash (#) en las URLs


---
