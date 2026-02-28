import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
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
import { validateRegisterForm } from '@/rules/authRules';
import { theme } from '@/theme';
import type { RootStackParamList } from '@/navigation/AppNavigator';

WebBrowser.maybeCompleteAuthSession();

type RegisterNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

function RegisterScreen() {
    const navigation = useNavigation<RegisterNavigationProp>();
    const register = useAuthStore((s) => s.register);
    const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
    const loginWithApple = useAuthStore((s) => s.loginWithApple);
    const isLoading = useAuthStore((s) => s.isLoading);

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
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
                handleGoogleRegister(id_token);
            }
        }
    }, [googleResponse]);

    const handleRegister = useCallback(async () => {
        setErrors({});
        setSuccessMessage('');

        const validationErrors = validateRegisterForm({
            displayName: displayName.trim() || undefined,
            email,
            password,
            confirmPassword,
        });

        if (validationErrors) {
            setErrors(validationErrors);
            return;
        }

        try {
            await register(email.trim(), password, displayName.trim() || undefined);
            setSuccessMessage('✅ Conta criada com sucesso!');
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } catch (err: any) {
            setErrors({ general: err.message });
        }
    }, [displayName, email, password, confirmPassword, register, navigation]);

    const handleGoogleRegister = useCallback(async (idToken: string) => {
        try {
            await loginWithGoogle(idToken);
            setSuccessMessage('✅ Conta criada com sucesso!');
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } catch (err: any) {
            setErrors({ general: err.message });
        }
    }, [loginWithGoogle, navigation]);

    const handleAppleRegister = useCallback(async () => {
        try {
            await loginWithApple();
            setSuccessMessage('✅ Conta criada com sucesso!');
            setTimeout(() => {
                navigation.goBack();
            }, 1500);
        } catch (err: any) {
            setErrors({ general: err.message });
        }
    }, [loginWithApple, navigation]);

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <TibiaText style={styles.icon}>🛡️</TibiaText>
                <TibiaText style={styles.title}>Criar Conta</TibiaText>
                <TibiaText variant="muted">Atravesse o TP e junte-se à comunidade de Tibia Stories</TibiaText>
            </View>

            <TibiaPanel>
                <View style={styles.panelHeader}>
                    <TibiaText style={styles.panelEmoji}>✏️</TibiaText>
                    <TibiaText style={styles.panelTitle}>Dados da Conta</TibiaText>
                </View>
                <View style={styles.panelBody}>
                    <TibiaInput
                        label="Nome (opcional)"
                        placeholder="Como quer ser chamado?"
                        value={displayName}
                        onChangeText={setDisplayName}
                        autoCapitalize="words"
                    />
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
                        label="Senha (mín. 6 caracteres)"
                        placeholder="Crie uma senha"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={errors.password}
                    />
                    <TibiaInput
                        label="Confirmar Senha"
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        error={errors.confirmPassword}
                    />
                    <TibiaButton
                        label="Criar Conta"
                        onPress={handleRegister}
                        disabled={isLoading}
                    />
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
                mode="register"
                onGooglePress={() => googlePromptAsync()}
                onApplePress={handleAppleRegister}
                disabled={isLoading}
            />

            <View style={styles.footer}>
                <TibiaText variant="muted">Já tem conta? </TibiaText>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                    <TibiaText style={styles.link}>Entrar</TibiaText>
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
        fontSize: 48,
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
    errorContainer: {
        backgroundColor: '#FDECEC',
        borderWidth: 1,
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
        backgroundColor: '#ECF9EC',
        borderWidth: 1,
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

export default RegisterScreen;
