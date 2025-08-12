#!/usr/bin/env node

/**
 * Sistema de Importación Dinámica Optimizado para JavaScript/Node.js
 * Versión funcional corregida y probada.
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
        ['nombre', 'nombre_usuario'], ['usuario', 'nombre_usuario'], ['name', 'nombre_usuario'], ['nombre del usuario', 'nombre_usuario'],
        ['identificacion', 'identificacion'], ['cedula', 'identificacion'], ['cédula', 'identificacion'], ['dni', 'identificacion'],
        ['email', 'correo'], ['mail', 'correo'], ['correo electronico', 'correo'], ['correo', 'correo'],
        ['telefono', 'telefono'], ['phone', 'telefono'], ['tel', 'telefono'],
        ['titulo', 'titulo'], ['libro', 'titulo'], ['title', 'titulo'],
        ['autor', 'autor'], ['author', 'autor'], ['escritor', 'autor'],
        ['año', 'año_publicacion'], ['year', 'año_publicacion'], ['año publicacion', 'año_publicacion'], ['año de publicacion', 'año_publicacion'],
        ['fecha prestamo', 'fecha_prestamo'], ['fecha_prestamo', 'fecha_prestamo'], ['prestamo', 'fecha_prestamo'],
        ['fecha devolucion', 'fecha_devolucion'], ['fecha_devolucion', 'fecha_devolucion'], ['devolucion', 'fecha_devolucion'],
        ['estado', 'estado'], ['status', 'estado'], ['isbn', 'isbn']
    ]);
}

function getTableSchemas() {
    return {
        expectedTables: ['usuarios', 'autores', 'estados', 'libros', 'prestamos'],
        tableColumns: {
            usuarios: ['usuario_id', 'nombre_usuario', 'identificacion', 'correo', 'telefono'],
            autores: ['autor_id', 'nombre_autor'],
            estados: ['estado_id', 'nombre_estado', 'descripcion'],
            libros: ['libro_id', 'titulo', 'isbn', 'año_publicacion', 'autor_id'],
            prestamos: ['prestamo_id', 'usuario_id', 'libro_id', 'fecha_prestamo', 'fecha_devolucion', 'estado_id']
        },
        estadosDefault: [
            ['activo', 'Préstamo vigente'],
            ['retrasado', 'Préstamo vencido'],
            ['entregado', 'Libro devuelto']
        ]
    };
}

// --- Funciones de Base de Datos ---

async function createDbPool(config) {
    try {
        const pool = mysql.createPool({
            ...config, waitForConnections: true, connectionLimit: 10, queueLimit: 0, acquireTimeout: 60000, timeout: 60000
        });
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        Logger.info("✅ Pool de conexiones creado exitosamente");
        return pool;
    } catch (error) {
        Logger.error(`❌ Error de conexión: ${error.message}`);
        return null;
    }
}

async function closeDbPool(pool) {
    if (pool) {
        await pool.end();
        Logger.info("🔌 Pool de conexiones cerrado");
    }
}

async function validateTables(pool, schemas) {
    const connection = await pool.getConnection();
    try {
        Logger.info("🔍 Validando estructura de tablas...");
        const [tables] = await connection.execute("SHOW TABLES");
        const existingTables = tables.map(row => Object.values(row)[0]);
        const missingTables = schemas.expectedTables.filter(t => !existingTables.includes(t));
        if (missingTables.length > 0) throw new Error(`Tablas faltantes: ${missingTables.join(', ')}`);
        
        await ensureBasicStates(connection, schemas.estadosDefault);
        Logger.info("✅ Validación de tablas completada");
    } finally {
        connection.release();
    }
}

async function ensureBasicStates(connection, estadosDefault) {
    try {
        const [states] = await connection.execute("SELECT nombre_estado FROM estados");
        const existingStates = states.map(row => row.nombre_estado);
        const statesToCreate = estadosDefault.filter(([name]) => !existingStates.includes(name));
        if (statesToCreate.length > 0) {
            Logger.info(`📝 Creando estados básicos: ${statesToCreate.map(([name]) => name).join(', ')}`);
            for (const [name, description] of statesToCreate) {
                await connection.execute("INSERT IGNORE INTO estados (nombre_estado, descripcion) VALUES (?, ?)", [name, description]);
            }
        }
    } catch (error) {
        Logger.warn(`⚠️ No se pudieron crear estados básicos: ${error.message}`);
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
    Logger.info(`📊 Archivo leído: ${cleanedData.length} filas encontradas`);
    return cleanedData;
}

async function readExcel(filePath) {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet, { defval: null });
}

async function readCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        createReadStream(filePath)
            .pipe(csv({ skipEmptyLines: true, mapHeaders: ({ header }) => header.trim() }))
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (err) => reject(new Error(`No se pudo leer el CSV: ${err.message}`)));
    });
}

// --- Funciones de Procesamiento de Datos ---

function normalizeColumns(data, columnMappings) {
    return data.map(row => {
        const normalized = {};
        for (const originalKey in row) {
            const cleanKey = String(originalKey).toLowerCase().trim();
            const mappedKey = columnMappings.get(cleanKey) || originalKey;
            normalized[mappedKey] = row[originalKey];
        }
        return normalized;
    });
}

function validateData(value, dataType) {
    if (value == null || value === '') return null;
    try {
        switch (dataType) {
            case 'email':
                const email = String(value).trim();
                return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) ? email : null;
            case 'date':
                // Manejar números de serie de Excel y strings
                if (typeof value === 'number' && value > 25569) { // Excel date serial number
                    return new Date(Math.round((value - 25569) * 86400 * 1000)).toISOString().split('T')[0];
                }
                const date = new Date(value);
                return !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : null;
            case 'year':
                const year = parseInt(value, 10);
                return (year >= 1000 && year <= new Date().getFullYear() + 5) ? year : null;
            case 'phone':
                const phone = String(value).replace(/[^\d]/g, '');
                return phone.length >= 7 ? phone : null;
            default:
                return String(value).trim();
        }
    } catch {
        return null;
    }
}

async function getOrCreateId(connection, cache, table, data, uniqueFields, requiredFields) {
    const cacheKey = `${table}:${uniqueFields.map(f => data[f] || '').join(':')}`;
    if (cache.has(cacheKey)) return cache.get(cacheKey);

    if (requiredFields.some(f => !data[f])) {
        return null;
    }
    
    // **INICIO DE LA CORRECCIÓN**
    // Lógica robusta para determinar el nombre de la columna ID
    const idColumn = table === 'autores' ? 'autor_id' : `${table.slice(0, -1)}_id`;
    // **FIN DE LA CORRECCIÓN**

    const conditions = uniqueFields.map(field => `${field} = ?`).join(' AND ');
    const values = uniqueFields.map(field => data[field]);
    const [rows] = await connection.execute(`SELECT ${idColumn} FROM ${table} WHERE ${conditions}`, values);

    if (rows.length > 0) {
        const id = rows[0][idColumn];
        cache.set(cacheKey, id);
        return id;
    }

    const fields = Object.keys(data).filter(key => data[key] != null);
    const placeholders = fields.map(() => '?').join(', ');
    const [result] = await connection.execute(`INSERT INTO ${table} (${fields.join(', ')}) VALUES (${placeholders})`, fields.map(f => data[f]));
    
    const newId = result.insertId;
    if (newId) cache.set(cacheKey, newId);
    return newId;
}

async function processRow(connection, cache, row) {
    const autorData = { nombre_autor: validateData(row.autor, 'string') };
    const autorId = await getOrCreateId(connection, cache, 'autores', autorData, ['nombre_autor'], ['nombre_autor']);
    
    const usuarioData = {
        nombre_usuario: validateData(row.nombre_usuario, 'string'),
        identificacion: validateData(row.identificacion, 'string'),
        correo: validateData(row.correo, 'email'),
        telefono: validateData(row.telefono, 'phone')
    };
    const usuarioId = await getOrCreateId(connection, cache, 'usuarios', usuarioData, ['identificacion', 'correo'], ['nombre_usuario', 'identificacion']);

    const estadoData = { nombre_estado: validateData(row.estado || 'activo', 'string')?.toLowerCase() };
    const estadoId = await getOrCreateId(connection, cache, 'estados', estadoData, ['nombre_estado'], ['nombre_estado']);

    const libroData = {
        titulo: validateData(row.titulo, 'string'),
        isbn: validateData(row.isbn, 'string'),
        año_publicacion: validateData(row.año_publicacion, 'year'),
        autor_id: autorId
    };
    const libroId = await getOrCreateId(connection, cache, 'libros', libroData, ['titulo', 'autor_id'], ['titulo', 'autor_id']);

    if (!usuarioId || !libroId || !estadoId) {
        throw new Error(`Datos insuficientes o inválidos. usuarioId: ${usuarioId}, libroId: ${libroId}, estadoId: ${estadoId}`);
    }

    return {
        usuario_id: usuarioId,
        libro_id: libroId,
        estado_id: estadoId,
        fecha_prestamo: validateData(row.fecha_prestamo, 'date') || new Date().toISOString().split('T')[0],
        fecha_devolucion: validateData(row.fecha_devolucion, 'date')
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

        const prestamoQuery = `INSERT INTO prestamos (usuario_id, libro_id, estado_id, fecha_prestamo, fecha_devolucion) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE estado_id=VALUES(estado_id), fecha_devolucion=VALUES(fecha_devolucion)`;

        for (let i = 0; i < normalizedData.length; i++) {
            try {
                const prestamoData = await processRow(connection, cache, normalizedData[i]);
                await connection.execute(prestamoQuery, [
                    prestamoData.usuario_id,
                    prestamoData.libro_id,
                    prestamoData.estado_id,
                    prestamoData.fecha_prestamo,
                    prestamoData.fecha_devolucion
                ]);
                stats.success++;
            } catch (error) {
                stats.errors++;
                Logger.error(`❌ Error fila ${i + 2}: ${error.message}`);
            }
        }
        await connection.commit();
        Logger.info("✅ Importación completada");
    } catch (error) {
        await connection.rollback();
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
📈 Tasa de éxito:           ${successRate.toFixed(1)}%`;
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
            user: process.env.DB_USER || await getUserInput("Usuario BD: "),
            password: process.env.DB_PASSWORD || await getUserInput("Password BD: "),
            database: process.env.DB_NAME || await getUserInput("Base de datos: ")
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
        const requiredCols = ['nombre_usuario', 'identificacion', 'titulo', 'autor'];
        const firstRowKeys = Object.keys(normalizedData[0] || {});
        const missingCols = requiredCols.filter(col => !firstRowKeys.includes(col));

        if (missingCols.length > 0) {
            throw new Error(`Columnas esenciales faltantes: ${missingCols.join(', ')}. Columnas encontradas: ${firstRowKeys.join(', ')}`);
        }
        
        Logger.info("✅ El archivo es válido y tiene las columnas necesarias.");
        const proceed = await getUserInput("\n¿Proceder con la importación? (s/n): ");

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