import React from 'react';
import { Text, StyleSheet, TextStyle, TextProps, StyleProp } from 'react-native';
import { theme } from '@/theme';

interface TibiaTextProps extends TextProps {
    variant?: 'title' | 'body' | 'caption' | 'muted';
    style?: StyleProp<TextStyle>;
    children: React.ReactNode;
}

function TibiaText({ variant = 'body', style, children, ...rest }: TibiaTextProps) {
    return (
        <Text style={[styles.base, styles[variant], style]} {...rest}>
            {children}
        </Text>
    );
}

const styles = StyleSheet.create({
    base: {
        color: theme.colors.textPrimary,
    },
    title: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.xl,
        color: theme.colors.textPrimary,
    },
    body: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    caption: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
    },
    muted: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textMuted,
    },
});

export default React.memo(TibiaText);
