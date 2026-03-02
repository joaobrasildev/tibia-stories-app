/**
 * OfflineBanner — Banner "Modo offline" visível quando sem conexão.
 * Referência: architecture.md seção 10.2, execution-plan.md Fase 11
 *
 * Componente composed com React.memo.
 * NÃO acessa stores — recebe isOnline via prop.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import TibiaText from '@/components/base/TibiaText';
import { theme } from '@/theme';

interface OfflineBannerProps {
    isOnline: boolean;
}

function OfflineBanner({ isOnline }: OfflineBannerProps) {
    if (isOnline) return null;

    return (
        <View style={styles.container}>
            <TibiaText style={styles.text}>
                📡 Modo offline — dados da última sincronização
            </TibiaText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.feedbackErrorBg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.accentRed,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        alignItems: 'center',
    },
    text: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.accentRed,
        lineHeight: theme.lineHeights.body,
    },
});

export default React.memo(OfflineBanner);
