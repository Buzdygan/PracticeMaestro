"use client";

import { useContext } from 'react';
import { AuthContext } from './context';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export const useAuthStatus = () => {
  const { user, loading } = useAuth();
  
  return {
    isAuthenticated: !!user,
    isLoading: loading,
    user,
  };
}; 