'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<{
    isLoggedIn: boolean;
    login: (token: string) => void;
    logout: () => void;
}>({
    isLoggedIn: false,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        // Initialize state synchronously from localStorage
        const token = localStorage.getItem('token');
        return !!token;
    });

    const login = (token: string) => {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
