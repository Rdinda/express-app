import React, { useState, useContext } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { AuthContext } from '../../contexts/AuthContext';
import { login as apiLogin } from '../../api/authService';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [error, setError] = useState('');

  const authContext = useContext(AuthContext);

  if (!authContext) {
    console.error("AuthContext is undefined, make sure LoginScreen is wrapped in AuthProvider.");
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          Error: AuthContext not found. LoginScreen must be wrapped in AuthProvider.
        </Text>
      </View>
    );
  }

  const { login: contextLoginAction, isLoading: authIsLoading } = authContext; // authIsLoading from context might be for token storage phase

  const handleLogin = async () => {
    setIsApiLoading(true);
    setError('');
    try {
      const { token } = await apiLogin({
        email: username,
        username: username,
        password: password,
      });
      if (token && contextLoginAction) {
        await contextLoginAction(token);
        // Navigation will be handled by the effect in AuthContext or RootLayout
      } else {
        // This case might not be reached if apiLogin throws an error for invalid credentials
        // or if contextLoginAction is somehow undefined (already checked by !authContext)
        setError('Login failed: No token received or context action unavailable.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An unexpected error occurred during login.';
      setError(errorMessage);
      console.error('Login failed:', err);
    } finally {
      setIsApiLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Login</Text>
      <TextInput
        label="Username or Email"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode="outlined"
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button
        mode="contained"
        onPress={handleLogin}
        style={styles.button}
        disabled={isApiLoading || authIsLoading} // Disable if API call is loading OR if context is processing login
        loading={isApiLoading} // Show loading indicator in button if Paper supports it, or use ActivityIndicator
      >
        {isApiLoading ? 'Logging in...' : 'Login'}
      </Button>
      {/* Fallback ActivityIndicator if button doesn't show its own */}
      {/* {isApiLoading && !authIsLoading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 10 }} />} */}
      {authIsLoading && <Text style={styles.loadingText}>Finalizing login...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20, // Increased padding
    backgroundColor: '#f5f5f5', // Light grey background
  },
  title: {
    textAlign: 'center',
    marginBottom: 30, // Increased margin
    color: '#333', // Darker title
  },
  input: {
    marginBottom: 18, // Increased margin
  },
  button: {
    marginTop: 10, // Increased margin
    paddingVertical: 8, // Added vertical padding
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12, // Increased margin
    fontSize: 14,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#555',
    fontSize: 16,
  }
});

export default LoginScreen;