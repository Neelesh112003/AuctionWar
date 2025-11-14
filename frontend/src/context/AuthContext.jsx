import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [coins, setCoins] = useState(0);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('username');
    const savedUserId = localStorage.getItem('userId');
    const savedToken = localStorage.getItem('token');
    const savedCoins = localStorage.getItem('coins');

    if (savedUser && savedToken && savedUserId) {
      setIsAuthenticated(true);
      setUserId(savedUserId);
      setUsername(savedUser);
      setCoins(parseInt(savedCoins, 10) || 0);
      setToken(savedToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }
  }, []);

  const loadUser = async () => {
    if (!token) return;
    try {
      const res = await api.get('/auth/me');
      const userData = res.data.data;
      const id = userData.id || userData._id;

      setUserId(id);
      setUsername(userData.username);
      setCoins(userData.points);
      localStorage.setItem('userId', String(id));
      localStorage.setItem('username', userData.username);
      localStorage.setItem('coins', String(userData.points));
    } catch (error) {
      logout();
    }
  };

  const login = (user, newToken, userCoins = 0, id) => {
    localStorage.setItem('username', user);
    localStorage.setItem('token', newToken);
    localStorage.setItem('coins', String(userCoins));
    localStorage.setItem('userId', String(id));

    setUserId(String(id));
    setUsername(user);
    setIsAuthenticated(true);
    setCoins(userCoins);
    setToken(newToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('coins');
    localStorage.removeItem('userId');
    setUserId(null);
    setUsername(null);
    setIsAuthenticated(false);
    setCoins(0);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user: { id: userId, username, points: coins },
        username,
        userId,
        token,
        login,
        logout,
        loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
