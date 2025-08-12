import React, { useState, useEffect } from 'react';
import './ProductCatalog.css';

const ProductCatalog = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(true);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle search input changes
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredProducts(products);
  };

  return (
    <div className="product-catalog">
      <h1>Product Catalog</h1>
      
      <div className="search-container">
        <input type="text" placeholder="Search products..." value={searchQuery} onChange={handleSearchChange} className="search-input"/>
        {searchQuery && (
          <button onClick={clearSearch} className="clear-button">Clear</button>
        )}
      </div>

      {loading && (
        <div className="loading">
          <p>Loading products...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <p>Failed to load products. Please refresh the page to try again.</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <p>No products found matching your search.</p>
            </div>
          ) : (
            <div className="product-list">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    className="product-image"
                  />
                  <div className="product-info">
                    <h3 className="product-title">{product.title}</h3>
                    <p className="product-price">${product.price}</p>
                    <p className="product-category">{product.category}</p>
                    <p className="product-description">
                      {product.description.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductCatalog;