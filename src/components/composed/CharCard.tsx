import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import TibiaBadge from '@/components/base/TibiaBadge';
import { getVocationColor, getVocationAbbr, getVocationOutfitUrl } from '@/constants/vocations';

interface CharCardProps {
    name: string;
    level: number;
    vocation: string;
    world: string;
    storyTitle: string | null;
    avatarEmoji: string | null;
    avatarUrl: string | null;
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
    avatarUrl,
    isHighlighted,
    onPress,
}: CharCardProps) {
    const vocAbbr = getVocationAbbr(vocation);
    const vocColor = getVocationColor(vocation);
    const [imageError, setImageError] = useState(false);
    const displayUrl = avatarUrl && avatarUrl.startsWith('http') ? avatarUrl : getVocationOutfitUrl(vocation);
    const hasImage = !!displayUrl && !imageError;

    return (
        <TouchableOpacity
            style={[styles.card, isHighlighted && styles.highlighted]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.avatar}>
                {hasImage ? (
                    <Image
                        source={{ uri: displayUrl }}
                        style={styles.avatarImage}
                        resizeMode="contain"
                        onError={() => setImageError(true)}
                    />
                ) : avatarEmoji ? (
                    <TibiaText style={styles.avatarEmoji}>{avatarEmoji}</TibiaText>
                ) : (
                    <TibiaText style={styles.avatarEmoji}>🛡️</TibiaText>
                )}
            </View>
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
        gap: theme.spacing.cardGap,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.cardBg,
        ...theme.borders.card,
        borderRadius: theme.radius.sm,
        marginBottom: theme.spacing.gap,
    },
    highlighted: {
        ...theme.borders.panel,
        borderColor: theme.colors.gold,
        ...theme.shadows.highlightGlow,
    },
    avatar: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.panelAlt,
        ...theme.borders.panelInner,
        borderRadius: theme.radius.sm,
    },
    avatarEmoji: {
        fontSize: theme.fontSizes.xxl,
    },
    avatarImage: {
        width: 32,
        height: 32,
    },
    info: {
        flex: 1,
        gap: theme.spacing.xxs,
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
        marginTop: theme.spacing.xxs,
    },
    arrow: {
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textMuted,
    },
});

export default React.memo(CharCard);
