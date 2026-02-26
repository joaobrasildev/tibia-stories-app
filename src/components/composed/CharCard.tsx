import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import TibiaBadge from '@/components/base/TibiaBadge';
import { getVocationColor, getVocationAbbr } from '@/constants/vocations';

interface CharCardProps {
    name: string;
    level: number;
    vocation: string;
    world: string;
    storyTitle: string | null;
    avatarEmoji: string | null;
    isHighlighted: boolean;
    onPress: () => void;
}

function CharCard({
    name,
    level,
    vocation,
    world,
    storyTitle,
    avatarEmoji,
    isHighlighted,
    onPress,
}: CharCardProps) {
    const vocAbbr = getVocationAbbr(vocation);
    const vocColor = getVocationColor(vocation);

    return (
        <TouchableOpacity
            style={[styles.card, isHighlighted && styles.highlighted]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {avatarEmoji ? (
                <View style={styles.avatar}>
                    <TibiaText style={styles.avatarEmoji}>{avatarEmoji}</TibiaText>
                </View>
            ) : null}
            <View style={styles.info}>
                <View style={styles.header}>
                    <TibiaText style={styles.name} numberOfLines={1}>{name}</TibiaText>
                    <TibiaBadge
                        label={vocAbbr}
                        variant="vocation"
                        color={vocColor}
                        borderColor={vocColor}
                    />
                </View>
                <TibiaText style={styles.details}>
                    Level {level} • {world}
                </TibiaText>
                {storyTitle ? (
                    <TibiaText style={styles.story} numberOfLines={1}>
                        📜 {storyTitle}
                    </TibiaText>
                ) : null}
            </View>
            <TibiaText style={styles.arrow}>›</TibiaText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.cardBg,
        ...theme.borders.card,
        borderRadius: theme.radius.sm,
        marginBottom: 6,
    },
    highlighted: {
        borderColor: theme.colors.gold,
        borderWidth: 2,
        shadowColor: theme.colors.highlightGlow,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 6,
    },
    avatar: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.panelAlt,
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.sm,
    },
    avatarEmoji: {
        fontSize: 22,
    },
    info: {
        flex: 1,
        gap: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    details: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
    },
    story: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textMuted,
        marginTop: 2,
    },
    arrow: {
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textMuted,
    },
});

export default React.memo(CharCard);
