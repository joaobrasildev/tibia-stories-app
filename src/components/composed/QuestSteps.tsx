/**
 * QuestSteps — Painel com instruções da Quest de Vínculo.
 * Props only, sem stores. Replica layout do protótipo (app.js renderVerifyCharacter).
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import TibiaText from '@/components/base/TibiaText';
import TibiaPanel from '@/components/base/TibiaPanel';
import TibiaHeader from '@/components/base/TibiaHeader';
import { APP_TEXTS } from '@/constants/app';
import { theme } from '@/theme';

interface QuestStepsProps {
    charName?: string;
}

const STEPS = [
    APP_TEXTS.questVinculo.step1,
    APP_TEXTS.questVinculo.step2,
    APP_TEXTS.questVinculo.step3,
    APP_TEXTS.questVinculo.step4,
    APP_TEXTS.questVinculo.step5,
];

function QuestSteps({ charName }: QuestStepsProps) {
    return (
        <TibiaPanel>
            <TibiaHeader title={APP_TEXTS.questVinculo.instructionsTitle} icon="📋" />
            <View style={styles.body}>
                {STEPS.map((step, index) => (
                    <View key={index} style={styles.stepRow}>
                        <View style={styles.stepNumContainer}>
                            <TibiaText style={styles.stepNum}>{index + 1}</TibiaText>
                        </View>
                        <TibiaText style={styles.stepText}>{step}</TibiaText>
                    </View>
                ))}
            </View>
        </TibiaPanel>
    );
}

const styles = StyleSheet.create({
    body: {
        padding: theme.spacing.md,
    },
    stepRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.md,
    },
    stepNumContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.btnPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.sm,
        marginTop: theme.spacing.xxs,
    },
    stepNum: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textDark,
    },
    stepText: {
        flex: 1,
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
    },
});

export default React.memo(QuestSteps);
