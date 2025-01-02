import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/authContext';

const screenWidth = Dimensions.get('window').width;
const margin = 10;
const popupWidth = screenWidth - margin * 2;

const Navbar = () => {
  const router = useRouter();
  const { userData, handleLogout } = useAuth();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  return (
    <>
      <View style={styles.navbar}>
        <Text style={styles.logo} onPress={() => router.push('/')}>
          Blog App
        </Text>
        <View style={styles.navItems}>
          {userData ? (
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={togglePopup}>
                <Image source={{ uri: userData.profile_image }} style={styles.userImage} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.button} onPress={() => router.push('/login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {(userData && isPopupVisible) && (
        <View style={styles.popupContainer}>
          <TouchableOpacity onPress={() => router.push('/profile')} style={styles.popupItem}>
            <Text style={styles.popupText}>{userData.name}</Text>
            <Text style={styles.popupText}>@{userData.username}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/article/create')} style={styles.popupItem}>
            <Text style={styles.popupText}>Buat Article</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
            togglePopup();
            handleLogout();
          }} style={styles.popupItem}>
            <Text style={styles.popupText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff', // Light theme
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
  },
  navItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    position: 'relative',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  popupContainer: {
    position: 'absolute',
    top: 70,
    right: 10,
    width: popupWidth,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    boxShadowColor: '#000',
    boxShadowOpacity: 0.1,
    boxShadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  popupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  popupText: {
    color: '#333',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
});

export default Navbar;
