import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import TibiaBadge from '@/components/base/TibiaBadge';
import { getVocationColor, getVocationAbbr } from '@/constants/vocations';

interface HighlightedCharCardProps {
    name: string;
    level: number;
    vocation: string;
    world: string;
    storyTitle: string | null;
    avatarEmoji: string | null;
    avatarUrl: string | null;
    onPress: () => void;
}

function HighlightedCharCard({
    name,
    level,
    vocation,
    world,
    storyTitle,
    avatarEmoji,
    avatarUrl,
    onPress,
}: HighlightedCharCardProps) {
    const vocAbbr = getVocationAbbr(vocation);
    const vocColor = getVocationColor(vocation);
    const [imageError, setImageError] = useState(false);

    const hasImage = avatarUrl && avatarUrl.startsWith('http') && !imageError;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Star badge (top-right) — matches prototype .char-card.highlighted::before */}
            <View style={styles.starBadge}>
                <TibiaText style={styles.starText}>⭐</TibiaText>
            </View>

            <View style={styles.avatar}>
                {hasImage ? (
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatarImage}
                        resizeMode="contain"
                        onError={() => setImageError(true)}
                    />
                ) : avatarEmoji ? (
                    <TibiaText style={styles.avatarEmoji}>{avatarEmoji}</TibiaText>
                ) : null}
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
        gap: 10,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.cardBg,
        borderRadius: theme.radius.sm,
        marginBottom: 6,
        // Golden highlight border — matches prototype .char-card.highlighted
        borderWidth: 2,
        borderColor: theme.colors.borderGold,
        // Golden glow shadow — matches prototype highlight-glow
        shadowColor: theme.colors.gold,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    starBadge: {
        position: 'absolute',
        top: -8,
        right: -4,
        zIndex: 1,
    },
    starText: {
        fontSize: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.panelAlt,
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.sm,
    },
    avatarEmoji: {
        fontSize: 26,
    },
    avatarImage: {
        width: 44,
        height: 44,
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

export default React.memo(HighlightedCharCard);
