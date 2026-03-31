import React, { useState, useEffect, useContext } from 'react';
import { api } from '../api';
import UserContext from './UserContextInstance';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      // Step 1: Immediately load from cache so sidebar is never empty
      const cached = localStorage.getItem('user_profile');
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch (e) {
          console.warn('Failed to parse cached user:', e);
        }
      }

      // Step 2: Try to fetch fresh data from backend
      try {
        const token = localStorage.getItem('access_token');
        if (!token) { setIsLoaded(true); return; }

        const response = await api.authenticatedRequest('/auth/profile/');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          localStorage.setItem('user_profile', JSON.stringify(data));
        }
      } catch (err) {
        console.warn('Could not fetch user profile from API:', err.message);
      }

      setIsLoaded(true);
    };

    loadUser();
  }, []);

  const updateUser = (newData) => {
    setUser(newData);
    localStorage.setItem('user_profile', JSON.stringify(newData));
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem('user_profile');
  };

  return (
    <UserContext.Provider value={{ user, isLoaded, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}
