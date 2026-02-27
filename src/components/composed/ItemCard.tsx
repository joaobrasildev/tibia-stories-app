import React, { useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import TibiaText from '@/components/base/TibiaText';
import TibiaBadge from '@/components/base/TibiaBadge';
import { getRarityColor } from '@/constants/rarities';

interface ItemCardProps {
    name: string;
    emoji: string;
    imageUrl: string | null;
    rarity: string;
    onPress: () => void;
}

function ItemCard({ name, emoji, imageUrl, rarity, onPress }: ItemCardProps) {
    const rarityColor = getRarityColor(rarity);
    const [imageError, setImageError] = useState(false);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.sprite}>
                {imageUrl && !imageError ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.image}
                        resizeMode="contain"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <TibiaText style={styles.emoji}>{emoji}</TibiaText>
                )}
            </View>
            <View style={styles.info}>
                <TibiaText style={styles.name}>{name}</TibiaText>
                <TibiaBadge
                    label={`★ ${rarity}`}
                    variant="rarity"
                    color={rarityColor}
                    borderColor={rarityColor}
                />
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
    sprite: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.panelAlt,
        borderWidth: 1,
        borderColor: theme.colors.borderInner,
        borderRadius: 2,
    },
    emoji: {
        fontSize: 22,
    },
    image: {
        width: 28,
        height: 28,
    },
    info: {
        flex: 1,
        gap: 2,
    },
    name: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.md,
        color: theme.colors.textPrimary,
    },
    arrow: {
        fontSize: theme.fontSizes.lg,
        color: theme.colors.textMuted,
    },
});

export default React.memo(ItemCard);
