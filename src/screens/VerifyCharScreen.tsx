/**
 * VerifyCharScreen — "Quest de Vínculo"
 * Exibe token + instruções da quest e permite verificar o char via API.
 * Referência: general-plan.md seção 8.2 (Tela 4.2), prototype/app.js renderVerifyCharacter
 */

import React, { useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TibiaText from '@/components/base/TibiaText';
import TibiaButton from '@/components/base/TibiaButton';
import TibiaPanel from '@/components/base/TibiaPanel';
import TibiaHeader from '@/components/base/TibiaHeader';
import TibiaLoading from '@/components/base/TibiaLoading';
import TokenDisplay from '@/components/composed/TokenDisplay';
import QuestSteps from '@/components/composed/QuestSteps';
import { useCharVerify } from '@/hooks/useCharVerify';
import { useAuthStore } from '@/stores/useAuthStore';
import { APP_TEXTS } from '@/constants/app';
import { theme } from '@/theme';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type VerifyCharRouteProp = RouteProp<RootStackParamList, 'VerifyChar'>;
type VerifyCharNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyChar'>;

function VerifyCharScreen() {
    const route = useRoute<VerifyCharRouteProp>();
    const navigation = useNavigation<VerifyCharNavigationProp>();
    const { charId, charName } = route.params;
    const userToken = useAuthStore((s) => s.userToken);
    const { verify, isVerifying, isSuccess, error } = useCharVerify();

    const handleVerify = useCallback(async () => {
        const success = await verify(charId, charName);
        if (success) {
            // Fica na tela mostrando o feedback de sucesso
        }
    }, [verify, charId, charName]);

    const handleBackToAccount = useCallback(() => {
        navigation.popToTop();
    }, [navigation]);

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            {/* Painel principal — Quest info + token */}
            <TibiaPanel>
                <TibiaHeader title={`Quest de Vínculo: ${charName}`} icon="🔐" />
                <View style={styles.panelBody}>
                    <TibiaText style={styles.description}>
                        {APP_TEXTS.questVinculo.description(charName)}
                    </TibiaText>

                    {userToken ? (
                        <TokenDisplay token={userToken} />
                    ) : null}
                </View>
            </TibiaPanel>

            {/* Instruções da quest */}
            <QuestSteps charName={charName} />

            {/* Botão de verificação */}
            {!isSuccess ? (
                <TibiaButton
                    label={APP_TEXTS.questVinculo.verifyBtn}
                    variant="primary"
                    onPress={handleVerify}
                    disabled={isVerifying}
                />
            ) : null}

            {/* Loading */}
            {isVerifying ? (
                <View style={styles.loadingContainer}>
                    <TibiaLoading message="Verificando token no comment..." />
                </View>
            ) : null}

            {/* Feedback de sucesso */}
            {isSuccess ? (
                <View style={styles.successNotice}>
                    <TibiaText style={styles.successText}>
                        {APP_TEXTS.questVinculo.success}
                    </TibiaText>
                </View>
            ) : null}

            {/* Feedback de erro */}
            {error && !isVerifying ? (
                <View style={styles.errorNotice}>
                    <TibiaText style={styles.errorText}>{error}</TibiaText>
                </View>
            ) : null}

            {/* Botão voltar para conta após sucesso */}
            {isSuccess ? (
                <View style={styles.backBtnContainer}>
                    <TibiaButton
                        label="Voltar para Meus Chars"
                        variant="secondary"
                        onPress={handleBackToAccount}
                    />
                </View>
            ) : null}

            {/* Warning de cache */}
            <View style={styles.warningNotice}>
                <TibiaText style={styles.warningText}>
                    {APP_TEXTS.questVinculo.waitWarning}
                </TibiaText>
            </View>

            {/* Nota pós-vínculo */}
            <View style={styles.infoNotice}>
                <TibiaText style={styles.infoText}>
                    {APP_TEXTS.questVinculo.postVerifyNote}
                </TibiaText>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
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
    description: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
        marginBottom: theme.spacing.md,
    },

    // ── Loading ──
    loadingContainer: {
        marginTop: theme.spacing.md,
    },

    // ── Success ──
    successNotice: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderWidth: 1,
        borderColor: theme.colors.badgeStatusBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    successText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.accentGreen,
        lineHeight: theme.lineHeights.body,
    },

    // ── Error ──
    errorNotice: {
        backgroundColor: theme.colors.feedbackErrorBg,
        borderWidth: 1,
        borderColor: theme.colors.accentRed,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    errorText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.accentRed,
        lineHeight: theme.lineHeights.body,
    },

    // ── Warning ──
    warningNotice: {
        backgroundColor: theme.colors.badgePendingBg,
        borderWidth: 1,
        borderColor: theme.colors.badgePendingBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    warningText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.badgePendingText,
        lineHeight: theme.lineHeights.body,
    },

    // ── Info ──
    infoNotice: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderWidth: 1,
        borderColor: theme.colors.badgeStatusBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    infoText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
    },

    // ── Back button ──
    backBtnContainer: {
        marginTop: theme.spacing.md,
    },
});

export default VerifyCharScreen;
