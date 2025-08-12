# Customer Management System 📊

A complete web application for managing customers with features to create, read, update, and delete customer information. The system also includes data import functionality from Excel/CSV files.

## 🚀 Features

- **Customer Management**: Full CRUD operations
- **Search Functionality**: Find customers by ID number
- **Data Import**: Import customer, bill, and transaction data from Excel/CSV files
- **Responsive Design**: Clean and modern user interface
- **MySQL Database**: Secure data storage
- **REST API**: Well-structured backend API

## 📋 Requirements

Before starting, make sure you have installed:

- **Node.js** (version 14 or higher)
- **MySQL** (version 8.0 or higher)
- **Web Browser** (Chrome, Firefox, Safari, etc.)
- **Code Editor** (Visual Studio Code recommended)

## 🛠️ Installation

### Step 1: Database Setup

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or command line)
2. Create a new database:
   ```sql
   CREATE DATABASE pd_alvaro_noriega_macondo;
   ```
3. Import the database structure using the `pd_alvaro_noriega_macondo.sql` file provided in the project

### Step 2: Environment Configuration

Create a `.env` file in the **backend folder** with the following content:

```env
# --- Database Credentials ---
HOST=127.0.0.1
DATABASE=pd_alvaro_noriega_macondo
DB_USER=root
DB_PASSWORD=your_password

# --- Server Configuration ---
PORT=3001
```

**Important**: Replace `your_password` with your actual MySQL password.

### Step 3: Backend Setup

1. Open **Visual Studio Code**
2. Open the terminal in VS Code (Ctrl + ` or View → Terminal)
3. Navigate to the backend folder:
   ```bash
   cd backend
   ```
4. Initialize npm:
   ```bash
   npm init -y
   ```
5. Install dependencies:
   ```bash
   npm i
   ```
6. Start the development server:
   ```bash
   npm run dev
   ```

You should see: `Server listening on port 3001`

### Step 4: Frontend Setup

1. Install **Live Server** extension in VS Code:
   - Go to Extensions (Ctrl + Shift + X)
   - Search for "Live Server"
   - Install the extension by Ritwick Dey

2. Open the `index.html` file
3. Right-click on the file and select "Open with Live Server"
4. The application will open in your browser at `http://127.0.0.1:5500`

## 🎯 How to Use

### Customer Management

1. **Add Customer**: Fill the form and click "Keep"
2. **Edit Customer**: Click "Edit" button on any customer row
3. **Delete Customer**: Click "Delete" button (will also delete related transactions)
4. **Search Customer**: Enter ID number and click "Look for"

### Data Import

Use the `importData.js` script to import data from Excel or CSV files:

```bash
node importData.js path/to/your/file.xlsx
```
The script supports:
- Excel files (.xlsx, .xls)
- CSV files (.csv)
- Automatic data validation
- Transaction rollback on errors
- To run the script, go to the script folder and run node plus the file name followed by .js, for example node imporData.js.

## API Endpoints

### Customers
- `GET /customers` - Get all customers
- `GET /customers/:id` - Get customer by ID
- `GET /customers?identification_number=123` - Search by ID number
- `POST /customers` - Create new customer
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Example API Usage

**Create Customer:**
```json
POST /customers
{
  "identification_number": "1234567890",
  "client_names": "John Doe",
  "phone": "3001234567",
  "email": "john@example.com",
  "address": "123 Main St, City"
}
```

## Troubleshooting

### Common Issues

**1. "Cannot connect to database"**
- Check your MySQL server is running
- Verify credentials in `.env` file
- Make sure database exists

**2. "Port 3001 already in use"**
- Change PORT in `.env` file
- Or stop other applications using port 3001

**3. "Live Server not working"**
- Install Live Server extension
- Right-click on `index.html` and select "Open with Live Server"

**4. "Import script fails"**
- Check file format (Excel/CSV supported)
- Verify column names match expected format
- Check database connection

## Project Structure

```
project/
├── backend/
│   ├── controllers/
│   │   └── controllersCustomers.js
│   ├── models/
│   │   └── database.js
│   ├── routers/
│   │   └── customers.js
│   ├── server.js
│   ├── importData.js
│   └── .env
├── frontend/
│   ├── src/
│   │   └── app.js
│   ├── style/
│   │   └── style.css
│   └── index.html
├── docs/
│   ├── db/
│   │   └── pd_alvaro_noriega_macondo.sql
│   ├── img/
│   │   ├── img_1
│   │   ├── img_2
│   │   └── img_3
│   ├── postman/
│   │   └── pd_alvaro_noriega_macondo.postman_collection.json
│   └── data.xlsx
│ 
└── README.md
```

