// frontend\src\context\AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState(false);

    // Check if there is a token in localStorage when app first loads
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUser(decoded.user);
            setAuth(true);
        }
    }, []);

    // This function will be used to update the user after successful login
    const setAuthUser = (user) => {
        setUser(user);
        setAuth(true);
    };

     // Define the logout function
     const logout = () => {
        localStorage.removeItem('token');  // Remove token from local storage
        setUser(null);  // Reset user state
        setAuth(false);  // Reset auth state
    };

    return (
        <AuthContext.Provider value={{ user, auth, setAuth, setAuthUser , logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
