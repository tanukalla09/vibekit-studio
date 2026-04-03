import { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem('vibekit_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);
  const login = (userData, token) => {
    localStorage.setItem('vibekit_user', JSON.stringify(userData));
    localStorage.setItem('vibekit_token', token);
    setUser(userData);
  };
  const logout = () => {
    localStorage.removeItem('vibekit_user');
    localStorage.removeItem('vibekit_token');
    setUser(null);
  };
  const getToken = () => localStorage.getItem('vibekit_token');
  return (
    <AuthContext.Provider value={{ user, login, logout, getToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);