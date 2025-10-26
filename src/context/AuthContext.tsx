import type {ReactNode} from 'react';
import {createContext, useContext, useState} from "react";
import { loginApi } from "../api/authApi.ts";

type AuthContextType = {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );

    const login = async (username: string, password: string) => {
        try {
            const result = await loginApi(username, password);

            if (result.success && result.token) {
                // ✅ сохраняем токен и статус
                localStorage.setItem("token", result.token);
                localStorage.setItem("isAuthenticated", "true");
                setIsAuthenticated(true);
                return true;
            }

            return false;
        } catch (error) {
            console.error("Ошибка при логине:", error);
            return false;
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
