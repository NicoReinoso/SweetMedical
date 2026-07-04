import { createContext, useContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  // Recupera sesión previa al recargar la página
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const p = jwtDecode(token);
      return p.exp * 1000 < Date.now() ? null : p;
    } catch { return null; }
  });

  const login = (token) => {

    localStorage.setItem("token", token);

    const usuario = jwtDecode(token);

    setUser(usuario);

    return usuario;
  };

    const logout = () => {
    localStorage.
    removeItem('token');
        
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ user, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
