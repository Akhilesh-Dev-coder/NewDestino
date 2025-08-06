import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));

  const login = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
