import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const json = localStorage.getItem('auth_user');
    return json ? JSON.parse(json) : null;
  });

  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('auth_token');
    // Set authorization header if token exists
    if (storedToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
    }
    return storedToken;
  });

  const [loading, setLoading] = useState(!!token && !user);

  // Verify token on mount if we have a token but no user
  useEffect(() => {
    if (token && !user) {
      setLoading(true);
      axios.get('/api/me')
        .then((response) => {
          setUser(response.data);
          localStorage.setItem('auth_user', JSON.stringify(response.data));
        })
        .catch((error) => {
          console.error('Token verification failed:', error);
          // Token is invalid, clear it
          setToken(null);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
          delete axios.defaults.headers.common.Authorization;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, user]);

  const setAuth = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', tokenData);
    axios.defaults.headers.common.Authorization = `Bearer ${tokenData}`;
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (e) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    delete axios.defaults.headers.common.Authorization;
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
