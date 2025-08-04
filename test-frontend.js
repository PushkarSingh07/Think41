const http = require('http');

// Test if the API is accessible from frontend
function testAPIConnection() {
  console.log('🧪 Testing Frontend-API Connection...\n');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/customers?page=1&limit=5',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        console.log('✅ API Connection Test:');
        console.log(`   - Status: ${res.statusCode}`);
        console.log(`   - Customers found: ${response.customers?.length || 0}`);
        console.log(`   - Total customers: ${response.pagination?.total_customers || 0}`);
        console.log(`   - Current page: ${response.pagination?.current_page || 0}`);
        
        if (response.customers && response.customers.length > 0) {
          const customer = response.customers[0];
          console.log(`   - Sample customer: ${customer.first_name} ${customer.last_name}`);
          console.log(`   - Email: ${customer.email}`);
          console.log(`   - Orders: ${customer.order_count}`);
        }
        
        console.log('\n🎉 Frontend-API connection is working!');
        console.log('📱 You can now start the React frontend:');
        console.log('   cd frontend && npm start');
        console.log('\n🌐 Frontend will be available at: http://localhost:3001');
        console.log('🔗 API is available at: http://localhost:3000');
        
      } catch (error) {
        console.error('❌ Error parsing API response:', error.message);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ API Connection Failed:');
    console.error('   - Make sure your API server is running');
    console.error('   - Run: npm start (in the main directory)');
    console.error('   - Error:', error.message);
  });

  req.end();
}

// Test CORS headers
function testCORSHeaders() {
  console.log('\n🔍 Testing CORS Headers...');
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log('✅ CORS Headers Test:');
    console.log(`   - Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'Not set'}`);
    console.log(`   - Access-Control-Allow-Methods: ${res.headers['access-control-allow-methods'] || 'Not set'}`);
    console.log(`   - Access-Control-Allow-Headers: ${res.headers['access-control-allow-headers'] || 'Not set'}`);
    
    if (res.headers['access-control-allow-origin']) {
      console.log('   ✅ CORS is properly configured for frontend access');
    } else {
      console.log('   ⚠️ CORS headers not found - frontend may have issues');
    }
  });

  req.on('error', (error) => {
    console.error('❌ CORS test failed:', error.message);
  });

  req.end();
}

// Run tests
testAPIConnection();
setTimeout(testCORSHeaders, 1000); 