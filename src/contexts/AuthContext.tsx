import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextState {
  isLoading: boolean;
  isAuthenticated: boolean;
  userToken: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<void>; // Can be any for mock
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Check for a token in AsyncStorage on app start
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
        console.error('Failed to load token from storage', e);
      }

      if (token) {
        setUserToken(token);
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const login = async (token: string) => {
    setIsLoading(true);
    try {
      await AsyncStorage.setItem('userToken', token);
      setUserToken(token);
      setIsAuthenticated(true);
    } catch (e) {
      console.error('Failed to save token to storage', e);
      // Handle error, maybe show a message to the user
    }
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('userToken');
      setUserToken(null);
      setIsAuthenticated(false);
    } catch (e) {
      console.error('Failed to remove token from storage', e);
      // Handle error
    }
    setIsLoading(false);
  };

  const register = async (data: any) => {
    setIsLoading(true);
    console.log('Registering user with data:', data);
    // Mock registration: In a real app, this would involve an API call.
    // For this mock, let's simulate a successful registration by logging in the user.
    // This is a simplified mock; a real scenario would be more complex.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network request
    // Assuming registration is successful, we might automatically log the user in
    // or require them to log in manually. For this mock, let's set a dummy token.
    const mockToken = 'mock-registered-user-token';
    await login(mockToken); 
    // Or, if registration doesn't auto-login:
    // setIsAuthenticated(false); 
    // setUserToken(null);
    setIsLoading(false);
    // Potentially navigate to login screen or dashboard after registration
  };

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated, userToken, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };