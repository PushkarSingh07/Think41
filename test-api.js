const http = require('http');

// Test health endpoint
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
            testCustomers();
        });
    });

    req.on('error', (err) => {
        console.error('❌ Health check failed:', err.message);
    });

    req.end();
}

// Test customers endpoint
function testCustomers() {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/customers?page=1&limit=3',
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            console.log('✅ Customers response:');
            console.log(`   - Found ${response.customers.length} customers`);
            console.log(`   - Total customers: ${response.pagination.total_customers}`);
            console.log(`   - Current page: ${response.pagination.current_page}`);
            
            if (response.customers.length > 0) {
                testCustomerDetails(response.customers[0].id);
            } else {
                console.log('❌ No customers found');
            }
        });
    });

    req.on('error', (err) => {
        console.error('❌ Customers test failed:', err.message);
    });

    req.end();
}

// Test customer details endpoint
function testCustomerDetails(customerId) {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: `/customers/${customerId}`,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            const response = JSON.parse(data);
            console.log('✅ Customer details response:');
            console.log(`   - Customer: ${response.customer.first_name} ${response.customer.last_name}`);
            console.log(`   - Email: ${response.customer.email}`);
            console.log(`   - Total orders: ${response.customer.order_statistics.total_orders}`);
            console.log(`   - Delivered orders: ${response.customer.order_statistics.delivered_orders}`);
            console.log(`   - Cancelled orders: ${response.customer.order_statistics.cancelled_orders}`);
            
            console.log('\n🎉 All tests completed successfully!');
            console.log('\n📋 API Summary:');
            console.log('   - Health check: ✅ Working');
            console.log('   - List customers: ✅ Working');
            console.log('   - Customer details: ✅ Working');
            console.log('\n🚀 Your Customer API is ready!');
        });
    });

    req.on('error', (err) => {
        console.error('❌ Customer details test failed:', err.message);
    });

    req.end();
}

console.log('🧪 Testing Customer API...\n');
testHealth(); 