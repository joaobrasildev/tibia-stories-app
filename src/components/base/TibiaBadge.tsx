import React from 'react';
import { View, StyleSheet, TextStyle } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';

type BadgeVariant = 'rarity' | 'vocation' | 'status' | 'world' | 'level';

interface TibiaBadgeProps {
    label: string;
    variant?: BadgeVariant;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
}

function TibiaBadge({
    label,
    variant = 'rarity',
    color,
    backgroundColor,
    borderColor,
}: TibiaBadgeProps) {
    const variantStyle = variantStyles[variant] ?? variantStyles.rarity;

    return (
        <View
            style={[
                styles.badge,
                variantStyle.container,
                backgroundColor ? { backgroundColor } : undefined,
                borderColor ? { borderColor } : undefined,
            ]}
        >
            <TibiaText
                style={[
                    styles.label,
                    variantStyle.label as TextStyle,
                    color ? ({ color } as TextStyle) : null,
                ]}
            >
                {label}
            </TibiaText>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        paddingVertical: theme.spacing.xxs,
        paddingHorizontal: theme.spacing.sm,
        borderRadius: theme.radius.sm,
        ...theme.borders.panelInner,
        alignSelf: 'flex-start',
    },
    label: {
        fontSize: theme.fontSizes.xs,
        fontFamily: theme.fonts.bodySemiBold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});

const variantStyles = {
    rarity: {
        container: {
            backgroundColor: theme.colors.panel,
            borderColor: theme.colors.borderInner,
        },
        label: {
            color: theme.colors.textPrimary,
        },
    },
    vocation: {
        container: {
            backgroundColor: theme.colors.badgeVocationBg,
            borderColor: theme.colors.badgeVocationBorder,
        },
        label: {
            color: theme.colors.badgeVocationText,
        },
    },
    status: {
        container: {
            backgroundColor: theme.colors.badgeStatusBg,
            borderColor: theme.colors.badgeStatusBorder,
        },
        label: {
            color: theme.colors.badgeStatusText,
        },
    },
    world: {
        container: {
            backgroundColor: theme.colors.badgeWorldBg,
            borderColor: theme.colors.badgeWorldBorder,
        },
        label: {
            color: theme.colors.badgeWorldText,
        },
    },
    level: {
        container: {
            backgroundColor: theme.colors.badgeLevelBg,
            borderColor: theme.colors.badgeLevelBorder,
        },
        label: {
            color: theme.colors.textPrimary,
        },
    },
} as const;

export default React.memo(TibiaBadge);
