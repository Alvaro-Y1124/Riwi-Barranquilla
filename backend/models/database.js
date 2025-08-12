// models/database.js

const mysql = require("mysql2/promise");


const pool = mysql.createPool({
    host: process.env.HOST,
    database: process.env.DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


// to export the functions
exports.getPool = () => pool;
