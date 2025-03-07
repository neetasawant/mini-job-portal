"use client"
import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setUser(JSON.parse(storedUser));
            setToken(storedToken);
        }
    }, []);

    //login
    const login = async (email, password) => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });

            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            setToken(res.data.token);

            return res.data.user; 
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            throw error;
        }
    };

    //register
    const register = async (name, email, password, role) => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });

            
            await login(email, password);
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message);
            throw error;
        }
    };

    
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
