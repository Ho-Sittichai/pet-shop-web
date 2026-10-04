'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LoginResponse } from '@/types';
import { api } from '@/services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (credentials: { username: string; password: string }, redirectUrl?: string) => Promise<User>;
  register: (data: { username: string; password: string; fullName: string; telephone?: string; email: string; role: string }, redirectUrl?: string) => Promise<User>;
  logout: () => void;
  environment: string;
  apiUrl: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'Development';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    const storedToken = localStorage.getItem('petshop_token');
    const storedUser = localStorage.getItem('petshop_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('petshop_token');
        localStorage.removeItem('petshop_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: { username: string; password: string }, redirectUrl?: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.auth.login(credentials);
      if (res.success && res.data) {
        const authData: LoginResponse = res.data;
        const loggedInUser: User = {
          id: authData.id,
          username: authData.username,
          fullName: authData.fullName,
          email: authData.email,
          role: authData.role,
        };

        setToken(authData.token);
        setUser(loggedInUser);

        localStorage.setItem('petshop_token', authData.token);
        localStorage.setItem('petshop_user', JSON.stringify(loggedInUser));

        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (loggedInUser.role === 'Admin') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }

        return loggedInUser;
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    data: { username: string; password: string; fullName: string; telephone?: string; email: string; role: string },
    redirectUrl?: string
  ): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.auth.register(data);
      if (res.success && res.data) {
        const authData: LoginResponse = res.data;
        const newUser: User = {
          id: authData.id,
          username: authData.username,
          fullName: authData.fullName,
          email: authData.email,
          role: authData.role,
        };

        setToken(authData.token);
        setUser(newUser);

        localStorage.setItem('petshop_token', authData.token);
        localStorage.setItem('petshop_user', JSON.stringify(newUser));

        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (newUser.role === 'Admin') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }

        return newUser;
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('petshop_token');
    localStorage.removeItem('petshop_user');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin,
        login,
        register,
        logout,
        environment,
        apiUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
