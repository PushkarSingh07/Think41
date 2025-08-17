# Think41 - Customer Management System

This repository contains a complete Customer Management System built with Node.js, Express, SQLite, and React.

## 🌐 Project Overview

This project was developed in four key milestones:

1. **Database Design & Data Loading**: SQLite database setup with customer and order data
2. **Customer API**: RESTful endpoints for customer information
3. **Orders API**: RESTful endpoints for order management
4. **Frontend Implementation**: React UI for customer list and search


<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/bcf724a1-0e31-49f1-8c3e-915ff4299862" />


<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/eec9edc9-f550-430b-8755-823b10e6108f" />


## �️ Milestone 1: Database Design & Data Loading

- ✅ **Database Setup**: SQLite database configuration
- ✅ **Schema Design**: Tables for users and orders with appropriate relationships
- ✅ **Data Import**: Loading data from users.csv and orders.csv files
- ✅ **Data Validation**: Ensuring data integrity during import
- ✅ **Relationship Modeling**: Foreign key constraints between users and orders

## 🚀 Milestone 2: Customer API

- ✅ **RESTful API** with proper JSON responses
- ✅ **List all customers** with pagination support
- ✅ **Get specific customer details** including order count
- ✅ **Error handling** (404, 400, 500 status codes)
- ✅ **CORS headers** for frontend integration
- ✅ **Health check endpoint**

## 📦 Milestone 3: Orders API

- ✅ **Get all orders** for a specific customer
- ✅ **Get specific order details** with complete information
- ✅ **Filter orders** by status and other criteria
- ✅ **Proper error handling** for order-related requests
- ✅ **Customer-order relationship** management

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

### 4. Get Customer Orders
```
GET /customers/:customerId/orders?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of orders per page (default: 10)

**Response:**
```json
{
  "customer": {
    "id": 457,
    "first_name": "Timothy",
    "last_name": "Bush"
  },
  "orders": [
    {
      "order_id": 8,
      "user_id": 457,
      "status": "Cancelled",
      "gender": "F",
      "created_at": "2022-10-20 10:03:00+00:00",
      "returned_at": null,
      "shipped_at": null,
      "delivered_at": null,
      "num_of_item": 3,
      "first_name": "Timothy",
      "last_name": "Bush",
      "email": "timothybush@example.net"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_orders": 3,
    "limit": 10
  }
}
```

### 5. Get Order Details
```
GET /orders/:orderId
```

**Response:**
```json
{
  "order": {
    "order_id": 8,
    "user_id": 457,
    "status": "Cancelled",
    "gender": "F",
    "created_at": "2022-10-20 10:03:00+00:00",
    "returned_at": null,
    "shipped_at": null,
    "delivered_at": null,
    "num_of_item": 3,
    "customer": {
      "id": 457,
      "first_name": "Timothy",
      "last_name": "Bush",
      "email": "timothybush@example.net",
      "age": 65,
      "state": "Acre",
      "city": "Rio Branco",
      "country": "Brasil"
    }
  }
}
```

### 6. Get All Orders
```
GET /orders?page=1&limit=10&status=Cancelled
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of orders per page (default: 10)
- `status` (optional): Filter by order status (e.g., "Cancelled", "Delivered")

**Response:**
```json
{
  "orders": [
    {
      "order_id": 8,
      "user_id": 457,
      "status": "Cancelled",
      "gender": "F",
      "created_at": "2022-10-20 10:03:00+00:00",
      "returned_at": null,
      "shipped_at": null,
      "delivered_at": null,
      "num_of_item": 3,
      "first_name": "Timothy",
      "last_name": "Bush",
      "email": "timothybush@example.net"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 100,
    "total_orders": 1000,
    "limit": 10
  },
  "filters": {
    "status": "Cancelled"
  }
}
```

## 🛠️ Setup & Installation

### Complete Setup (Backend & Frontend)

1. **Run the setup script:**
   ```bash
   setup.bat
   ```
   
   This will install both backend and frontend dependencies.

2. **Start both the API and frontend:**
   ```bash
   npm run dev-all
   ```

   This starts:
   - Backend API server on port 3000
   - Frontend development server on port 3001

### Backend Only

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

### Using the test scripts:
```bash
# Test Customer API
node test-api.js

# Test Orders API
node test-orders-api.js
```

### Using curl:
```bash
# Health check
curl http://localhost:3000/health

# List customers
curl http://localhost:3000/customers?page=1&limit=5

# Get customer details
curl http://localhost:3000/customers/457

# Get customer orders
curl http://localhost:3000/customers/457/orders

# Get all orders
curl http://localhost:3000/orders?page=1&limit=5

# Get order details
curl http://localhost:3000/orders/8

# Get orders with status filter
curl http://localhost:3000/orders?status=Cancelled&page=1&limit=5
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
├── server.js          # Main API server (500+ lines)
├── package.json       # Dependencies and scripts
├── README.md         # This documentation
├── test-api.js       # Customer API testing
├── test-orders-api.js # Orders API testing
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

This project serves as a **foundation for customer analytics and order management systems**, providing:
- **Customer insights** with order statistics
- **Scalable architecture** ready for production
- **Frontend-ready** with CORS support
- **RESTful design** following industry standards

## 🔧 Dependencies

- **express**: Web framework
- **sqlite3**: SQLite database driver
- **csv-parser**: CSV file parsing
- **cors**: Cross-origin resource sharing

## 🖥️ Milestone 4: Frontend Implementation

The project includes a React frontend for customer management:

### Features
- ✅ **Customer List View**: Displays all customers in a card format
- ✅ **Search Functionality**: Search customers by name or email
- ✅ **Customer Summary**: Shows customer name, email, and order count
- ✅ **API Integration**: Fetches data from the Customer API endpoints
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Pagination**: Navigate through large customer lists
- ✅ **Loading States**: Visual feedback during API requests

### Frontend Setup

1. Install frontend dependencies:
   ```
   npm run install-frontend
   ```

2. Start the frontend development server:
   ```
   npm run frontend
   ```
   
   The frontend will be available at http://localhost:3001

### Running Both Backend and Frontend

Run both the backend API and frontend concurrently with:

```
npm run dev-all
```

## 📁 Project Structure

```
CustomerAPIThink41/
│
├── server.js              # Main API server with all endpoints
├── customer_data.db       # SQLite database (Milestone 1)
├── ecommerce.db           # SQLite database
├── load_data.py           # Script to load data into database
├── orders.csv             # Sample orders data
├── users.csv              # Sample users data
├── test-api.js            # Test script for Customer API (Milestone 2)
├── test-orders-api.js     # Test script for Orders API (Milestone 3)
│
├── frontend/              # React frontend application (Milestone 4)
│   ├── public/            # Public assets
│   └── src/               # React source code
│       ├── components/    # React components
│       │   └── CustomerList.js
│       ├── App.js
│       └── index.js
```

## 📝 License

ISC

---

**Built with ❤️ for the Think41 project**



