const database = require('../models/database');

// READ -Get all customers
exports.getCustomers = async (req, res) => {
    try {
        const pool = database.getPool();
        const { identification_number } = req.query;
        let rows;
        if (identification_number) {
            [rows] = await pool.query("SELECT * FROM customers WHERE identification_number = ?", [identification_number]);
        } else {
            [rows] = await pool.query("SELECT * FROM customers");
        }
        res.json({
            message: 'customers successfully obtained',
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Error getting customers:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// READ - Get a client for ID
exports.getCustomersId = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = database.getPool();
        const [rows] = await pool.query("SELECT * FROM customers WHERE id_client = ?", [id]);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'client not found' });
        }
        
        res.json({
            message: 'client found',
            data: rows[0]
        });
        
    } catch (error) {
        console.error('Error getting client by ID:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// CREATE -Create a new client
exports.createClient = async (req, res) => {
    try {
        const { identification_number, client_names, phone, email, address } = req.body;
        if (!identification_number || !client_names || !phone || !email || !address) {
            return res.status(400).json({ error: 'identification_number, client_names phone, email, address are required fields' });
        }
        
        const pool = database.getPool();
        const [result] = await pool.query(
            "INSERT INTO customers (identification_number, client_names, phone, email, address) VALUES (?, ?, ?, ?, ?)",
            [identification_number, client_names, phone, email, address]
        );
        
        res.status(201).json({
            message: 'client successfully created',
            id: result.insertId
        });
        
    } catch (error) {
        console.error('Error creating client:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// UPDATE -Update a client
exports.updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { identification_number, client_names, phone, email, address } = req.body;

        if (!identification_number || !client_names || !phone || !email || !address) {
            return res.status(400).json({ error: 'identification_number, client_names phone, email, address are required fields' });
        }
        
        const pool = database.getPool();
        const [result] = await pool.query(
            "UPDATE customers SET identification_number = ?, client_names  = ?, phone = ?, email = ?, address = ? WHERE id_client = ?",
            [identification_number, client_names, phone, email, address, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'client not found' });
        }
        
        res.json({ message: 'client successfully updated' });
        
    } catch (error) {
        console.error('Error updating client:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};

// DELETE - Delete a client
exports.deleteClient = async (req, res) => {
    const connection = await database.getPool().getConnection();
    
    try {
        const { id } = req.params;
        
    
        await connection.beginTransaction();
        

        const [clientExists] = await connection.query("SELECT id_client FROM customers WHERE id_client = ?", [id]);
        if (clientExists.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Client not found' });
        }
    
        const [transactions] = await connection.query("SELECT COUNT(*) as count FROM transactions WHERE id_client = ?", [id]);
        const transactionCount = transactions[0].count;
        
    
        if (transactionCount > 0) {
            await connection.query("DELETE FROM transactions WHERE id_client = ?", [id]);
        }
        
    
        await connection.query("DELETE FROM customers WHERE id_client = ?", [id]);
        
        
        await connection.commit();
        
        res.json({ 
            message: 'Client successfully removed',
            deletedTransactions: transactionCount
        });
        
    } catch (error) {
    
        await connection.rollback();
        console.error('Error deleting client:', error.message);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } finally {
        connection.release();
    }
};