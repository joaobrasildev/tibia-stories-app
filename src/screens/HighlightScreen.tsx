/**
 * HighlightScreen — Tela de Destaque de Personagem
 * Permite comprar destaque via IAP (3 planos: 7/30/365 dias).
 * Referência: general-plan.md seção 8.2 (Tela 4.4), architecture.md seção 13.7
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Platform,
    Animated,
    StyleSheet,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TibiaText from '@/components/base/TibiaText';
import TibiaPanel from '@/components/base/TibiaPanel';
import TibiaHeader from '@/components/base/TibiaHeader';
import TibiaLoading from '@/components/base/TibiaLoading';
import { getCharById } from '@/repositories/charsRepository';
import { updateHighlightStatus } from '@/repositories/charsRepository';
import { updateCharacter, createHighlightPayment } from '@/services/firestoreService';
import {
    initializePurchases,
    cleanupPurchases,
    purchaseHighlight,
    getHighlightPlans,
    getPlanInfo,
    isIAPAvailable,
} from '@/services/purchaseService';
import type { HighlightPlanInfo } from '@/services/purchaseService';
import { canHighlight, calculateExtendedExpiry, isHighlightActive } from '@/rules/highlightRules';
import { requireOnline } from '@/services/syncService';
import { useMyCharsStore } from '@/stores/useMyCharsStore';
import { useCharsStore } from '@/stores/useCharsStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { theme } from '@/theme';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import type { HighlightPlan } from '@/types/market';
import type { PurchaseStatus } from '@/types/market';

type HighlightRouteProp = RouteProp<RootStackParamList, 'Highlight'>;
type HighlightNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Highlight'>;

function HighlightScreen() {
    const route = useRoute<HighlightRouteProp>();
    const navigation = useNavigation<HighlightNavigationProp>();
    const { charId } = route.params;

    const userToken = useAuthStore((s) => s.userToken);
    const loadMyChars = useMyCharsStore((s) => s.loadMyChars);
    const loadChars = useCharsStore((s) => s.loadChars);

    const [charName, setCharName] = useState('Personagem');
    const [selectedPlan, setSelectedPlan] = useState<HighlightPlan>('7d');
    const [purchaseStatus, setPurchaseStatus] = useState<PurchaseStatus>('idle');
    const [feedback, setFeedback] = useState<string | null>(null);
    const [eligibility, setEligibility] = useState<{ eligible: boolean; reason?: string }>({ eligible: true });
    const [hasActiveHighlight, setHasActiveHighlight] = useState(false);
    const [iapAvailable, setIapAvailable] = useState(true);

    const plans = useMemo(() => getHighlightPlans(), []);
    const currentPlan = useMemo(() => getPlanInfo(selectedPlan), [selectedPlan]);

    // Glow pulse animation
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: false,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false,
                }),
            ]),
        );
        pulse.start();
        return () => pulse.stop();
    }, [glowAnim]);

    const animatedShadowRadius = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [8, 16],
    });

    // Carrega dados do char e inicializa IAP
    useEffect(() => {
        const char = getCharById(charId);
        if (char) {
            setCharName(char.name);
            setEligibility(canHighlight(char));
            setHasActiveHighlight(isHighlightActive(char.highlight_until));
        }

        (async () => {
            const available = await isIAPAvailable();
            setIapAvailable(available);
            if (available) {
                await initializePurchases();
            }
        })().catch((err) => {
            console.error('[HighlightScreen] Failed to init IAP:', err);
            setIapAvailable(false);
        });

        return () => {
            cleanupPurchases().catch(() => { });
        };
    }, [charId]);

    const handleSelectPlan = useCallback((plan: HighlightPlan) => {
        if (purchaseStatus !== 'idle' && purchaseStatus !== 'error') return;
        setSelectedPlan(plan);
        setFeedback(null);
    }, [purchaseStatus]);

    const handlePurchase = useCallback(async () => {
        setPurchaseStatus('purchasing');
        setFeedback(null);

        try {
            requireOnline();

            const char = getCharById(charId);
            if (!char) {
                setPurchaseStatus('error');
                setFeedback('Char não encontrado.');
                return;
            }

            const { eligible, reason } = canHighlight(char);
            if (!eligible) {
                setPurchaseStatus('error');
                setFeedback(reason ?? 'Char não elegível para destaque.');
                return;
            }

            // Executa compra via IAP
            const result = await purchaseHighlight(selectedPlan);

            if (!result.success) {
                setPurchaseStatus('error');
                setFeedback(result.error ?? 'Erro ao processar a compra.');
                return;
            }

            setPurchaseStatus('validating');

            // Calcula nova data de expiração (estende se já ativo)
            const planInfo = getPlanInfo(selectedPlan);
            const newExpiry = calculateExtendedExpiry(char.highlight_until, planInfo.durationDays);
            const expiryISO = newExpiry.toISOString();

            // Atualiza Firestore (fonte da verdade)
            await updateCharacter(charId, {
                is_highlighted: true,
                highlight_until: expiryISO,
                updated_at: new Date().toISOString(),
            });

            // Registra pagamento no Firestore
            await createHighlightPayment({
                character_id: charId,
                user_token: userToken ?? '',
                platform: Platform.OS === 'ios' ? 'ios' : 'android',
                transaction_id: result.transactionId,
                plan: selectedPlan,
                amount_brl: planInfo.priceBrl,
                duration_days: planInfo.durationDays,
                purchased_at: new Date().toISOString(),
                expires_at: expiryISO,
                status: 'active',
            });

            // Atualiza SQLite local
            updateHighlightStatus(charId, true, expiryISO);

            // Recarrega stores
            if (userToken) {
                loadMyChars(userToken);
            }
            loadChars();

            setPurchaseStatus('success');
            setHasActiveHighlight(true);
            setFeedback(
                `✅ Compra realizada com sucesso! Seu personagem está em destaque na Home por ${planInfo.durationDays} dias.`,
            );
        } catch (err: unknown) {
            setPurchaseStatus('error');
            const message = err instanceof Error ? err.message : 'Erro desconhecido.';
            if (message.includes('Sem conexão')) {
                setFeedback('⚠️ Sem conexão com a internet. Conecte-se para realizar esta ação.');
            } else {
                setFeedback(message);
            }
        }
    }, [charId, selectedPlan, userToken, loadMyChars, loadChars]);

    const isProcessing = purchaseStatus === 'purchasing' || purchaseStatus === 'validating';
    const canBuy = eligibility.eligible && !isProcessing && iapAvailable;

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
            {/* Painel principal */}
            <TibiaPanel>
                <TibiaHeader title={`Destacar ${charName}`} icon="⭐" />
                <View style={styles.panelBody}>
                    <TibiaText style={styles.description}>
                        Ao destacar seu personagem, ele aparecerá na{' '}
                        <TibiaText style={styles.descriptionBold}>página principal</TibiaText>{' '}
                        do app, visível para todos os usuários!
                    </TibiaText>

                    {hasActiveHighlight && (
                        <View style={styles.activeNotice}>
                            <TibiaText style={styles.activeNoticeText}>
                                ⭐ Seu char já está em destaque! Comprar novamente irá estender a duração.
                            </TibiaText>
                        </View>
                    )}

                    {!iapAvailable && (
                        <View style={styles.iapUnavailableNotice}>
                            <TibiaText style={styles.iapUnavailableText}>
                                ⚠️ Compras no app não estão disponíveis neste dispositivo. Use um build de desenvolvimento ou produção para realizar compras.
                            </TibiaText>
                        </View>
                    )}

                    {/* Planos de destaque */}
                    <View style={styles.plansContainer}>
                        {plans.map((plan) => (
                            <PlanCard
                                key={plan.plan}
                                plan={plan}
                                selected={selectedPlan === plan.plan}
                                onSelect={handleSelectPlan}
                                disabled={isProcessing}
                            />
                        ))}
                    </View>

                    {/* Detalhes */}
                    <View style={styles.detailsContainer}>
                        <TibiaText style={styles.detailText}>
                            ✦ Seu personagem aparecerá com destaque dourado e estrela.
                        </TibiaText>
                        <TibiaText style={styles.detailText}>
                            ✦ A compra é processada pela{' '}
                            {Platform.OS === 'ios' ? 'App Store' : 'Google Play'}.
                        </TibiaText>
                        <TibiaText style={styles.detailText}>
                            ✦ O destaque é ativado imediatamente após a confirmação.
                        </TibiaText>
                    </View>

                    {/* Botão de compra com glow */}
                    {isProcessing ? (
                        <TibiaLoading
                            message={
                                purchaseStatus === 'purchasing'
                                    ? 'Processando compra...'
                                    : 'Validando...'
                            }
                        />
                    ) : (
                        <Animated.View
                            style={[
                                styles.glowWrapper,
                                canBuy && {
                                    shadowColor: '#D4A66A',
                                    shadowOffset: { width: 0, height: 0 },
                                    shadowOpacity: 0.4,
                                    shadowRadius: animatedShadowRadius,
                                    elevation: 6,
                                },
                            ]}
                        >
                            <TouchableOpacity
                                style={[styles.purchaseBtn, !canBuy && styles.purchaseBtnDisabled]}
                                onPress={handlePurchase}
                                disabled={!canBuy}
                                activeOpacity={0.7}
                            >
                                <TibiaText style={styles.purchaseBtnText}>
                                    ⭐ Comprar Destaque — R$ {currentPlan.priceBrl.toFixed(2).replace('.', ',')}
                                </TibiaText>
                            </TouchableOpacity>
                        </Animated.View>
                    )}

                    {/* Feedback */}
                    {feedback && (
                        <View
                            style={[
                                styles.feedbackContainer,
                                purchaseStatus === 'success'
                                    ? styles.feedbackSuccess
                                    : styles.feedbackError,
                            ]}
                        >
                            <TibiaText style={styles.feedbackText}>{feedback}</TibiaText>
                        </View>
                    )}

                    {/* Mensagem de inelegibilidade */}
                    {!eligibility.eligible && (
                        <View style={styles.ineligibleContainer}>
                            <TibiaText style={styles.ineligibleText}>
                                ⚠️ {eligibility.reason}
                            </TibiaText>
                        </View>
                    )}
                </View>
            </TibiaPanel>

            {/* Notice de requisitos */}
            <View style={styles.notice}>
                <TibiaText style={styles.noticeText}>
                    ℹ️ Requisitos: personagem verificado e com história escrita.
                </TibiaText>
            </View>
        </ScrollView>
    );
}

// ── PlanCard ───────────────────────────────────────────────

interface PlanCardProps {
    plan: HighlightPlanInfo;
    selected: boolean;
    onSelect: (plan: HighlightPlan) => void;
    disabled: boolean;
}

function PlanCard({ plan, selected, onSelect, disabled }: PlanCardProps) {
    return (
        <TouchableOpacity
            style={[
                styles.planCard,
                selected && styles.planCardSelected,
                disabled && styles.planCardDisabled,
            ]}
            onPress={() => onSelect(plan.plan)}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <TibiaText style={[styles.planPrice, selected && styles.planPriceSelected]}>
                R$ {plan.priceBrl.toFixed(2).replace('.', ',')}
            </TibiaText>
            <TibiaText style={styles.planDesc}>
                Destaque por {plan.durationDays} dias na Home
            </TibiaText>
        </TouchableOpacity>
    );
}

// ── Styles ─────────────────────────────────────────────────

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

    // Description
    description: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
        marginBottom: theme.spacing.md,
    },
    descriptionBold: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.textPrimary,
    },

    // Active highlight notice
    activeNotice: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderWidth: 1,
        borderColor: theme.colors.badgeStatusBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    activeNoticeText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
    },

    // Plans
    plansContainer: {
        gap: theme.spacing.cardGap,
        marginBottom: theme.spacing.lg,
    },
    planCard: {
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.panelAlt,
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.md,
    },
    planCardSelected: {
        borderColor: theme.colors.borderGold,
        ...theme.shadows.goldenGlow,
    },
    planCardDisabled: {
        opacity: 0.5,
    },
    planPrice: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.title,
        color: theme.colors.textDark,
    },
    planPriceSelected: {
        color: theme.colors.textPrimary,
    },
    planDesc: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textPrimary,
        marginTop: theme.spacing.xs,
    },

    // Details
    detailsContainer: {
        marginBottom: theme.spacing.lg,
    },
    detailText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        lineHeight: theme.lineHeights.body,
    },

    // Purchase button
    glowWrapper: {
        borderRadius: theme.radius.sm,
        marginBottom: theme.spacing.md,
    },
    purchaseBtn: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        backgroundColor: theme.colors.gold,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
        alignItems: 'center',
        justifyContent: 'center',
    },
    purchaseBtnDisabled: {
        opacity: 0.5,
    },
    purchaseBtnText: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textDark,
    },

    // Feedback
    feedbackContainer: {
        padding: theme.spacing.md,
        borderRadius: theme.radius.sm,
        borderWidth: 1,
        marginTop: theme.spacing.md,
    },
    feedbackSuccess: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderColor: theme.colors.badgeStatusBorder,
    },
    feedbackError: {
        backgroundColor: theme.colors.feedbackErrorBg,
        borderColor: theme.colors.accentRed,
    },
    feedbackText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.textPrimary,
        lineHeight: theme.lineHeights.body,
    },

    // Ineligible
    ineligibleContainer: {
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
    },
    ineligibleText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
    },

    // Notice
    notice: {
        backgroundColor: theme.colors.feedbackSuccessBg,
        borderWidth: 1,
        borderColor: theme.colors.badgeStatusBorder,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    noticeText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
    },

    // IAP unavailable
    iapUnavailableNotice: {
        backgroundColor: theme.colors.feedbackErrorBg,
        borderWidth: 1,
        borderColor: theme.colors.accentRed,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    iapUnavailableText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textPrimary,
        lineHeight: theme.lineHeights.body,
    },
});

export default HighlightScreen;
