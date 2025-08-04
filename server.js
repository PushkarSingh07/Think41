const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./customer_data.db');

// Initialize database and import CSV data
function initializeDatabase() {
    return new Promise((resolve, reject) => {
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            first_name TEXT,
            last_name TEXT,
            email TEXT,
            age INTEGER,
            gender TEXT,
            state TEXT,
            street_address TEXT,
            postal_code TEXT,
            city TEXT,
            country TEXT,
            latitude REAL,
            longitude REAL,
            traffic_source TEXT,
            created_at TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating users table:', err);
                reject(err);
                return;
            }

            // Create orders table
            db.run(`CREATE TABLE IF NOT EXISTS orders (
                order_id INTEGER PRIMARY KEY,
                user_id INTEGER,
                status TEXT,
                gender TEXT,
                created_at TEXT,
                returned_at TEXT,
                shipped_at TEXT,
                delivered_at TEXT,
                num_of_item INTEGER,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )`, (err) => {
                if (err) {
                    console.error('Error creating orders table:', err);
                    reject(err);
                    return;
                }

                // Check if data already exists
                db.get("SELECT COUNT(*) as count FROM users", (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    if (row.count === 0) {
                        importCSVData().then(resolve).catch(reject);
                    } else {
                        console.log('Database already contains data');
                        resolve();
                    }
                });
            });
        });
    });
}

// Import CSV data
function importCSVData() {
    return new Promise((resolve, reject) => {
        console.log('Importing users data...');
        
        // Import users
        fs.createReadStream('users.csv')
            .pipe(csv())
            .on('data', (row) => {
                const stmt = db.prepare(`INSERT INTO users (
                    id, first_name, last_name, email, age, gender, state, 
                    street_address, postal_code, city, country, latitude, 
                    longitude, traffic_source, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                
                stmt.run([
                    row.id, row.first_name, row.last_name, row.email, 
                    row.age, row.gender, row.state, row.street_address, 
                    row.postal_code, row.city, row.country, row.latitude, 
                    row.longitude, row.traffic_source, row.created_at
                ]);
                stmt.finalize();
            })
            .on('end', () => {
                console.log('Users data imported successfully');
                
                // Import orders
                console.log('Importing orders data...');
                fs.createReadStream('orders.csv')
                    .pipe(csv())
                    .on('data', (row) => {
                        const stmt = db.prepare(`INSERT INTO orders (
                            order_id, user_id, status, gender, created_at, 
                            returned_at, shipped_at, delivered_at, num_of_item
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
                        
                        stmt.run([
                            row.order_id, row.user_id, row.status, row.gender,
                            row.created_at, row.returned_at, row.shipped_at,
                            row.delivered_at, row.num_of_item
                        ]);
                        stmt.finalize();
                    })
                    .on('end', () => {
                        console.log('Orders data imported successfully');
                        resolve();
                    })
                    .on('error', reject);
            })
            .on('error', reject);
    });
}

// API Routes

// GET /customers - List all customers with pagination
app.get('/customers', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const query = `
        SELECT 
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.age,
            u.gender,
            u.state,
            u.city,
            u.country,
            COUNT(o.order_id) as order_count
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        GROUP BY u.id
        LIMIT ? OFFSET ?
    `;

    db.all(query, [limit, offset], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ 
                error: 'Internal server error',
                message: 'Failed to retrieve customers'
            });
        }

        // Get total count for pagination
        db.get("SELECT COUNT(*) as total FROM users", (err, countRow) => {
            if (err) {
                return res.status(500).json({ 
                    error: 'Internal server error',
                    message: 'Failed to get total count'
                });
            }

            const totalPages = Math.ceil(countRow.total / limit);
            
            res.json({
                customers: rows,
                pagination: {
                    current_page: page,
                    total_pages: totalPages,
                    total_customers: countRow.total,
                    limit: limit
                }
            });
        });
    });
});

// GET /customers/:id - Get specific customer details with order count
app.get('/customers/:id', (req, res) => {
    const customerId = parseInt(req.params.id);

    if (isNaN(customerId)) {
        return res.status(400).json({
            error: 'Invalid customer ID',
            message: 'Customer ID must be a valid number'
        });
    }

    const query = `
        SELECT 
            u.*,
            COUNT(o.order_id) as order_count,
            COUNT(CASE WHEN o.status = 'Delivered' THEN 1 END) as delivered_orders,
            COUNT(CASE WHEN o.status = 'Cancelled' THEN 1 END) as cancelled_orders
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.id = ?
        GROUP BY u.id
    `;

    db.get(query, [customerId], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to retrieve customer details'
            });
        }

        if (!row) {
            return res.status(404).json({
                error: 'Customer not found',
                message: `Customer with ID ${customerId} does not exist`
            });
        }

        res.json({
            customer: {
                id: row.id,
                first_name: row.first_name,
                last_name: row.last_name,
                email: row.email,
                age: row.age,
                gender: row.gender,
                state: row.state,
                street_address: row.street_address,
                postal_code: row.postal_code,
                city: row.city,
                country: row.country,
                latitude: row.latitude,
                longitude: row.longitude,
                traffic_source: row.traffic_source,
                created_at: row.created_at,
                order_statistics: {
                    total_orders: row.order_count,
                    delivered_orders: row.delivered_orders,
                    cancelled_orders: row.cancelled_orders
                }
            }
        });
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Customer API is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Endpoint not found',
        message: `The requested endpoint ${req.originalUrl} does not exist`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong on the server'
    });
});

// Start server
async function startServer() {
    try {
        await initializeDatabase();
        
        app.listen(PORT, () => {
            console.log(`🚀 Customer API server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`👥 Customers: http://localhost:${PORT}/customers`);
            console.log(`👤 Customer details: http://localhost:${PORT}/customers/:id`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
}); 