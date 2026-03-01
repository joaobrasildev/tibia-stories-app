import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TibiaText from '@/components/base/TibiaText';
import TibiaButton from '@/components/base/TibiaButton';
import { useAuthStore } from '@/stores/useAuthStore';
import { theme } from '@/theme';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type AccountNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

function AccountScreen() {
    const navigation = useNavigation<AccountNavigationProp>();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const user = useAuthStore((s) => s.user);
    const userToken = useAuthStore((s) => s.userToken);
    const logout = useAuthStore((s) => s.logout);

    const handleLogin = useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    const handleLogout = useCallback(async () => {
        await logout();
    }, [logout]);

    if (!isLoggedIn) {
        return (
            <View style={styles.container}>
                <TibiaText style={styles.icon}>📜</TibiaText>
                <TibiaText variant="title" style={styles.welcomeTitle}>Tibia Stories</TibiaText>
                <TibiaText variant="muted" style={styles.welcomeText}>
                    Entre para gerenciar seus chars e histórias
                </TibiaText>
                <View style={styles.loginButton}>
                    <TibiaButton label="Entrar / Criar Conta" onPress={handleLogin} />
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.loggedInContainer}>
            <TibiaText variant="title">Conta</TibiaText>
            <TibiaText variant="caption" style={styles.userInfo}>
                {user?.displayName ?? user?.email ?? 'Aventureiro'}
            </TibiaText>
            {userToken ? (
                <TibiaText variant="muted" style={styles.tokenText}>
                    Token: {userToken}
                </TibiaText>
            ) : null}
            <View style={styles.logoutButton}>
                <TibiaButton label="Sair" variant="outline" onPress={handleLogout} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.panel,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    scrollView: {
        flex: 1,
        backgroundColor: theme.colors.panel,
    },
    loggedInContainer: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    icon: {
        fontSize: theme.fontSizes.emoji,
        marginBottom: theme.spacing.md,
    },
    welcomeTitle: {
        marginBottom: theme.spacing.xs,
    },
    welcomeText: {
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    loginButton: {
        width: '100%',
    },
    userInfo: {
        marginTop: theme.spacing.sm,
    },
    tokenText: {
        marginTop: theme.spacing.sm,
    },
    logoutButton: {
        marginTop: theme.spacing.xl,
        width: '100%',
    },
});

export default AccountScreen;
