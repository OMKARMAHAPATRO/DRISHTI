import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './AuthContext';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen';
import SignupScreen from './SignupScreen';

const Stack = createStackNavigator();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? "Dashboard" : "Login"}>
      {!isAuthenticated && (
        <>
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
      {isAuthenticated && (
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
