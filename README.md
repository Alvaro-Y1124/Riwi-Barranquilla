# Information Management System

A simple web application to manage information using a clean and modern interface.

## What is this project?

This is a web application that helps you manage information. You can:
- Add new information
- View all your information in a table
- Edit existing information
- Delete information you don't need

## Files in this project 

- `index.html` - The main page of the application
- `style.css` - Makes the page look nice and modern
- `db.json` - Stores all your information
- `management_api.js` - Makes the application work with the database

## How to use this project

### What you need first

1. **Node.js** - You need to install Node.js on your computer
2. **json-server** - This helps create a fake database for testing

### Steps to run the project

1. **Install json-server**
   ```
   npm install -g json-server
   ```

2. **Start the server**
   ```
   json-server --watch db.json --port 3000
   ```

3. **Open the project**
   - Open the `index.html` file in your web browser
   - Or use a local server like Live Server in VS Code

### How to use the application

1. **Add information**
   - Type your information in the text box
   - Click "Add Information" button
   - Your information will appear in the table

2. **Edit information**
   - Click the "Edit" button next to any information
   - Change the text in the popup window
   - Click "Update" to save changes

3. **Delete information**
   - Click the "Delete" button next to any information
   - Confirm that you want to delete it

## Features

- **Easy to use** - Simple interface for everyone
- **Safe** - Asks before deleting information
- **Smart** - Checks for duplicate information
- **Responsive** - Works on computers and mobile phones
- **Modern design** - Clean and beautiful interface

## Technology used

- **HTML5** - Structure of the web page
- **CSS3** - Styling and animations
- **JavaScript** - Logic and functionality
- **json-server** - Fake REST API for testing
- **Fetch API** - Communication with the server

## Project structure

```
project/
├── index.html              # Main HTML file
├── assets/
│   ├── style/
│   │   └── style.css       # CSS styles
│   └── src/
│       └── js/
│           └── management_api.js  # JavaScript logic
├── db.json                 # Database file
└── README.md              # This file
```

## Common problems and solutions

### Problem: "Connection error"
**Solution:** Make sure json-server is running:
```
json-server --watch db.json --port 3000
```

### Problem: Page doesn't load
**Solution:** Make sure all files are in the correct folders

### Problem: Buttons don't work
**Solution:** Check that the JavaScript file is loaded correctly

## How to customize

1. **Change colors** - Edit the CSS file to change colors
2. **Add more fields** - Modify the HTML and JavaScript to add more input fields
3. **Change the database** - Edit db.json to add more data types

## Browser support

This application works on:
- Google Chrome
- Mozilla Firefox
- Safari
- Microsoft Edge
- Any modern web browser

## Need help?

If you have problems:
1. Check that json-server is running
2. Look at the browser console for error messages
3. Make sure all files are in the right place
4. Check that your internet connection is working

## License

This project is free to use and modify.
