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
      const decoded = JSON.parse(atob(payload));
      setUserData(decoded);

      const isExpired = isTokenExpired(decoded.exp);
      if (isExpired) {
        setJwtToken(null);
        setUserData(null);
        Alert.alert('Your session has expired, please log in again.');
        router.push('/login');
      }
    } else {
      setUserData(null);
    }
  };

  const isTokenExpired = (exp) => {
    if (!exp) return true;
    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  };

  const isLoggedIn = () => {
    if (!jwtToken) return false;
    const [, payload] = jwtToken.split('.');
    const decoded = JSON.parse(atob(payload));
    return !isTokenExpired(decoded.exp);
  };

  const handleLogout = async () => {
    await logout();
    setJwtToken(null);
    setUserData(null);
    Alert.alert('Logout successful!');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ jwtToken, userData, handleAuth, handleLogout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
