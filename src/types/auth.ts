export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    provider: 'email' | 'google' | 'apple';
}

export interface AuthState {
    user: User | null;
    userToken: string | null; // TS-xxxxxxxx
    isLoggedIn: boolean;
    isLoading: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterFormData {
    displayName?: string;
    email: string;
    password: string;
    confirmPassword: string;
}
