import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Adjust path as necessary
// Re-define or import AuthContextState if it's not exported from AuthContext.tsx or if circular dependencies are an issue.
// For simplicity, assuming AuthContext already provides the correct type for its value.

// If AuthContextState is exported from AuthContext.tsx, you can import it:
// import { AuthContext, AuthContextState } from '../contexts/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  // The type of context will be inferred from AuthContext.Provider value.
  // If you imported AuthContextState, you could type context:
  // const context = useContext<AuthContextState | undefined>(AuthContext);
  return context;
};

export default useAuth;
