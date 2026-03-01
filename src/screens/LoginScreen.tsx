import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import TibiaText from '@/components/base/TibiaText';
import TibiaPanel from '@/components/base/TibiaPanel';
import TibiaInput from '@/components/base/TibiaInput';
import TibiaButton from '@/components/base/TibiaButton';
import TibiaDivider from '@/components/base/TibiaDivider';
import SocialLoginButtons from '@/components/composed/SocialLoginButtons';
import { useAuthStore } from '@/stores/useAuthStore';
import { validateLoginForm } from '@/rules/authRules';
import { theme } from '@/theme';
import type { RootStackParamList } from '@/navigation/AppNavigator';

WebBrowser.maybeCompleteAuthSession();

type LoginNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

function LoginScreen() {
    const navigation = useNavigation<LoginNavigationProp>();
    const login = useAuthStore((s) => s.login);
    const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
    const loginWithApple = useAuthStore((s) => s.loginWithApple);
    const resetPassword = useAuthStore((s) => s.resetPassword);
    const isLoading = useAuthStore((s) => s.isLoading);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState('');

    const [, googleResponse, googlePromptAsync] = Google.useAuthRequest({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    });

    React.useEffect(() => {
        if (googleResponse?.type === 'success') {
            const { id_token } = googleResponse.params;
            if (id_token) {
                handleGoogleLogin(id_token);
            }
        }
    }, [googleResponse]);

    const handleLogin = useCallback(async () => {
        setErrors({});
        setSuccessMessage('');

        const validationErrors = validateLoginForm(email, password);
        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }

        try {
            await login(email.trim(), password);
            setSuccessMessage('✅ Login realizado com sucesso! Entrando em mainland...');
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } catch (err: any) {
            setErrors({ general: err.message });
        }
    }, [email, password, login, navigation]);

    const handleGoogleLogin = useCallback(async (idToken: string) => {
        try {
            await loginWithGoogle(idToken);
            setSuccessMessage('✅ Login realizado com sucesso! Entrando em mainland...');
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } catch (err: any) {
            setErrors({ general: err.message });
        }
    }, [loginWithGoogle, navigation]);

    const handleAppleLogin = useCallback(async () => {
        try {
            await loginWithApple();
            setSuccessMessage('✅ Login realizado com sucesso! Entrando em mainland...');
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } catch (err: any) {
            setErrors({ general: err.message });
        }
    }, [loginWithApple, navigation]);

    const handleForgotPassword = useCallback(async () => {
        const trimmed = email.trim();
        if (!trimmed) {
            Alert.alert('Recuperar Senha', 'Digite seu e-mail no campo acima primeiro.');
            return;
        }
        try {
            await resetPassword(trimmed);
            Alert.alert('E-mail enviado', 'Um e-mail de recuperação foi enviado para ' + trimmed);
        } catch (err: any) {
            Alert.alert('Erro', err.message);
        }
    }, [email, resetPassword]);

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <TibiaText style={styles.icon}>📜</TibiaText>
                <TibiaText style={styles.title}>Tibia Stories</TibiaText>
                <TibiaText variant="muted">Entre para gerenciar seus chars e histórias</TibiaText>
            </View>

            <TibiaPanel>
                <View style={styles.panelHeader}>
                    <TibiaText style={styles.panelEmoji}>🔑</TibiaText>
                    <TibiaText style={styles.panelTitle}>Entrar</TibiaText>
                </View>
                <View style={styles.panelBody}>
                    <TibiaInput
                        label="E-mail"
                        placeholder="seu@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        error={errors.email}
                    />
                    <TibiaInput
                        label="Senha"
                        placeholder="Sua senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={errors.password}
                    />
                    <TibiaButton
                        label="Entrar"
                        onPress={handleLogin}
                        disabled={isLoading}
                    />
                    <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
                        <TibiaText style={styles.forgotPasswordText}>Esqueceu a senha?</TibiaText>
                    </TouchableOpacity>
                </View>
            </TibiaPanel>

            {errors.general ? (
                <View style={styles.errorContainer}>
                    <TibiaText style={styles.errorText}>{errors.general}</TibiaText>
                </View>
            ) : null}

            {successMessage ? (
                <View style={styles.successContainer}>
                    <TibiaText style={styles.successText}>{successMessage}</TibiaText>
                </View>
            ) : null}

            <TibiaDivider ornament="— ou —" />

            <SocialLoginButtons
                mode="login"
                onGooglePress={() => googlePromptAsync()}
                onApplePress={handleAppleLogin}
                disabled={isLoading}
            />

            <View style={styles.footer}>
                <TibiaText variant="muted">Não tem conta? </TibiaText>
                <TouchableOpacity onPress={() => navigation.replace('Register')}>
                    <TibiaText style={styles.link}>Criar Conta</TibiaText>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: theme.colors.panel,
    },
    container: {
        padding: theme.spacing.xl,
        paddingBottom: theme.spacing.xxxl,
    },
    header: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
    icon: {
        fontSize: theme.fontSizes.emoji,
        marginBottom: theme.spacing.sm,
    },
    title: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.xxl,
        fontWeight: 'bold',
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    panelHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.panelAlt,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    panelEmoji: {
        fontSize: theme.fontSizes.lg,
    },
    panelTitle: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textPrimary,
    },
    panelBody: {
        padding: theme.spacing.md,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: theme.spacing.sm,
    },
    forgotPasswordText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        textDecorationLine: 'underline',
    },
    errorContainer: {
        backgroundColor: theme.colors.feedbackErrorBg,
        ...theme.borders.panelInner,
        borderColor: theme.colors.accentRed,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    errorText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.accentRed,
    },
    successContainer: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        ...theme.borders.panelInner,
        borderColor: theme.colors.accentGreen,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    successText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.accentGreen,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.xl,
    },
    link: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textPrimary,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
