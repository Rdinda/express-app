import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthData, LoginCredentials, RegisterData, Usuario } from '../models/types';

// Definição das ações do reducer
type AuthAction =
    | { type: 'RESTORE_TOKEN'; token: string; usuario: Usuario }
    | { type: 'SIGN_IN'; token: string; usuario: Usuario }
    | { type: 'SIGN_OUT' }
    | { type: 'AUTH_ERROR'; error: string }
    | { type: 'CLEAR_ERROR' }
    | { type: 'LOADING'; isLoading: boolean };

// Estado inicial de autenticação
const initialState: AuthData = {
    usuario: null,
    isLoading: true,
    isSignout: false,
    error: null,
};

// Reducer para gerenciar o estado de autenticação
const authReducer = (state: AuthData, action: AuthAction): AuthData => {
    switch (action.type) {
        case 'RESTORE_TOKEN':
            return {
                ...state,
                usuario: action.usuario,
                isLoading: false,
                isSignout: false,
            };
        case 'SIGN_IN':
            return {
                ...state,
                usuario: action.usuario,
                isLoading: false,
                isSignout: false,
                error: null,
            };
        case 'SIGN_OUT':
            return {
                ...state,
                usuario: null,
                isLoading: false,
                isSignout: true,
                error: null,
            };
        case 'AUTH_ERROR':
            return {
                ...state,
                error: action.error,
                isLoading: false,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'LOADING':
            return {
                ...state,
                isLoading: action.isLoading,
            };
        default:
            return state;
    }
};

// Definição do contexto de autenticação
type AuthContextType = {
    state: AuthData;
    signIn: (credentials: LoginCredentials) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (data: RegisterData) => Promise<void>;
    clearError: () => void;
};

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Efeito para verificar se há um token salvo
    useEffect(() => {
        const bootstrapAsync = async () => {
            try {
                // Recuperar token e dados do usuário do AsyncStorage
                const userToken = await AsyncStorage.getItem('@auth_token');
                const userData = await AsyncStorage.getItem('@user_data');

                if (userToken && userData) {
                    const usuario = JSON.parse(userData) as Usuario;
                    dispatch({ type: 'RESTORE_TOKEN', token: userToken, usuario });
                } else {
                    dispatch({ type: 'SIGN_OUT' });
                }
            } catch (e) {
                // Erro ao recuperar token
                dispatch({ type: 'SIGN_OUT' });
            }
        };

        bootstrapAsync();
    }, []);

    // Funções de autenticação
    const authContext: AuthContextType = {
        state,
        signIn: async (credentials) => {
            try {
                dispatch({ type: 'LOADING', isLoading: true });

                // Simulação de chamada à API (será substituída pela integração real)
                // Em produção, isso seria uma chamada real à API
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (credentials.email === 'teste@exemplo.com' && credentials.senha === '123456') {
                    const usuario: Usuario = {
                        id: '1',
                        nome: 'Usuário Teste',
                        email: credentials.email,
                        token: 'token-fake-123',
                    };

                    // Salvar token e dados do usuário no AsyncStorage
                    await AsyncStorage.setItem('@auth_token', 'token-fake-123');
                    await AsyncStorage.setItem('@user_data', JSON.stringify(usuario));

                    dispatch({ type: 'SIGN_IN', token: 'token-fake-123', usuario });
                } else {
                    dispatch({ type: 'AUTH_ERROR', error: 'Credenciais inválidas' });
                }
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', error: 'Erro ao fazer login. Tente novamente.' });
            }
        },
        signOut: async () => {
            try {
                // Remover token e dados do usuário do AsyncStorage
                await AsyncStorage.removeItem('@auth_token');
                await AsyncStorage.removeItem('@user_data');
                dispatch({ type: 'SIGN_OUT' });
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
            }
        },
        signUp: async (data) => {
            try {
                dispatch({ type: 'LOADING', isLoading: true });

                // Validar dados de registro
                if (data.senha !== data.confirmarSenha) {
                    dispatch({ type: 'AUTH_ERROR', error: 'As senhas não coincidem' });
                    return;
                }

                // Simulação de chamada à API (será substituída pela integração real)
                await new Promise(resolve => setTimeout(resolve, 1000));

                const usuario: Usuario = {
                    id: '2', // Em produção, seria gerado pelo backend
                    nome: data.nome,
                    email: data.email,
                    token: 'token-fake-456',
                };

                // Salvar token e dados do usuário no AsyncStorage
                await AsyncStorage.setItem('@auth_token', 'token-fake-456');
                await AsyncStorage.setItem('@user_data', JSON.stringify(usuario));

                dispatch({ type: 'SIGN_IN', token: 'token-fake-456', usuario });
            } catch (error) {
                dispatch({ type: 'AUTH_ERROR', error: 'Erro ao criar conta. Tente novamente.' });
            }
        },
        clearError: () => {
            dispatch({ type: 'CLEAR_ERROR' });
        },
    };

    return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
};

// Hook para usar o contexto de autenticação
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};