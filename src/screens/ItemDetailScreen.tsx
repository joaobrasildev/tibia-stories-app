import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
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

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Hero Section */}
            <View style={styles.hero}>
                <View style={styles.heroImage}>
                    <TibiaText style={styles.heroEmoji}>{emoji}</TibiaText>
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

            {/* Origem Section */}
            {item.history ? (
                <View style={styles.section}>
                    <View style={styles.sectionTitle}>
                        <TibiaText style={styles.sectionTitleText}>
                            {APP_TEXTS.itemDetail.originTitle}
                        </TibiaText>
                    </View>
                    <View style={styles.sectionBody}>
                        {item.history.split('\n\n').map((paragraph, index) => (
                            <TibiaText
                                key={`origin-${index}`}
                                style={[
                                    styles.paragraph,
                                    index === item.history!.split('\n\n').length - 1 && styles.paragraphLast,
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
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
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
        borderWidth: 2,
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
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderRadius: theme.radius.md,
        marginBottom: theme.spacing.md,
        ...theme.shadows.card,
    },
    heroEmoji: {
        fontSize: 64,
    },
    heroName: {
        fontFamily: theme.fonts.title,
        fontSize: theme.fontSizes.xxl,
        color: theme.colors.textPrimary,
        marginBottom: 6,
        textAlign: 'center',
    },
    heroBadges: {
        flexDirection: 'row',
        gap: 6,
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    // Sections
    section: {
        marginTop: theme.spacing.md,
    },
    sectionTitle: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        backgroundColor: theme.colors.gold,
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderTopLeftRadius: theme.radius.sm,
        borderTopRightRadius: theme.radius.sm,
        borderBottomWidth: 0,
    },
    sectionTitleText: {
        fontFamily: theme.fonts.title,
        fontSize: 17,
        color: theme.colors.textDark,
    },
    sectionBody: {
        padding: theme.spacing.md,
        backgroundColor: theme.colors.panel,
        borderWidth: 2,
        borderColor: theme.colors.borderInner,
        borderTopWidth: 0,
        borderBottomLeftRadius: theme.radius.sm,
        borderBottomRightRadius: theme.radius.sm,
    },
    paragraph: {
        fontFamily: theme.fonts.body,
        fontSize: 13,
        color: theme.colors.textPrimary,
        lineHeight: 22,
        marginBottom: 10,
    },
    paragraphLast: {
        marginBottom: 0,
    },
});
