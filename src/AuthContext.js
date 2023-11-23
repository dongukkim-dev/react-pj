import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 새로고침 시 로컬 스토리지에서 로그인 상태를 가져옴
    const storedLoginStatus = localStorage.getItem('access_token');
    if (storedLoginStatus) {
      setIsLoggedIn(true);
    }
  }, []);

  const login = () => {
    if (localStorage.getItem('access_token')) {
        setIsLoggedIn(true);
      }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};