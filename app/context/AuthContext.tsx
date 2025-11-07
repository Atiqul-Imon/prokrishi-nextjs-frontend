"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import {
  fetchProfile,
  loginUser,
  registerUser,
  logoutUser,
} from "../utils/api";
import { AuthContextType } from "@/types/context";
import { User } from "@/types/models";
import { LoginFormData, RegisterFormData } from "@/types/forms";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from token on mount
  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      try {
        if (
          typeof window !== "undefined" &&
          localStorage.getItem("accessToken")
        ) {
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
  async function register(form: RegisterFormData) {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(form as any);
      setUser(data.user);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  }

  // Login and store user
  async function login(form: LoginFormData) {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(form as any);
      setUser(data.user);
      setLoading(false);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      setLoading(false);
      return { success: false, message };
    }
  }

  // Logout
  function logout() {
    logoutUser();
    setUser(null);
    setError(null);
  }

  // Update user (after profile update)
  function updateUser(updatedUser: User) {
    setUser(updatedUser);
  }

  // Memoize isAdmin check (includes both admin and super_admin roles)
  const isAdmin = useMemo(() => user?.role === 'admin' || user?.role === 'super_admin', [user]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      loading,
      error,
      isAdmin,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, loading, error, isAdmin]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

