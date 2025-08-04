# Think41 - Customer API Project

This repository contains a complete Customer API implementation built with Node.js, Express, and SQLite.

## 🚀 Customer API Features

- ✅ **RESTful API** with proper JSON responses
- ✅ **List all customers** with pagination support
- ✅ **Get specific customer details** with order statistics
- ✅ **Error handling** (404, 400, 500 status codes)
- ✅ **CORS headers** for frontend integration
- ✅ **SQLite database** with CSV data import
- ✅ **Health check endpoint**

## 📋 API Endpoints

### 1. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "OK",
  "message": "Customer API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 2. List All Customers
```
GET /customers?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of customers per page (default: 10)

**Response:**
```json
{
  "customers": [
    {
      "id": 457,
      "first_name": "Timothy",
      "last_name": "Bush",
      "email": "timothybush@example.net",
      "age": 65,
      "gender": "M",
      "state": "Acre",
      "city": "Rio Branco",
      "country": "Brasil",
      "order_count": 3
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 50,
    "total_customers": 60319,
    "limit": 10
  }
}
```

### 3. Get Customer Details
```
GET /customers/:id
```

**Response:**
```json
{
  "customer": {
    "id": 457,
    "first_name": "Timothy",
    "last_name": "Bush",
    "email": "timothybush@example.net",
    "age": 65,
    "gender": "M",
    "state": "Acre",
    "street_address": "87620 Johnson Hills",
    "postal_code": "69917-400",
    "city": "Rio Branco",
    "country": "Brasil",
    "latitude": -9.945567619,
    "longitude": -67.83560991,
    "traffic_source": "Search",
    "created_at": "2022-07-19 13:51:00+00:00",
    "order_statistics": {
      "total_orders": 3,
      "delivered_orders": 2,
      "cancelled_orders": 1
    }
  }
}
```

## 🛠️ Setup & Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

   The server will automatically:
   - Create SQLite database
   - Import data from `users.csv` and `orders.csv`
   - Start the API server on port 3000

## 🧪 Testing

### Using the test script:
```bash
node test-api.js
```

### Using curl:
```bash
# Health check
curl http://localhost:3000/health

# List customers
curl http://localhost:3000/customers?page=1&limit=5

# Get customer details
curl http://localhost:3000/customers/457
```

## 📊 Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `first_name`, `last_name`, `email` (TEXT)
- `age` (INTEGER), `gender` (TEXT)
- `state`, `street_address`, `postal_code`, `city`, `country` (TEXT)
- `latitude`, `longitude` (REAL)
- `traffic_source`, `created_at` (TEXT)

### Orders Table
- `order_id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `status`, `gender` (TEXT)
- `created_at`, `returned_at`, `shipped_at`, `delivered_at` (TEXT)
- `num_of_item` (INTEGER)

## 📁 Project Structure

```
Think41/
├── server.js          # Main API server (316 lines)
├── package.json       # Dependencies and scripts
├── README.md         # This documentation
├── test-api.js       # Automated testing
├── users.csv         # 60,319 customer records
├── orders.csv        # Order data
├── .gitignore        # Proper file exclusions
└── customer_data.db  # SQLite database (auto-generated)
```

## 🛡️ Error Handling

### Customer Not Found (404)
```json
{
  "error": "Customer not found",
  "message": "Customer with ID 999 does not exist"
}
```

### Invalid Customer ID (400)
```json
{
  "error": "Invalid customer ID",
  "message": "Customer ID must be a valid number"
}
```

## 🚀 Production Deployment

For production deployment:
1. Set environment variables as needed
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

## 📈 Business Value

This API serves as a **foundation for customer analytics and order management systems**, providing:
- **Customer insights** with order statistics
- **Scalable architecture** ready for production
- **Frontend-ready** with CORS support
- **RESTful design** following industry standards

## 🔧 Dependencies

- **express**: Web framework
- **sqlite3**: SQLite database driver
- **csv-parser**: CSV file parsing
- **cors**: Cross-origin resource sharing

## 📝 License

ISC

---

**Built with ❤️ for the Think41 project**
