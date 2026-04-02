// api.js
// A centralized fetch API wrapper to automatically attach JWT tokens to backend requests.

const BASE_URL = "https://resume-ai-1-2dmh.onrender.com/api";

export const api = {
  // Login with email (username) and password
  async login(email, password) {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });
    
    // If login fails (401 Unauthorized, etc.)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to sign in. Please check your credentials.');
    }
    
    // On success, save the tokens
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    return data;
  },

  // Register a new user
  async register(firstName, lastName, email, password) {
    const response = await fetch(`${BASE_URL}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        username: email, 
        email, 
        password, 
        first_name: firstName, 
        last_name: lastName 
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      // Django DRF errors are usually objects mapping fields to arrays of errors
      const firstError = Object.values(errorData)[0];
      throw new Error(Array.isArray(firstError) ? firstError[0] : 'Failed to register.');
    }
    
    return await response.json();
  },

  // A generic request handler for protected endpoints
  async authenticatedRequest(endpoint, options = {}) {
    const token = localStorage.getItem('access_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      // Token is likely expired. In a production app, we would attempt to refresh here.
      // For now, we clear the tokens and force a re-login.
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }

    return response;
  }
};
