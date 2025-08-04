# Customer API

A RESTful API that provides customer data and order statistics from CSV files.

## Features

- ✅ List all customers with pagination
- ✅ Get specific customer details with order count
- ✅ Proper JSON response format
- ✅ Error handling (customer not found, invalid ID, etc.)
- ✅ CORS headers for frontend integration
- ✅ SQLite database with CSV data import
- ✅ Health check endpoint

## Setup

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

## API Endpoints

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
    "total_customers": 500,
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

## Error Responses

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

### Internal Server Error (500)
```json
{
  "error": "Internal server error",
  "message": "Failed to retrieve customers"
}
```

## Testing

### Using curl

1. **Health check:**
   ```bash
   curl http://localhost:3000/health
   ```

2. **List customers:**
   ```bash
   curl http://localhost:3000/customers?page=1&limit=5
   ```

3. **Get customer details:**
   ```bash
   curl http://localhost:3000/customers/457
   ```

### Using Postman

1. Import the following collection:
   - `GET http://localhost:3000/health`
   - `GET http://localhost:3000/customers?page=1&limit=10`
   - `GET http://localhost:3000/customers/457`

## Database Schema

### Users Table
- `id` (INTEGER PRIMARY KEY)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `email` (TEXT)
- `age` (INTEGER)
- `gender` (TEXT)
- `state` (TEXT)
- `street_address` (TEXT)
- `postal_code` (TEXT)
- `city` (TEXT)
- `country` (TEXT)
- `latitude` (REAL)
- `longitude` (REAL)
- `traffic_source` (TEXT)
- `created_at` (TEXT)

### Orders Table
- `order_id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER, FOREIGN KEY)
- `status` (TEXT)
- `gender` (TEXT)
- `created_at` (TEXT)
- `returned_at` (TEXT)
- `shipped_at` (TEXT)
- `delivered_at` (TEXT)
- `num_of_item` (INTEGER)

## Project Structure

```
CustomerAPI/
├── server.js          # Main API server
├── package.json       # Dependencies and scripts
├── README.md         # This file
├── users.csv         # Customer data
├── orders.csv        # Order data
└── customer_data.db  # SQLite database (created automatically)
```

## Dependencies

- **express**: Web framework
- **sqlite3**: SQLite database driver
- **csv-parser**: CSV file parsing
- **cors**: Cross-origin resource sharing

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## Production

For production deployment:
1. Set environment variables as needed
2. Use a process manager like PM2
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

## License

ISC 