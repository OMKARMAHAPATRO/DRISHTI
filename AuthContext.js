import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';

// Helper function to decode base64url
function base64UrlDecode(str) {
  // Replace non-url compatible chars with base64 standard chars
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with trailing '='
  while (str.length % 4) {
    str += '=';
  }
  return decode(str);
}

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Decode token to get user info
          const payload = JSON.parse(base64UrlDecode(token.split('.')[1]));
          setUser(payload.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
