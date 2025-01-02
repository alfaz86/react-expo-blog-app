import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, logout } from '@/utils/auth';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [jwtToken, setJwtToken] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    handleAuth();
  }, []);

  const handleAuth = async () => {
    const token = await getToken();
    setJwtToken(token);

    if (token) {
      const [, payload] = token.split('.');
      const data = JSON.parse(atob(payload));
      setUserData(data);
    }
  }

  const handleLogout = async () => {
    await logout();
    setJwtToken(null);
    setUserData(null);
    Alert.alert('Logout successful!');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ jwtToken, userData, handleAuth, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
