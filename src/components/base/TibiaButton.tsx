import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

interface TibiaButtonProps {
    label: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'glow';
    disabled?: boolean;
    onPress: () => void;
}

function TibiaButton({ label, variant = 'primary', disabled = false, onPress }: TibiaButtonProps) {
    return (
        <TouchableOpacity
            style={[styles.base, styles[variant], disabled && styles.disabled]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            <TibiaText style={[styles.label, variant === 'outline' ? styles.labelOutline : null]}>
                {label}
            </TibiaText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
    },
    primary: {
        backgroundColor: theme.colors.btnPrimary,
    },
    secondary: {
        backgroundColor: theme.colors.panelAlt,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: theme.colors.borderGold,
    },
    glow: {
        backgroundColor: theme.colors.gold,
        shadowColor: theme.colors.highlightGlow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 8,
    },
    disabled: {
        opacity: 0.5,
    },
    label: {
        fontFamily: theme.fonts.bodySemiBold,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textDark,
    },
    labelOutline: {
        color: theme.colors.textPrimary,
    },
});

export default React.memo(TibiaButton);
