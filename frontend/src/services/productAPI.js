const API_BASE_URL = 'http://localhost:3000/api/v1';

const productAPI = {
  // Get all products with pagination and search
  getProducts: async (page = 1, limit = 10, search = '') => {
    let url = `${API_BASE_URL}/products?page=${page}&limit=${limit}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get single product by ID
  getProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/product/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Create new product
  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/product`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Update existing product
  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/product/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Delete product
  deleteProduct: async (id, permanent = false) => {
    const response = await fetch(`${API_BASE_URL}/product/${id}?permanent=${permanent}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get products by category
  getProductsByCategory: async (categoryId, page = 1, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/products?categoryId=${categoryId}&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Search products
  searchProducts: async (query, page = 1, limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};

export { productAPI };
export default productAPI;