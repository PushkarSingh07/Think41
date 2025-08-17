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

// ORDERS API ENDPOINTS

// GET /customers/:customerId/orders - Get all orders for a specific customer
app.get('/customers/:customerId/orders', (req, res) => {
    const customerId = parseInt(req.params.customerId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    if (isNaN(customerId)) {
        return res.status(400).json({
            error: 'Invalid customer ID',
            message: 'Customer ID must be a valid number'
        });
    }

    // First check if customer exists
    db.get("SELECT id, first_name, last_name FROM users WHERE id = ?", [customerId], (err, customer) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to check customer existence'
            });
        }

        if (!customer) {
            return res.status(404).json({
                error: 'Customer not found',
                message: `Customer with ID ${customerId} does not exist`
            });
        }

        // Get orders for the customer
        const query = `
            SELECT 
                o.order_id,
                o.user_id,
                o.status,
                o.gender,
                o.created_at,
                o.returned_at,
                o.shipped_at,
                o.delivered_at,
                o.num_of_item,
                u.first_name,
                u.last_name,
                u.email
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
            LIMIT ? OFFSET ?
        `;

        db.all(query, [customerId, limit, offset], (err, orders) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({
                    error: 'Internal server error',
                    message: 'Failed to retrieve orders'
                });
            }

            // Get total count for pagination
            db.get("SELECT COUNT(*) as total FROM orders WHERE user_id = ?", [customerId], (err, countRow) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Internal server error',
                        message: 'Failed to get total count'
                    });
                }

                const totalPages = Math.ceil(countRow.total / limit);
                
                res.json({
                    customer: {
                        id: customer.id,
                        first_name: customer.first_name,
                        last_name: customer.last_name
                    },
                    orders: orders,
                    pagination: {
                        current_page: page,
                        total_pages: totalPages,
                        total_orders: countRow.total,
                        limit: limit
                    }
                });
            });
        });
    });
});

// GET /orders/:orderId - Get specific order details
app.get('/orders/:orderId', (req, res) => {
    const orderId = parseInt(req.params.orderId);

    if (isNaN(orderId)) {
        return res.status(400).json({
            error: 'Invalid order ID',
            message: 'Order ID must be a valid number'
        });
    }

    const query = `
        SELECT 
            o.order_id,
            o.user_id,
            o.status,
            o.gender,
            o.created_at,
            o.returned_at,
            o.shipped_at,
            o.delivered_at,
            o.num_of_item,
            u.first_name,
            u.last_name,
            u.email,
            u.age,
            u.state,
            u.city,
            u.country
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.order_id = ?
    `;

    db.get(query, [orderId], (err, order) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to retrieve order details'
            });
        }

        if (!order) {
            return res.status(404).json({
                error: 'Order not found',
                message: `Order with ID ${orderId} does not exist`
            });
        }

        res.json({
            order: {
                order_id: order.order_id,
                user_id: order.user_id,
                status: order.status,
                gender: order.gender,
                created_at: order.created_at,
                returned_at: order.returned_at,
                shipped_at: order.shipped_at,
                delivered_at: order.delivered_at,
                num_of_item: order.num_of_item,
                customer: {
                    id: order.user_id,
                    first_name: order.first_name,
                    last_name: order.last_name,
                    email: order.email,
                    age: order.age,
                    state: order.state,
                    city: order.city,
                    country: order.country
                }
            }
        });
    });
});

// GET /orders - Get all orders with pagination and optional filtering
app.get('/orders', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status; // Optional filter by status
    const offset = (page - 1) * limit;

    let query = `
        SELECT 
            o.order_id,
            o.user_id,
            o.status,
            o.gender,
            o.created_at,
            o.returned_at,
            o.shipped_at,
            o.delivered_at,
            o.num_of_item,
            u.first_name,
            u.last_name,
            u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
    `;

    let countQuery = "SELECT COUNT(*) as total FROM orders";
    let params = [];
    let countParams = [];

    // Add status filter if provided
    if (status) {
        query += " WHERE o.status = ?";
        countQuery += " WHERE status = ?";
        params.push(status);
        countParams.push(status);
    }

    query += " ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    db.all(query, params, (err, orders) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to retrieve orders'
            });
        }

        // Get total count for pagination
        db.get(countQuery, countParams, (err, countRow) => {
            if (err) {
                return res.status(500).json({
                    error: 'Internal server error',
                    message: 'Failed to get total count'
                });
            }

            const totalPages = Math.ceil(countRow.total / limit);
            
            res.json({
                orders: orders,
                pagination: {
                    current_page: page,
                    total_pages: totalPages,
                    total_orders: countRow.total,
                    limit: limit
                },
                filters: {
                    status: status || null
                }
            });
        });
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Customer & Orders API',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            customers: '/customers',
            customer_details: '/customers/:id',
            customer_orders: '/customers/:customerId/orders',
            orders: '/orders',
            order_details: '/orders/:orderId'
        },
        documentation: 'Check the README.md for detailed API documentation'
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
            console.log(`🚀 Customer & Orders API server running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`👥 Customers: http://localhost:${PORT}/customers`);
            console.log(`👤 Customer details: http://localhost:${PORT}/customers/:id`);
            console.log(`📦 Customer orders: http://localhost:${PORT}/customers/:customerId/orders`);
            console.log(`📋 All orders: http://localhost:${PORT}/orders`);
            console.log(`📄 Order details: http://localhost:${PORT}/orders/:orderId`);
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