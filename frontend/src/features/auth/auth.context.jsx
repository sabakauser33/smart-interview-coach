import { createContext, useState, useEffect } from "react";
import { getMe } from "./services/auth.api";  // ← adjust path as needed

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => { 

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)  // ← start as true

    // ← MOVE getMe HERE — runs only once when app starts
    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);  // ← empty array = runs ONCE only

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading}}>
            {children}
        </AuthContext.Provider>
    )
}