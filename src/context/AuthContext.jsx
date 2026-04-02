import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@admin.com' && password === 'admin123') {
          const mockUser = { id: 1, name: 'Admin Director', email: 'admin@admin.com', role: 'admin' };
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve(mockUser);
        } else if (email === 'user@user.com' && password === 'user123') {
          const mockUser = { id: 2, name: 'Guest Viewer', email: 'user@user.com', role: 'user' };
          setUser(mockUser);
          localStorage.setItem('user', JSON.stringify(mockUser));
          resolve(mockUser);
        } else {
          reject(new Error('Invalid credentials. Use provided dummy logins.'));
        }
      }, 600);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
