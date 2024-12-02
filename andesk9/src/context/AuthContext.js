import React, { createContext, useState, useContext, useEffect } from 'react';

// Crea el contexto de autenticación
const AuthContext = createContext();

// Componente proveedor del contexto
export const AuthProvider = ({ children }) => {
    // Estado global para almacenar los datos de autenticación
    const [authData, setAuthData] = useState(() => {
        // Inicializa el estado con datos del almacenamiento local si están presentes
        const token = localStorage.getItem('authToken');
        const role = localStorage.getItem('role');
        const userName = localStorage.getItem('userName');
        return token && role && userName ? { token, role, userName } : null;
    });

    useEffect(() => {
        try {
            // Recupera el token y el rol del almacenamiento local si existen
            const token = localStorage.getItem('authToken');
            const role = localStorage.getItem('role');
            const userName = localStorage.getItem('userName');
            
            if (token && role && userName) {
                setAuthData({ token, role, userName }); // Recupera tanto el token como el rol y el nombre
            }
        } catch (error) {
            console.error('Error al recuperar los datos de autenticación:', error);
        }
    }, []);

    // Función para iniciar sesión
    const login = ({ token, id, name, role, email}) => { // Desestructuramos el objeto recibido
        try {
            setAuthData({ token, id, name, role }); 
            localStorage.setItem('authToken', token);
            localStorage.setItem('UserId', id);
            localStorage.setItem('userName', name); 
            localStorage.setItem('role', role); 
            localStorage.setItem('email', email);
        } catch (error) {
            console.error('Error al guardar los datos de autenticación:', error);
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        try {
            setAuthData(null); 
            localStorage.removeItem('authToken');
            localStorage.removeItem('role'); 
            localStorage.removeItem('userName'); 
            localStorage.removeItem('UserId'); 
            localStorage.removeItem('email');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para acceder a los datos del contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
