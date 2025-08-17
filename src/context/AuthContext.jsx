// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const initialToken = localStorage.getItem('authToken');
const initialUser = localStorage.getItem('authUser'); // Get user on load

if (initialToken) {
    axios.defaults.headers.common['Authorization'] = `Token ${initialToken}`;
}

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(initialToken);
    const [authUser, setAuthUser] = useState(initialUser); // Add state for user

    const login = async (username, password) => {
        const response = await axios.post('https://expense-tracker-moth.onrender.com/api/login/', { username, password });
        setAuthToken(response.data.token);
        setAuthUser(username); // Set the username
        localStorage.setItem('authUser', username); // Store username
        return response;
    };

    const logout = () => {
        setAuthToken(null);
        setAuthUser(null); // Clear the user
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser'); // Remove username from storage
        delete axios.defaults.headers.common['Authorization'];
    };
    
    // ... (signup function is unchanged)
    const signup = async (username, password) => {
        return await axios.post('http://127.0.0.1:8000/api/signup/', { username, password });
    };

    const value = {
        authToken,
        authUser, // Expose the user
        login,
        signup,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};