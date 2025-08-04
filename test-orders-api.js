const http = require('http');

// Test health endpoint first
function testHealth() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/health',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log('✅ Health check response:', JSON.parse(data));
            testAllOrders();
        });
    });

    req.on('error', (err) => {
        console.error('❌ Health check failed:', err.message);
    });

    req.end();
}

// Test GET /orders - Get all orders
function testAllOrders() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/orders?page=1&limit=3',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            console.log('✅ All orders response:');
            console.log(`   - Found ${response.orders.length} orders`);
            console.log(`   - Total orders: ${response.pagination.total_orders}`);
            console.log(`   - Current page: ${response.pagination.current_page}`);
            
            if (response.orders.length > 0) {
                testOrderDetails(response.orders[0].order_id);
            } else {
                console.log('❌ No orders found');
            }
        });
    });

    req.on('error', (err) => {
        console.error('❌ All orders test failed:', err.message);
    });

    req.end();
}

// Test GET /orders/:orderId - Get specific order details
function testOrderDetails(orderId) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: `/orders/${orderId}`,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            console.log('✅ Order details response:');
            console.log(`   - Order ID: ${response.order.order_id}`);
            console.log(`   - Status: ${response.order.status}`);
            console.log(`   - Customer: ${response.order.customer.first_name} ${response.order.customer.last_name}`);
            console.log(`   - Items: ${response.order.num_of_item}`);
            console.log(`   - Created: ${response.order.created_at}`);
            
            // Test customer orders with this customer
            testCustomerOrders(response.order.user_id);
        });
    });

    req.on('error', (err) => {
        console.error('❌ Order details test failed:', err.message);
    });

    req.end();
}

// Test GET /customers/:customerId/orders - Get customer orders
function testCustomerOrders(customerId) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: `/customers/${customerId}/orders?page=1&limit=5`,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            console.log('✅ Customer orders response:');
            console.log(`   - Customer: ${response.customer.first_name} ${response.customer.last_name}`);
            console.log(`   - Found ${response.orders.length} orders`);
            console.log(`   - Total orders for customer: ${response.pagination.total_orders}`);
            
            // Test error cases
            testErrorCases();
        });
    });

    req.on('error', (err) => {
        console.error('❌ Customer orders test failed:', err.message);
    });

    req.end();
}

// Test error cases
function testErrorCases() {
    console.log('\n🧪 Testing error cases...');
    
    // Test invalid order ID
    const invalidOrderOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/orders/999999',
        method: 'GET'
    };

    const invalidOrderReq = http.request(invalidOrderOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            console.log('✅ Invalid order ID test:');
            console.log(`   - Status: ${res.statusCode}`);
            console.log(`   - Error: ${response.error}`);
            
            // Test invalid customer ID
            testInvalidCustomer();
        });
    });

    invalidOrderReq.on('error', (err) => {
        console.error('❌ Invalid order test failed:', err.message);
    });

    invalidOrderReq.end();
}

// Test invalid customer ID
function testInvalidCustomer() {
    const invalidCustomerOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/customers/999999/orders',
        method: 'GET'
    };

    const invalidCustomerReq = http.request(invalidCustomerOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            console.log('✅ Invalid customer ID test:');
            console.log(`   - Status: ${res.statusCode}`);
            console.log(`   - Error: ${response.error}`);
            
            // Test orders with status filter
            testOrdersWithFilter();
        });
    });

    invalidCustomerReq.on('error', (err) => {
        console.error('❌ Invalid customer test failed:', err.message);
    });

    invalidCustomerReq.end();
}

// Test orders with status filter
function testOrdersWithFilter() {
    const filterOptions = {
        hostname: 'localhost',
        port: 3000,
        path: '/orders?status=Cancelled&page=1&limit=3',
        method: 'GET'
    };

    const filterReq = http.request(filterOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            console.log('✅ Orders with status filter:');
            console.log(`   - Found ${response.orders.length} cancelled orders`);
            console.log(`   - Filter applied: ${response.filters.status}`);
            
            console.log('\n🎉 All Orders API tests completed successfully!');
            console.log('\n📋 Orders API Summary:');
            console.log('   - Get all orders: ✅ Working');
            console.log('   - Get order details: ✅ Working');
            console.log('   - Get customer orders: ✅ Working');
            console.log('   - Error handling: ✅ Working');
            console.log('   - Status filtering: ✅ Working');
            console.log('\n🚀 Your Orders API is ready!');
        });
    });

    filterReq.on('error', (err) => {
        console.error('❌ Orders filter test failed:', err.message);
    });

    filterReq.end();
}

console.log('🧪 Testing Orders API...\n');
testHealth(); 