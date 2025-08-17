import axios from 'axios';
import { useEffect, useState } from 'react';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    limit: 10
  });

  const API_BASE_URL = 'http://localhost:3000';

  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/customers?page=${page}&limit=${pagination.limit}`);
      setCustomers(response.data.customers);
      setPagination({
        currentPage: response.data.pagination.current_page,
        totalPages: response.data.pagination.total_pages,
        totalCustomers: response.data.pagination.total_customers,
        limit: response.data.pagination.limit
      });
    } catch (err) {
      console.error("API Error:", err);
      setError('Failed to fetch customers. Please check if the API server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchCustomers(newPage);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.first_name?.toLowerCase().includes(searchTerm) ||
    customer.last_name?.toLowerCase().includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm)
  );

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading && customers.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={() => fetchCustomers()} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      <div className="header">
        <h1>👥 Customer List</h1>
        <div className="stats">
          <span>📊 Total Customers: {pagination.totalCustomers}</span>
        </div>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search customers by name or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {searchTerm && (
          <span className="search-results">
            Found {filteredCustomers.length} customer(s)
          </span>
        )}
      </div>

      {loading && customers.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <div className="customers-grid">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-avatar">
              {customer.first_name?.charAt(0)}{customer.last_name?.charAt(0)}
            </div>
            <div className="customer-info">
              <h3 className="customer-name">
                {customer.first_name} {customer.last_name}
              </h3>
              <p className="customer-email">{customer.email}</p>
              <div className="customer-details">
                <span className="customer-age">Age: {customer.age}</span>
                <span className="customer-gender">Gender: {customer.gender}</span>
              </div>
              <div className="customer-location">
                <span>{customer.city}, {customer.state}</span>
                <span>{customer.country}</span>
              </div>
              <div className="order-count">
                📦 {customer.order_count || 0} orders
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCustomers.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No customers found</h3>
          <p>Try adjusting your search terms or check the API connection.</p>
        </div>
      )}

      {!searchTerm && pagination.totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(1)} 
            disabled={pagination.currentPage === 1}
            className="pagination-button"
          >
            &laquo;
          </button>
          <button 
            onClick={() => handlePageChange(pagination.currentPage - 1)} 
            disabled={pagination.currentPage === 1}
            className="pagination-button"
          >
            &lt;
          </button>
          
          <span className="pagination-info">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(pagination.currentPage + 1)} 
            disabled={pagination.currentPage === pagination.totalPages}
            className="pagination-button"
          >
            &gt;
          </button>
          <button 
            onClick={() => handlePageChange(pagination.totalPages)} 
            disabled={pagination.currentPage === pagination.totalPages}
            className="pagination-button"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
