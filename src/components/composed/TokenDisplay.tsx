import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface TokenDisplayProps {
    token: string;
    onCopy?: () => void;
}

function TokenDisplay({ token, onCopy }: TokenDisplayProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        await Clipboard.setStringAsync(token);
        setCopied(true);
        onCopy?.();
        setTimeout(() => setCopied(false), 2000);
    }, [token, onCopy]);

    return (
        <View style={styles.container}>
            <TibiaText style={styles.label}>Seu token único e pessoal</TibiaText>
            <TibiaText style={styles.tokenValue}>{token}</TibiaText>
            <TouchableOpacity
                style={[styles.copyBtn, copied && styles.copyBtnCopied]}
                onPress={handleCopy}
                activeOpacity={0.7}
            >
                <TibiaText style={[styles.copyBtnText, copied && styles.copyBtnTextCopied]}>
                    {copied ? '✅ Copiado!' : '📋 Copiar Token'}
                </TibiaText>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.tokenBg,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: theme.colors.tokenBorder,
        borderRadius: theme.radius.md,
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.body,
        color: theme.colors.tokenLabelText,
        marginBottom: theme.spacing.gap,
    },
    tokenValue: {
        fontFamily: 'Courier New',
        fontSize: theme.fontSizes.xl,
        color: theme.colors.tokenText,
        letterSpacing: 1,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    copyBtn: {
        marginTop: theme.spacing.cardGap,
        paddingVertical: theme.spacing.gap,
        paddingHorizontal: theme.spacing.xl,
        backgroundColor: theme.colors.btnPrimary,
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.xs,
    },
    copyBtnCopied: {
        backgroundColor: theme.colors.tokenCopiedBg,
        borderColor: theme.colors.tokenCopiedBorder,
    },
    copyBtnText: {
        fontSize: theme.fontSizes.sm,
        fontFamily: theme.fonts.bodySemiBold,
        color: theme.colors.textDark,
    },
    copyBtnTextCopied: {
        color: theme.colors.tokenCopiedText,
    },
});

export default React.memo(TokenDisplay);
