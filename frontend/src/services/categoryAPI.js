// API base configuration
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Category API services
export const categoryAPI = {
  // Get all categories with pagination and search
  getCategories: async (params = {}) => {
    const { page = 1, limit = 10, search = '', active } = params;
    
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
      ...(active !== undefined && { active: active.toString() })
    });

    const response = await fetch(`${API_BASE_URL}/categories?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Get category by ID
  getCategory: async (id) => {
    const response = await fetch(`${API_BASE_URL}/category/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Alternative method (for backward compatibility)
  getCategoryById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Create new category
  createCategory: async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Update category
  updateCategory: async (id, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/category/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  // Delete category
  deleteCategory: async (id, permanent = false) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}?permanent=${permanent}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }
};

export default categoryAPI;