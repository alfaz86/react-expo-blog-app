import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { login } from '@/utils/auth';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/authContext';

const Login = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState(''); // email atau username
  const [password, setPassword] = useState(''); // password
  const { handleAuth } = useAuth();

  const handleLogin = async () => {
    const success = await login(identifier, password);
    console.log('Login status:', success);

    if (success) {
      Alert.alert('Login successful!');
      handleAuth();
      router.push('/'); // redirect to home
    } else {
      Alert.alert('Login failed', 'Invalid email/username or password');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email or Username"
        value={identifier}
        onChangeText={(text) => setIdentifier(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <Button title="Login" onPress={handleLogin} />

      <Text style={styles.registerLink} onPress={() => router.push('/register')}>
        Don't have an account? Register here.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 5,
  },
  registerLink: {
    textAlign: 'center',
    marginTop: 20,
    color: '#007BFF',
  },
});

export default Login;
