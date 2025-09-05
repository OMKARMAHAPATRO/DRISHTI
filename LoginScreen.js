import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from './config';
import { decode } from 'base-64';
// ...existing code...
import { atob } from 'react-native-quick-base64';
// ...existing code...
// Helper function to decode base64url
function base64UrlDecode(str) {
  // Replace non-url compatible chars with base64 standard chars
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with trailing '='
  while (str.length % 4) {
    str += '=';
  }
  return decode(str);
}

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    let hasError = false;

    if (email.trim() === '') {
      setEmailError('Email is required');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email format is invalid');
      hasError = true;
    }
    if (password.trim() === '') {
      setPasswordError('Password is required');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        try {
          await AsyncStorage.setItem('token', data.token);
        } catch (storageError) {
          console.error('AsyncStorage error:', storageError);
        }
        // Decode token to get user info (handle base64url)
        const payload = JSON.parse(base64UrlDecode(data.token.split('.')[1]));
        login(payload.user);
        navigation.replace('Dashboard');
      } else {
        setPasswordError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setPasswordError('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.showPasswordText}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />
      ) : (
        <Button title="Login" onPress={handleLogin} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  showPasswordButton: {
    marginLeft: 10,
    padding: 10,
  },
  showPasswordText: {
    color: '#007bff',
    fontSize: 16,
  },
  linkText: {
    color: '#007bff',
    fontSize: 16,
    marginTop: 20,
  },
});
