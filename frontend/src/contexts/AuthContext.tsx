import React, { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import { useLoginMutation, useRegisterMutation } from '../apollo/generated/graphql';
interface User {
    id: string;
    username: string;
    email: string;
    full_name: string;
    address: string;
    phone_number: string;
    payment_method: string;
}

interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
}

interface SignupResponse {
    user: User;
    message: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    signupMessage: string | null;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: any) => Promise<SignupResponse | null>;
    logout: () => void;
    clearError: () => void;
    clearSignupMessage: () => void;
}

type AuthAction =
    | { type: 'LOGIN_START' }
    | { type: 'LOGIN_SUCCESS'; payload: AuthResponse }
    | { type: 'LOGIN_FAILURE'; payload: string }
    | { type: 'REGISTER_SUCCESS'; payload: SignupResponse }
    | { type: 'LOGOUT' }
    | { type: 'CLEAR_ERROR' }
    | { type: 'CLEAR_SIGNUP_MESSAGE' };

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    refreshToken: localStorage.getItem('refreshToken'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
    signupMessage: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                refreshToken: action.payload.refreshToken,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'LOGIN_FAILURE':
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case 'REGISTER_SUCCESS':
            return {
                ...state,
                isLoading: false,
                signupMessage: action.payload.message,
                error: null,
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                token: null,
                refreshToken: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        case 'CLEAR_SIGNUP_MESSAGE':
            return {
                ...state,
                signupMessage: null,
            };
        default:
            return state;
    }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const [registerUser] = useRegisterMutation();
    const [loginUser] = useLoginMutation();

    useEffect(() => {
        if (state.token) {
            localStorage.setItem('token', state.token);
        } else {
            localStorage.removeItem('token');
        }
    }, [state.token]);

    useEffect(() => {
        if (state.refreshToken) {
            localStorage.setItem('refreshToken', state.refreshToken);
        } else {
            localStorage.removeItem('refreshToken');
        }
    }, [state.refreshToken]);

    const login = async (email: string, password: string): Promise<boolean> => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const result = await loginUser({
                variables: {
                    email,
                    password,
                }
            })

            if (result.data?.login) {
                const authResponse: AuthResponse = {
                    user: result.data.login.user,
                    token: result.data.login.token,
                    refreshToken: result.data.login.refreshToken,
                };
                localStorage.setItem('token', authResponse.token);
                localStorage.setItem('refreshToken', authResponse.refreshToken);
                dispatch({ type: 'LOGIN_SUCCESS', payload: authResponse });
                return true;
            } else {
                dispatch({ type: 'LOGIN_FAILURE', payload: 'Invalid login response' });
                return false;
            }
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error occurred' });
            return false;
        }
    };

    const register = async (userData: any): Promise<SignupResponse | null> => {
        dispatch({ type: 'LOGIN_START' });
        try {
            const result = await registerUser({
                variables: {
                    input: userData,
                }
            });

            if (result.data?.createUser) {
                const signupResponse: SignupResponse = {
                    user: result.data.createUser.user,
                    message: result.data.createUser.message,
                };
                dispatch({ type: 'REGISTER_SUCCESS', payload: signupResponse });
                return signupResponse;
            }
            return null;
        } catch (error) {
            dispatch({ type: 'LOGIN_FAILURE', payload: 'Network error occurred' });
            return null;
        }
    };

    const logout = (): void => {
        dispatch({ type: 'LOGOUT' });
    };

    const clearError = (): void => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const clearSignupMessage = (): void => {
        dispatch({ type: 'CLEAR_SIGNUP_MESSAGE' });
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        clearSignupMessage,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};