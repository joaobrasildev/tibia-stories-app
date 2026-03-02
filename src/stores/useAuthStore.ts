import { create } from 'zustand';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import type { User } from '@/types/auth';
import {
    loginWithEmail,
    registerWithEmail,
    loginWithGoogleCredential,
    loginWithAppleCredential,
    logout as authLogout,
    resetPassword as authResetPassword,
    ensureUserToken,
    subscribeToAuthState,
} from '@/services/authService';
import { getFirebaseAuthErrorMessage } from '@/rules/authRules';
import { requireOnline } from '@/services/syncService';
import { getUserToken, setUserToken as saveUserTokenLocally } from '@/repositories/userConfigRepository';

interface AuthState {
    user: User | null;
    userToken: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    error: string | null;
    // actions
    setUser: (user: User | null) => void;
    setUserToken: (token: string | null) => void;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, displayName?: string) => Promise<void>;
    loginWithGoogle: (idToken: string) => Promise<void>;
    loginWithApple: () => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    clearError: () => void;
    initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    userToken: null,
    isLoggedIn: false,
    isLoading: false,
    error: null,

    setUser: (user) => set({ user, isLoggedIn: !!user }),

    setUserToken: (token) => set({ userToken: token }),

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            requireOnline();
            const user = await loginWithEmail(email, password);
            const token = await ensureUserToken(user.uid);
            saveUserTokenLocally(token);
            set({ user, userToken: token, isLoggedIn: true, isLoading: false });
        } catch (err: any) {
            const message = getFirebaseAuthErrorMessage(err?.code ?? '');
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    register: async (email, password, displayName?) => {
        set({ isLoading: true, error: null });
        try {
            requireOnline();
            const user = await registerWithEmail(email, password, displayName);
            const token = await ensureUserToken(user.uid);
            saveUserTokenLocally(token);
            set({ user, userToken: token, isLoggedIn: true, isLoading: false });
        } catch (err: any) {
            const message = getFirebaseAuthErrorMessage(err?.code ?? '');
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    loginWithGoogle: async (idToken: string) => {
        set({ isLoading: true, error: null });
        try {
            requireOnline();
            const user = await loginWithGoogleCredential(idToken);
            const token = await ensureUserToken(user.uid);
            saveUserTokenLocally(token);
            set({ user, userToken: token, isLoggedIn: true, isLoading: false });
        } catch (err: any) {
            const message = getFirebaseAuthErrorMessage(err?.code ?? '');
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    loginWithApple: async () => {
        set({ isLoading: true, error: null });
        try {
            requireOnline();
            const nonce = Math.random().toString(36).substring(2, 10);
            const hashedNonce = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                nonce,
            );

            const appleCredential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: hashedNonce,
            });

            if (!appleCredential.identityToken) {
                throw new Error('Apple Sign-In falhou: token não recebido.');
            }

            const user = await loginWithAppleCredential(appleCredential.identityToken, nonce);
            const token = await ensureUserToken(user.uid);
            saveUserTokenLocally(token);
            set({ user, userToken: token, isLoggedIn: true, isLoading: false });
        } catch (err: any) {
            if (err?.code === 'ERR_REQUEST_CANCELED') {
                set({ isLoading: false });
                return;
            }
            const message = getFirebaseAuthErrorMessage(err?.code ?? '');
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await authLogout();
            saveUserTokenLocally('');
            set({ user: null, userToken: null, isLoggedIn: false, isLoading: false });
        } catch (err: any) {
            set({ isLoading: false, error: 'Erro ao sair. Tente novamente.' });
        }
    },

    resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
            requireOnline();
            await authResetPassword(email);
            set({ isLoading: false });
        } catch (err: any) {
            const message = getFirebaseAuthErrorMessage(err?.code ?? '');
            set({ isLoading: false, error: message });
            throw new Error(message);
        }
    },

    clearError: () => set({ error: null }),

    initAuthListener: () => {
        const unsubscribe = subscribeToAuthState(async (user) => {
            if (user) {
                try {
                    const token = await ensureUserToken(user.uid);
                    saveUserTokenLocally(token);
                    set({ user, userToken: token, isLoggedIn: true });
                } catch {
                    const localToken = getUserToken();
                    set({ user, userToken: localToken, isLoggedIn: true });
                }
            } else {
                set({ user: null, userToken: null, isLoggedIn: false });
            }
        });
        return unsubscribe;
    },
}));
