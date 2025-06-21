'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchProfile, loginUser, registerUser, logoutUser } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on mount
  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      try {
        // Only try if accessToken exists in localStorage
        if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
          const data = await fetchProfile();
          setUser(data.user);
        } else {
          setUser(null);
        }
        setError(null);
      } catch {
        setUser(null);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  // Register and auto-login
  async function register(form) {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(form);
      setUser(data.user);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  }

  // Login and store user
  async function login(form) {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(form);
      setUser(data.user);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return { success: false, message: err.message };
    }
  }

  // Logout and clear user/token
  function logout() {
    setLoading(true);
    setError(null);
    try {
      logoutUser();
      setUser(null);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  // Optionally, expose a refresh function to update user from backend (if needed)
  async function refreshUser() {
    setLoading(true);
    try {
      const data = await fetchProfile();
      setUser(data.user);
      setError(null);
    } catch {
      setUser(null);
    }
    setLoading(false);
  }

  return (
    <AuthContext.Provider
      value={{
        user,      // { ...user, role }
        loading,
        error,
        login,
        register,
        logout,
        setError,
        refreshUser,
        isAdmin: user && (user.role === 'admin' || user.role === 'super_admin'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}