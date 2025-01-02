import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://885d-180-251-235-145.ngrok-free.app/api';

/**
 * Simpan token JWT ke AsyncStorage
 * @param {string} token - JWT token
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('jwt_token', token);
    console.log('Token saved successfully.');
  } catch (error) {
    console.error('Failed to save token:', error);
  }
};

/**
 * Simpan data pengguna ke AsyncStorage
 * @param {Object} user - Data pengguna
 */
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
    console.log('User data saved successfully.');
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

/**
 * Hapus data pengguna dari AsyncStorage
 */
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem('user_data');
    console.log('User data removed successfully.');
  } catch (error) {
    console.error('Failed to remove user data:', error);
  }
};

/**
 * Ambil token JWT dari AsyncStorage
 * @returns {Promise<string|null>} - JWT token atau null jika tidak ada
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('jwt_token');
    return token;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

/**
 * Ambil username dari token JWT yang disimpan di AsyncStorage
 * @returns {Promise<string|null>} - Username atau null jika tidak ada
 */
export const getUsernameFromToken = async () => {
  try {
    const token = await getToken();

    if (!token) return null;

    const [, payload] = token.split('.');
    const data = JSON.parse(atob(payload));
    return data.username;
  } catch (error) {
    console.error('Failed to retrieve username:', error);
    return null;
  }
};

/**
 * Hapus token JWT dari AsyncStorage
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('jwt_token');
    console.log('Token removed successfully.');
  } catch (error) {
    console.error('Failed to remove token:', error);
  }
};

/**
 * Fungsi untuk login
 * @param {string} identifier - Email atau Username
 * @param {string} password - Password
 * @returns {Promise<boolean>} - Status login berhasil atau gagal
 */
export const login = async (identifier, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      identifier, // email atau username
      password,
    });

    const { token, user } = response.data;

    if (token) {
      await saveToken(token); // Simpan token di AsyncStorage
      await saveUser(user); // Simpan data user di AsyncStorage
      console.log('Login successful!');
      return true;
    } else {
      console.error('Login failed: No token received.');
      return false;
    }
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
};

/**
 * Fungsi untuk registrasi
 * @param {string} name - Nama pengguna
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {Promise<boolean>} - Status registrasi berhasil atau gagal
 */
export const register = async (name, username, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      name,
      username,
      email,
      password,
    });

    if (response.status === 201) {
      console.log('Registration successful!');
      return true;
    } else {
      console.error('Registration failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    return false;
  }
};

/**
 * Fungsi untuk logout
 */
export const logout = async () => {
  try {
    await removeToken(); // Hapus token dari AsyncStorage
    await removeUser(); // Hapus data pengguna dari AsyncStorage
    console.log('Logout successful!');
  } catch (error) {
    console.error('Logout error:', error);
  }
}

/**
 * Fungsi untuk mendapatkan profile dari /api/auth/profile
 * @returns {Promise<Object|null>} - Data profile atau null jika gagal
 */
export const getProfile = async () => {
  try {
    const token = await getToken();
    if (!token) {
      console.error('No token found.');
      return null;
    }

    const response = await axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to get profile:', error);
    return null;
  }
}
