// Mock API service for authentication

interface LoginCredentials {
  // Define expected credentials structure, e.g., email, password
  // For a mock, 'any' is fine, but specific types are better for real apps
  [key: string]: any; 
}

interface UserData {
  // Define expected user data structure for registration
  [key: string]: any;
}

export const login = (credentials: LoginCredentials): Promise<{ token: string }> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate successful login
      // In a real app, you would validate credentials against a backend
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        resolve({ token: 'mock-jwt-token-12345' });
      } else if (credentials.username === 'testuser' && credentials.password === 'password') { // Example for LoginScreen
        resolve({ token: 'mock-jwt-token-for-testuser-67890' });
      }
      else {
        // Simulate failed login for other credentials
        reject(new Error('Invalid credentials'));
      }
    }, 1000); // Simulate 1-second delay
  });
};

export const register = (userData: UserData): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful registration
      console.log('Mock API: Registering user with data:', userData);
      resolve({ success: true });
    }, 1000); // Simulate 1-second delay
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful logout
      console.log('Mock API: User logged out');
      resolve();
    }, 500); // Simulate 0.5-second delay
  });
};
