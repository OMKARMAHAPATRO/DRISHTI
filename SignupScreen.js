import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './config';

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateMobile = (mobile) => {
    const re = /^[0-9]{10}$/;
    return re.test(mobile);
  };



  const handleSignup = async () => {
    setNameError('');
    setEmailError('');
    setMobileError('');
    setPasswordError('');
    setConfirmPasswordError('');
    let hasError = false;

    if (name.trim() === '') {
      setNameError('Name is required');
      hasError = true;
    }
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      hasError = true;
    }
    if (!validateMobile(mobile)) {
      setMobileError('Mobile number must be 10 digits');
      hasError = true;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      hasError = true;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.error || 'Failed to create account');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process signup. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
      {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
        maxLength={10}
      />
      {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password (8 characters)"
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
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.showPasswordButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Text style={styles.showPasswordText}>
            {showConfirmPassword ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />
      ) : (
        <Button title="Signup" onPress={handleSignup} />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
