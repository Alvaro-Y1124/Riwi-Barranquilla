# Event Manager SPA

A Single Page Application (SPA) for event management built with vanilla JavaScript, HTML5, and CSS3.

## Developer Information
- **Name**: [Your Name]
- **Clan**: [Your Clan]
- **Email**: [Your Email]
- **Document ID**: [Your Document ID]

## Project Overview

This application allows users to manage events with different roles:
- **Administrators**: Can create, edit, and delete events
- **Visitors**: Can view events and register/unregister for them

## Features

- User authentication (login/register)
- Role-based access control
- Session persistence using localStorage
- Event CRUD operations
- Event registration system with capacity limits
- Responsive design
- Protected routes
- Real-time data synchronization with JSON server

## Technologies Used

- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Backend**: JSON Server (for API simulation)
- **Build Tool**: Vite
- **Data Storage**: localStorage (session persistence)

## Prerequisites

Before running this project, make sure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)

## Installation & Setup

1. **Clone or download the project files**
   ```bash
   # If using git
   git clone [repository-url]
   cd event-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the JSON Server (Database)**
   ```bash
   npm run server
   ```
   This will start the JSON server on `http://localhost:3000`

4. **Start the Development Server**
   Open a new terminal window and run:
   ```bash
   npm run dev
   ```
   This will start the Vite development server, typically on `http://localhost:5173`

## Usage

### Default Users

The application comes with two pre-configured users:

**Administrator:**
- Username: `admin`
- Password: `admin123`
- Role: admin

**Visitor:**
- Username: `visitor`
- Password: `visitor123`
- Role: visitor

### Navigation

- **Home/Dashboard**: `/dashboard` - Main dashboard showing all events
- **Login**: `/login` - User authentication
- **Register**: `/register` - New user registration
- **Create Event**: `/dashboard/events/create` - Create new event (admin only)
- **Edit Event**: `/dashboard/events/edit?id=X` - Edit existing event (admin only)

### User Roles

**Administrator can:**
- View all events
- Create new events
- Edit existing events
- Delete events
- View event attendees

**Visitor can:**
- View all events
- Register for events (if not at capacity)
- Unregister from events
- View their registered events

## Project Structure

```
event-manager/
├── index.html              # Main HTML file
├── index.js                # Application entry point
├── styles.css              # Global styles
├── package.json            # Project dependencies
├── db.json                 # JSON server database
├── app/          
│     ├── js/
│          ├── api.js              # API service layer
│          ├── auth.js             # Authentication module
│          ├── router.js           # Client-side routing
│          ├── components/
│          │         └── header.js       # Header component
│          └── views/
│                 ├── dashboard.js      # Dashboard view
│                 ├── login.js          # Login view
│                 ├── register.js       # Register view
│                 ├── create-event.js   # Create event view
│                 ├── edit-event.js     # Edit event view
│                 └── not-found.js      # 404 page
└── README.md              # This file
```

## API Endpoints

The JSON server provides the following endpoints:

- `GET /users` - Get all users
- `POST /users` - Create new user
- `GET /events` - Get all events
- `GET /events/:id` - Get specific event
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

## Features in Detail

### Authentication
- Users can register with username, email, and password
- Login with username/password
- Session persistence using localStorage
- Role-based access control

### Event Management
- Create events with title, description, date, time, location, and capacity
- Edit existing events (admin only)
- Delete events (admin only)
- View all events with attendee information

### Event Registration
- Visitors can register for events
- Capacity limits are enforced
- Users can unregister from events
- Real-time attendee count display

### Route Protection
- Protected routes require authentication
- Role-based route access
- Automatic redirection for unauthorized access
- Custom 404 page for invalid routes

## Running in Production

To build for production:

```bash
npm run build
```

This will create a `dist` folder with optimized files ready for deployment.

## Testing

You can test the API endpoints using the provided Postman collection or by using curl commands:

```bash
# Get all events
curl http://localhost:3000/events

# Create a new event
curl -X POST http://localhost:3000/events \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event","description":"Test","date":"2025-08-01","time":"10:00","location":"Test Location","capacity":50,"attendees":[]}'
```

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   - Change the port in package.json: `"server": "json-server --watch db.json --port 3001"`

2. **Vite dev server not starting**
   - Make sure no other service is using port 5173
   - Try: `npm run dev -- --port 5174`

3. **CORS issues**
   - JSON server includes CORS headers by default
   - Make sure both servers are running

4. **Data not persisting**
   - Check if db.json file exists and is writable
   - Restart the JSON server if needed

### Development Tips

- Use browser developer tools to debug
- Check the Network tab for API calls
- Use console.log for debugging JavaScript
- Check localStorage in Application tab for session data
