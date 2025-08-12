#!/usr/bin/env node

/**
 * Sistema de Importación Dinámica para Transacciones, Clientes y Facturas
 */

import mysql from 'mysql2/promise';
import XLSX from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { createReadStream } from 'fs';
import csv from 'csv-parser';
import readline from 'readline';

// --- Módulo de Logging ---
const Logger = {
    info: (message) => console.log(`${new Date().toISOString()} - INFO - ${message}`),
    error: (message) => console.error(`${new Date().toISOString()} - ERROR - ${message}`),
    warn: (message) => console.warn(`${new Date().toISOString()} - WARN - ${message}`),
};

// --- Configuración y Mapeos ---

function getColumnMappings() {
    return new Map([
        ['id de la transacción', 'code_transaction'],
        ['fecha y hora de la transacción', 'date_time_transaction'],
        ['monto de la transacción', 'transaction_amount'],
        ['estado de la transacción', 'transaction_status'],
        ['tipo de transacción', 'transaction_type'],
        ['nombre del cliente', 'client_names'],
        ['número de identificación', 'identification_number'],
        ['dirección', 'address'],
        ['teléfono', 'phone'],
        ['correo electrónico', 'email'],
        ['plataforma utilizada', 'platform_used'],
        ['número de factura', 'bill_number'],
        ['periodo de facturación', 'billing_period'],
        ['monto facturado', 'billed_amount'],
        ['monto pagado', 'paid_amount']
    ]);
}

function getTableSchemas() {
    // Aseguramos que los nombres de las columnas aquí coincidan con la BD real.
    return {
        expectedTables: ['customers', 'bills', 'transactions'],
        tableColumns: {
            customers: ['id_client', 'identification_number', 'client_names', 'phone', 'email', 'address'],
            bills: ['id_bill', 'bill_number', 'billing_period', 'billed_amount'], 
            transactions: ['id_transaction', 'code_transaction', 'date_time_transaction', 'transaction_amount', 'transaction_status', 'transaction_type', 'platform_used', 'paid_amount', 'id_client', 'id_bill']
        }
    };
}

const statusMapping = {
    'completada': 'completed',
    'pendiente': 'pending',
    'fallida': 'failed'
};

const typeMapping = {
    'pago de factura': 'bill payment'
};

// --- Funciones de Base de Datos ---

async function createDbPool(config) {
    try {
        const pool = mysql.createPool({ ...config, waitForConnections: true, connectionLimit: 10, queueLimit: 0 });
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        Logger.info("✅ Pool de conexiones a la base de datos creado exitosamente.");
        return pool;
    } catch (error) {
        Logger.error(`❌ Error de conexión a la base de datos: ${error.message}`);
        return null;
    }
}

async function closeDbPool(pool) {
    if (pool) {
        await pool.end();
        Logger.info("🔌 Pool de conexiones cerrado.");
    }
}

async function validateTables(pool, schemas) {
    const connection = await pool.getConnection();
    try {
        Logger.info("🔍 Validando estructura de tablas en la base de datos...");
        const [tables] = await connection.execute("SHOW TABLES");
        const existingTables = tables.map(row => Object.values(row)[0]);
        const missingTables = schemas.expectedTables.filter(t => !existingTables.includes(t));
        if (missingTables.length > 0) throw new Error(`Tablas faltantes: ${missingTables.join(', ')}`);
        Logger.info("✅ Estructura de tablas validada correctamente.");
    } finally {
        connection.release();
    }
}

// --- Funciones de Lectura de Archivos ---

async function readFile(filePath) {
    const fullPath = path.resolve(filePath);
    await fs.access(fullPath).catch(() => { throw new Error(`Archivo no encontrado: ${filePath}`); });
    const ext = path.extname(fullPath).toLowerCase();
    let data;
    if (['.xlsx', '.xls'].includes(ext)) {
        data = await readExcel(fullPath);
    } else if (ext === '.csv') {
        data = await readCSV(fullPath);
    } else {
        throw new Error(`Formato no soportado: ${ext}`);
    }
    const cleanedData = data.filter(row => Object.values(row).some(val => val != null && val !== ''));
    Logger.info(`📊 Archivo leído: ${cleanedData.length} filas con datos encontradas.`);
    return cleanedData;
}

async function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false, dateNF: 'YYYY-MM-DD HH:MM:SS' });
}

async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        createReadStream(filePath)
            .pipe(csv({ skipEmptyLines: true, mapHeaders: ({ header }) => header.trim().toLowerCase() }))
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(new Error(`Error CSV: ${err.message}`)));
    });
}

// --- Funciones de Procesamiento de Datos ---

function normalizeColumns(data, columnMappings) {
    return data.map(row => {
        const normalized = {};
        for (const originalKey in row) {
            // Normalizamos el encabezado del excel a minúsculas y sin espacios extra para buscarlo en el mapa
            const cleanKey = String(originalKey).toLowerCase().trim();
            const mappedKey = columnMappings.get(cleanKey) || cleanKey;
            normalized[mappedKey] = row[originalKey];
        }
        return normalized;
    });
}

async function getOrCreateId(connection, cache, table, data, uniqueField) {
    const uniqueValue = data[uniqueField];
    if (!uniqueValue) return null;

    const cacheKey = `${table}:${uniqueValue}`;
    if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
    }
    
    let idColumn;
    if (table === 'customers') {
        idColumn = 'id_client';
    } else {
        idColumn = `id_${table.slice(0, -1)}`;
    }

    const [rows] = await connection.execute(`SELECT ${idColumn} FROM ${table} WHERE ${uniqueField} = ?`, [uniqueValue]);

    if (rows.length > 0) {
        const id = rows[0][idColumn];
        cache.set(cacheKey, id);
        return id;
    }

    const fields = Object.keys(data).filter(key => data[key] != null);
    const placeholders = fields.map(() => '?').join(', ');
    const values = fields.map(f => data[f]);
    const [result] = await connection.execute(`INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`, values);
    
    const newId = result.insertId;
    if (newId) cache.set(cacheKey, newId);
    return newId;
}

async function processRow(connection, cache, row) {
    const customerData = {
        identification_number: row.identification_number,
        client_names: row.client_names,
        phone: row.phone,
        email: row.email,
        address: row.address,
    };
    if (!customerData.identification_number || !customerData.client_names) throw new Error("Datos de cliente insuficientes.");
    const clientId = await getOrCreateId(connection, cache, 'customers', customerData, 'identification_number');

    const billData = {
        bill_number: row.bill_number,
        billing_period: row.billing_period,
        billed_amount: row.billed_amount ?? row.transaction_amount
    };

    if (!billData.bill_number) throw new Error("Datos de factura insuficientes (número de factura vacío).");
    if (!billData.billing_period) throw new Error(`La fila con factura '${billData.bill_number}' no tiene un valor en 'Periodo de Facturación'.`);
    
    const billId = await getOrCreateId(connection, cache, 'bills', billData, 'bill_number');

    if (!clientId || !billId) throw new Error(`No se pudo obtener ID de cliente o factura. Cliente: ${clientId}, Factura: ${billId}`);

    return {
        code_transaction: row.code_transaction,
        date_time_transaction: row.date_time_transaction,
        transaction_amount: row.transaction_amount,
        transaction_status: statusMapping[row.transaction_status?.toLowerCase()] || 'pending',
        transaction_type: typeMapping[row.transaction_type?.toLowerCase()] || 'bill payment',
        platform_used: row.platform_used,
        paid_amount: row.paid_amount,
        id_client: clientId,
        id_bill: billId,
    };
}

async function importData(pool, data, columnMappings) {
    const normalizedData = normalizeColumns(data, columnMappings);
    const stats = { total: normalizedData.length, success: 0, errors: 0 };
    const connection = await pool.getConnection();
    const cache = new Map();

    try {
        await connection.beginTransaction();
        Logger.info(`🚀 Iniciando importación de ${stats.total} registros...`);
        const transactionQuery = `INSERT INTO transactions (code_transaction, date_time_transaction, transaction_amount, transaction_status, transaction_type, platform_used, paid_amount, id_client, id_bill) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE date_time_transaction=VALUES(date_time_transaction), transaction_status=VALUES(transaction_status), paid_amount=VALUES(paid_amount);`;

        for (let i = 0; i < normalizedData.length; i++) {
            try {
                if (!normalizedData[i].code_transaction) throw new Error("La columna 'code_transaction' no puede estar vacía.");
                const transactionData = await processRow(connection, cache, normalizedData[i]);
                await connection.execute(transactionQuery, Object.values(transactionData));
                stats.success++;
            } catch (error) {
                stats.errors++;
                Logger.error(`❌ Error en la fila ${i + 2} del archivo: ${error.message}`);
            }
        }

        if (stats.errors > 0) {
            Logger.warn(`⚠️ Se encontraron ${stats.errors} errores. Revirtiendo la transacción.`);
            await connection.rollback();
        } else {
            await connection.commit();
            Logger.info("✅ ¡Éxito! Transacción completada y todos los datos han sido guardados.");
        }
    } catch (error) {
        await connection.rollback();
        Logger.error(`❌ Error crítico de importación: ${error.message}`);
        throw error;
    } finally {
        connection.release();
    }
    return stats;
}

function generateReport(stats) {
    const successRate = stats.total > 0 ? (stats.success / stats.total) * 100 : 0;
    return `
📊 REPORTE DE IMPORTACIÓN
========================
Total de filas a procesar: ${stats.total}
✅ Registros exitosos:      ${stats.success}
❌ Registros con errores:     ${stats.errors}
📈 Tasa de éxito:           ${successRate.toFixed(1)}%
${stats.errors > 0 ? "\nNOTA: Debido a errores, no se guardó ningún registro. Corrija el archivo o los datos y reintente." : ""}`;
}

// --- Función Principal ---

function getUserInput(question) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(question, answer => {
        rl.close();
        resolve(answer.trim());
    }));
}

async function main() {
    let pool;
    try {
        const config = {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || await getUserInput("Usuario de la BD: "),
            password: process.env.DB_PASSWORD || await getUserInput("Contraseña de la BD: "),
            database: process.env.DB_NAME || await getUserInput("Nombre de la Base de datos: ")
        };
        let filePath = process.argv[2] || await getUserInput("Ruta del archivo a importar: ");

        pool = await createDbPool(config);
        if (!pool) return 1;

        const schemas = getTableSchemas();
        await validateTables(pool, schemas);

        const data = await readFile(filePath);
        if (data.length === 0) {
            Logger.warn("El archivo está vacío o no contiene datos válidos.");
            return 0;
        }
        
        const columnMappings = getColumnMappings();
        const normalizedData = normalizeColumns(data, columnMappings);
        const requiredCols = ['code_transaction', 'client_names', 'identification_number', 'bill_number', 'billing_period'];
        const firstRowKeys = Object.keys(normalizedData[0] || {});
        const missingCols = requiredCols.filter(col => !firstRowKeys.includes(col));

        if (missingCols.length > 0) {
            throw new Error(`Columnas esenciales faltantes o mal mapeadas: ${missingCols.join(', ')}. Asegúrate de que los nombres en el Excel coincidan con el mapeo del script.`);
        }
        
        Logger.info("✅ Archivo validado, contiene las columnas necesarias.");
        const proceed = await getUserInput("\n¿Desea proceder con la importación a la base de datos? (s/n): ");

        if (proceed.toLowerCase().startsWith('s')) {
            const stats = await importData(pool, data, columnMappings);
            console.log(generateReport(stats));
        } else {
            Logger.info("Importación cancelada.");
        }
        
        return 0;
    } catch (error) {
        Logger.error(`❌ OPERACIÓN FALLIDA: ${error.message}`);
        return 1;
    } finally {
        if (pool) await closeDbPool(pool);
    }
}

main().then(code => {
    console.log(`\nScript finalizado con código de salida: ${code}`);
    process.exit(code);
}).catch(error => {
    Logger.error(`Error fatal no controlado: ${error.message}`);
    process.exit(1);
});
