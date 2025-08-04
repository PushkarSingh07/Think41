import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerList.css';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [pagination, setPagination] = useState({});

  const API_BASE_URL = 'http://localhost:3000';

  // Fetch customers from API
  const fetchCustomers = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/customers?page=${page}&limit=20`);
      
      setCustomers(response.data.customers);
      setFilteredCustomers(response.data.customers);
      setPagination(response.data.pagination);
      setCurrentPage(response.data.pagination.current_page);
      setTotalPages(response.data.pagination.total_pages);
      setTotalCustomers(response.data.pagination.total_customers);
    } catch (err) {
      setError('Failed to fetch customers. Please check if the API server is running.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle search functionality
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        customer.first_name?.toLowerCase().includes(term) ||
        customer.last_name?.toLowerCase().includes(term) ||
        customer.email?.toLowerCase().includes(term)
      );
      setFilteredCustomers(filtered);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchCustomers(newPage);
    }
  };

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Loading component
  if (loading && customers.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading customers...</p>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={() => fetchCustomers()} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="customer-list-container">
      {/* Header */}
      <div className="header">
        <h1>👥 Customer Management</h1>
        <div className="stats">
          <span>📊 Total Customers: {totalCustomers.toLocaleString()}</span>
          <span>📄 Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* Customer Cards */}
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
                <span>{customer.city}, {customer.country}</span>
              </div>
              <div className="order-count">
                📦 {customer.order_count || 0} orders
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!searchTerm && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            ← Previous
          </button>
          
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i;
              if (pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`page-button ${pageNum === currentPage ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next →
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredCustomers.length === 0 && !loading && (
        <div className="empty-state">
          <h3>No customers found</h3>
          <p>Try adjusting your search terms or check the API connection.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerList; 