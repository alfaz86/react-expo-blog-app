import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Slot } from 'expo-router';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import { AuthProvider } from '@/contexts/authContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#ffffff"
          barStyle="dark-content"
        />
        <Navbar />
        <View style={styles.content}>
          <Slot />
        </View>
        {/* <Footer /> */}
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
