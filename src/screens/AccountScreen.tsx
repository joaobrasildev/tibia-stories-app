import React, { useCallback, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TibiaText from '@/components/base/TibiaText';
import TibiaButton from '@/components/base/TibiaButton';
import TibiaPanel from '@/components/base/TibiaPanel';
import TibiaHeader from '@/components/base/TibiaHeader';
import TibiaDivider from '@/components/base/TibiaDivider';
import TibiaEmpty from '@/components/base/TibiaEmpty';
import TibiaLoading from '@/components/base/TibiaLoading';
import TokenDisplay from '@/components/composed/TokenDisplay';
import MyCharItem from '@/components/composed/MyCharItem';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMyCharsStore } from '@/stores/useMyCharsStore';
import { APP_TEXTS } from '@/constants/app';
import { theme } from '@/theme';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type AccountNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

function AccountScreen() {
    const navigation = useNavigation<AccountNavigationProp>();
    const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
    const userToken = useAuthStore((s) => s.userToken);
    const logout = useAuthStore((s) => s.logout);

    const myChars = useMyCharsStore((s) => s.myChars);
    const isLoadingChars = useMyCharsStore((s) => s.isLoading);
    const loadMyChars = useMyCharsStore((s) => s.loadMyChars);

    useEffect(() => {
        if (isLoggedIn && userToken) {
            loadMyChars(userToken);
        }
    }, [isLoggedIn, userToken, loadMyChars]);

    const handleLogin = useCallback(() => {
        navigation.navigate('Login');
    }, [navigation]);

    const handleLogout = useCallback(async () => {
        await logout();
    }, [logout]);

    const handleAddChar = useCallback(() => {
        navigation.navigate('AddChar');
    }, [navigation]);

    const handleVerify = useCallback((charId: string, charName: string) => {
        navigation.navigate('VerifyChar', { charId, charName });
    }, [navigation]);

    const handleWrite = useCallback((_charId: string) => {
        // Fase 10: navigation.navigate('EditStory', { charId });
    }, []);

    const handleEdit = useCallback((_charId: string) => {
        // Fase 10: navigation.navigate('EditStory', { charId });
    }, []);

    const handleHighlight = useCallback((_charId: string) => {
        // Fase 12: navigation.navigate('Highlight', { charId });
    }, []);

    // ── Não logado ──────────────────────────────────────
    if (!isLoggedIn) {
        return (
            <View style={styles.notLoggedContainer}>
                <TibiaText style={styles.notLoggedIcon}>📜</TibiaText>
                <TibiaText variant="title" style={styles.notLoggedTitle}>
                    Tibia Stories
                </TibiaText>
                <TibiaText variant="muted" style={styles.notLoggedText}>
                    Entre para gerenciar seus chars e histórias
                </TibiaText>
                <View style={styles.fullWidth}>
                    <TibiaButton label="Entrar / Criar Conta" onPress={handleLogin} />
                </View>
            </View>
        );
    }

    // ── Logado ──────────────────────────────────────────
    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            {/* Seção 1: Token de Verificação */}
            <TibiaPanel>
                <TibiaHeader title="Meu Token de Verificação" icon="🔑" />
                <View style={styles.panelBody}>
                    {userToken ? (
                        <TokenDisplay token={userToken} />
                    ) : null}
                    <View style={styles.notice}>
                        <TibiaText style={styles.noticeText}>
                            ℹ️ Use este token para verificar que um personagem é seu. Cole-o no comment do seu char no site oficial do Tibia (tibia.com → My Account → Edit Comment).
                        </TibiaText>
                    </View>
                </View>
            </TibiaPanel>

            {/* Seção 2: Meus Chars */}
            <TibiaPanel>
                <TibiaHeader title="Meus Chars" icon="⚔️" />
                <View style={styles.panelBody}>
                    {isLoadingChars ? (
                        <TibiaLoading message="Carregando chars..." />
                    ) : myChars.length === 0 ? (
                        <TibiaEmpty message={APP_TEXTS.account.noChars} icon="🛡️" />
                    ) : (
                        myChars.map((char, index) => (
                            <MyCharItem
                                key={char.id}
                                name={char.name}
                                vocation={char.vocation}
                                level={char.level}
                                world={char.world}
                                avatarUrl={char.avatar_url}
                                isVerified={char.is_verified}
                                hasStory={!!char.story_content}
                                isAlternate={index % 2 === 1}
                                onVerifyPress={() => handleVerify(char.id, char.name)}
                                onWritePress={() => handleWrite(char.id)}
                                onEditPress={() => handleEdit(char.id)}
                                onHighlightPress={() => handleHighlight(char.id)}
                            />
                        ))
                    )}
                </View>
            </TibiaPanel>

            {/* Botão Adicionar Char */}
            <View style={styles.fullWidth}>
                <TibiaButton label={APP_TEXTS.account.addCharBtn} onPress={handleAddChar} />
            </View>

            {/* Divisor */}
            <TibiaDivider />

            {/* Seção 3: Sobre o App */}
            <TibiaPanel>
                <TibiaHeader title="Sobre o App" icon="ℹ️" />
                <View style={styles.panelBody}>
                    <TibiaText style={styles.aboutText}>
                        <TibiaText style={styles.aboutBold}>Tibia Stories</TibiaText> v1.0.0
                    </TibiaText>
                    <TibiaText style={styles.aboutDescription}>
                        Um app para a comunidade de Tibia compartilhar histórias, mitos e lendas.
                    </TibiaText>
                    <TibiaText style={styles.aboutWarning}>
                        ⚠️ Se reinstalar o app, seu token será perdido e você precisará verificar seus personagens novamente.
                    </TibiaText>
                </View>
            </TibiaPanel>

            {/* Botão Sair */}
            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
                    <TibiaText style={styles.logoutBtnText}>{APP_TEXTS.account.logoutBtn}</TibiaText>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    // ── Not logged in ──
    notLoggedContainer: {
        flex: 1,
        backgroundColor: theme.colors.panel,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
    },
    notLoggedIcon: {
        fontSize: theme.fontSizes.emoji,
        marginBottom: theme.spacing.md,
    },
    notLoggedTitle: {
        marginBottom: theme.spacing.xs,
    },
    notLoggedText: {
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    fullWidth: {
        width: '100%',
    },

    // ── Logged in ──
    scrollView: {
        flex: 1,
        backgroundColor: theme.colors.panel,
    },
    content: {
        padding: theme.spacing.md,
        paddingBottom: theme.spacing.xxxl,
    },
    panelBody: {
        padding: theme.spacing.md,
    },

    // ── Notice ──
    notice: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderWidth: 1,
        borderColor: theme.colors.badgeStatusBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
    },
    noticeText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
    },

    // ── About ──
    aboutText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textMuted,
        marginBottom: theme.spacing.gap,
    },
    aboutBold: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textMuted,
    },
    aboutDescription: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.gap,
        lineHeight: theme.lineHeights.body,
    },
    aboutWarning: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textMuted,
        marginTop: theme.spacing.gap,
        lineHeight: theme.lineHeights.body,
    },

    // ── Logout ──
    logoutContainer: {
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.cardGap,
    },
    logoutBtn: {
        paddingVertical: theme.spacing.cardGap,
        paddingHorizontal: theme.spacing.xxxl,
        backgroundColor: theme.colors.logoutBg,
        borderWidth: 2,
        borderColor: theme.colors.logoutBorder,
        borderRadius: theme.radius.sm,
    },
    logoutBtnText: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.textOnHeader,
    },
});

export default AccountScreen;
