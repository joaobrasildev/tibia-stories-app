import React, { useState } from 'react';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { theme } from '@/theme';
import { getItemById } from '@/repositories/itemsRepository';
import { getRarityColor } from '@/constants/rarities';
import { ITEM_EMOJIS } from '@/constants/itemEmojis';
import { APP_TEXTS } from '@/constants/app';
import TibiaText from '@/components/base/TibiaText';
import TibiaBadge from '@/components/base/TibiaBadge';
import TibiaEmpty from '@/components/base/TibiaEmpty';
import type { RootStackParamList } from '@/navigation/AppNavigator';

type ItemDetailRouteProp = RouteProp<RootStackParamList, 'ItemDetail'>;

export default function ItemDetailScreen() {
    const route = useRoute<ItemDetailRouteProp>();
    const { id } = route.params;

    const item = getItemById(id);

    if (!item) {
        return (
            <View style={styles.container}>
                <TibiaEmpty message="Item não encontrado" icon="📦" />
            </View>
        );
    }

    const rarityColor = getRarityColor(item.rarity);
    const emoji = ITEM_EMOJIS[item.name] ?? '📦';
    const [imageError, setImageError] = useState(false);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Hero Section */}
            <View style={styles.hero}>
                <View style={styles.heroImage}>
                    {item.image_url && !imageError ? (
                        <Image
                            source={{ uri: item.image_url }}
                            style={styles.heroItemImage}
                            resizeMode="contain"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <TibiaText style={styles.heroEmoji}>{emoji}</TibiaText>
                    )}
                </View>
                <TibiaText style={styles.heroName}>{item.name}</TibiaText>
                <View style={styles.heroBadges}>
                    <TibiaBadge
                        label={item.rarity}
                        variant="rarity"
                        color={rarityColor}
                        borderColor={rarityColor}
                    />
                </View>
            </View>

            {/* Summary */}
            {item.summary ? (
                <View style={styles.summaryContainer}>
                    <TibiaText style={styles.summaryText}>{item.summary}</TibiaText>
                </View>
            ) : null}

            {/* Origem Section */}
            {item.origin ? (
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <TibiaText style={styles.sectionTitleText}>
                            {APP_TEXTS.itemDetail.originTitle}
                        </TibiaText>
                    </View>
                    <View style={styles.sectionBody}>
                        {item.origin.split('\n\n').map((paragraph, index) => (
                            <TibiaText
                                key={`origin-${index}`}
                                style={[
                                    styles.paragraph,
                                    index === item.origin!.split('\n\n').length - 1 && styles.paragraphLast,
                                ]}
                            >
                                {paragraph}
                            </TibiaText>
                        ))}
                    </View>
                </View>
            ) : null}

            {/* Lore Section */}
            {item.lore ? (
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <TibiaText style={styles.sectionTitleText}>
                            {APP_TEXTS.itemDetail.loreTitle}
                        </TibiaText>
                    </View>
                    <View style={styles.sectionBody}>
                        {item.lore.split('\n\n').map((paragraph, index) => (
                            <TibiaText
                                key={`lore-${index}`}
                                style={[
                                    styles.paragraph,
                                    index === item.lore!.split('\n\n').length - 1 && styles.paragraphLast,
                                ]}
                            >
                                {paragraph}
                            </TibiaText>
                        ))}
                    </View>
                </View>
            ) : null}

            {/* Mitos & Lendas Section */}
            {item.myths ? (
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <TibiaText style={styles.sectionTitleText}>
                            {APP_TEXTS.itemDetail.mythsTitle}
                        </TibiaText>
                    </View>
                    <View style={styles.sectionBody}>
                        {item.myths.split('\n\n').map((paragraph, index) => (
                            <TibiaText
                                key={`myth-${index}`}
                                style={[
                                    styles.paragraph,
                                    index === item.myths!.split('\n\n').length - 1 && styles.paragraphLast,
                                ]}
                            >
                                {paragraph}
                            </TibiaText>
                        ))}
                    </View>
                </View>
            ) : null}

            {/* Sources */}
            {item.sources ? (
                <View style={styles.sourcesContainer}>
                    <TibiaText style={styles.sourcesText}>
                        {APP_TEXTS.itemDetail.sourcesTitle}: {item.sources}
                    </TibiaText>
                </View>
            ) : null}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.panel,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxxl,
    },
    // Hero
    hero: {
        alignItems: 'center',
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.panelAlt,
        ...theme.borders.panel,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.sm,
        marginBottom: theme.spacing.md,
    },
    heroImage: {
        width: 96,
        height: 96,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.panel,
        ...theme.borders.panel,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.card,
    },
    heroEmoji: {
        fontSize: theme.fontSizes.emojiHero,
    },
    heroItemImage: {
        width: 64,
        height: 64,
    },
    heroName: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.xxl,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.gap,
        textAlign: 'center',
    },
    heroBadges: {
        flexDirection: 'row',
        gap: theme.spacing.gap,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    // Summary
    summaryContainer: {
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        backgroundColor: theme.colors.panelAlt,
        ...theme.borders.panel,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.sm,
    },
    summaryText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.textPrimary,
        lineHeight: theme.lineHeights.body,
    },
    // Sections
    section: {
        marginTop: theme.spacing.md,
    },
    sectionTitle: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.gold,
        ...theme.borders.panel,
        borderColor: theme.colors.borderInner,
        borderTopLeftRadius: theme.radius.sm,
        borderTopRightRadius: theme.radius.sm,
        borderBottomWidth: 0,
    },
    sectionTitleText: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.sectionTitle,
        color: theme.colors.textDark,
    },
    sectionBody: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.panel,
        ...theme.borders.panel,
        borderColor: theme.colors.borderInner,
        borderTopWidth: 0,
        borderBottomLeftRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
    },
    paragraph: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.paragraph,
        color: theme.colors.textPrimary,
        lineHeight: theme.lineHeights.body,
        marginBottom: theme.spacing.cardGap,
    },
    paragraphLast: {
        marginBottom: 0,
    },
    // Sources
    sourcesContainer: {
        marginTop: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderInner,
    },
    sourcesText: {
        fontFamily: theme.fonts.body,
        fontSize: theme.fontSizes.sm,
        color: theme.colors.textSecondary,
        lineHeight: theme.lineHeights.body,
    },
});
