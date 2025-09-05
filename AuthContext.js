import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { base64UrlDecode } from './utils/jwtUtils';

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
        console.log('Stored token:', token);
        if (token) {
          // Decode token to get user info
          const tokenParts = token.split('.');
          console.log('Token parts on load:', tokenParts);
          const payloadStr = tokenParts[1];
          console.log('Payload string on load:', payloadStr);
          const decoded = base64UrlDecode(payloadStr);
          console.log('Decoded payload on load:', decoded);
          const payload = JSON.parse(decoded);
          console.log('Parsed payload on load:', payload);
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
